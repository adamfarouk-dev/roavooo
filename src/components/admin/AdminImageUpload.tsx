import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ADMIN_IMAGE_BUCKET = "roavooo-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type AdminImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder: "cities" | "places";
  label: string;
  placeholder: string;
  onUploadingChange?: (uploading: boolean) => void;
};

const getImageExtension = (file: File) => {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && ["jpg", "jpeg", "png", "webp", "avif"].includes(fromName)) {
    return fromName;
  }

  return file.type.split("/")[1] || "jpg";
};

const createStoragePath = (folder: AdminImageUploadProps["folder"], file: File) => {
  const extension = getImageExtension(file);
  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
};

export function AdminImageUpload({
  value,
  onChange,
  folder,
  label,
  placeholder,
  onUploadingChange,
}: AdminImageUploadProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState(value);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!localPreviewUrl) {
      setPreviewUrl(value);
    }
  }, [localPreviewUrl, value]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const setUploadingState = (nextUploading: boolean) => {
    setUploading(nextUploading);
    onUploadingChange?.(nextUploading);
  };

  const handleUrlChange = (nextUrl: string) => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }

    onChange(nextUrl);
    setPreviewUrl(nextUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Unsupported image type",
        description: "Upload a JPG, PNG, WebP, or AVIF image.",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast({
        variant: "destructive",
        title: "Image is too large",
        description: "Upload an image under 5 MB.",
      });
      return;
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    setPreviewUrl(objectUrl);
    setUploadingState(true);

    const storagePath = createStoragePath(folder, file);
    const { error } = await supabase.storage
      .from(ADMIN_IMAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not upload image",
        description: error.message,
      });
      setUploadingState(false);
      return;
    }

    const { data } = supabase.storage
      .from(ADMIN_IMAGE_BUCKET)
      .getPublicUrl(storagePath);

    onChange(data.publicUrl);
    setPreviewUrl(data.publicUrl);
    setUploadingState(false);

    toast({
      title: "Image uploaded",
      description: "The public image URL is ready to save.",
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <input
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full p-3 rounded-lg bg-muted"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {uploading
            ? "Uploading image..."
            : "Upload JPG, PNG, WebP, or AVIF under 5 MB."}
        </p>
      </div>

      <input
        name="image_url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleUrlChange(e.target.value)}
        className="w-full p-3 rounded-lg bg-muted"
      />

      {previewUrl.trim() && (
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <SafeImage
            src={previewUrl}
            alt={`${label} preview`}
            className="h-56 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
