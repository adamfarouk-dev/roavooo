import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function AdminEditCity() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: "",
    slug: "",
    name: "",
    image_url: "",
    tagline_en: "",
    tagline_fr: "",
    description_en: "",
    description_fr: "",
    tip_best_time_en: "",
    tip_best_time_fr: "",
    tip_packing_en: "",
    tip_packing_fr: "",
    tip_etiquette_en: "",
    tip_etiquette_fr: "",
    tip_transport_en: "",
    tip_transport_fr: "",
    tip_phrases_en: "",
    tip_phrases_fr: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        setLocation("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Could not load city",
          description: error?.message || "City not found",
        });
        setLocation("/admin");
        return;
      }

      setForm({
        id: data.id ?? "",
        slug: data.slug ?? "",
        name: data.name ?? "",
        image_url: data.image_url ?? "",
        tagline_en: data.tagline_en ?? "",
        tagline_fr: data.tagline_fr ?? "",
        description_en: data.description_en ?? "",
        description_fr: data.description_fr ?? "",
        tip_best_time_en: data.tip_best_time_en ?? "",
        tip_best_time_fr: data.tip_best_time_fr ?? "",
        tip_packing_en: data.tip_packing_en ?? "",
        tip_packing_fr: data.tip_packing_fr ?? "",
        tip_etiquette_en: data.tip_etiquette_en ?? "",
        tip_etiquette_fr: data.tip_etiquette_fr ?? "",
        tip_transport_en: data.tip_transport_en ?? "",
        tip_transport_fr: data.tip_transport_fr ?? "",
        tip_phrases_en: data.tip_phrases_en ?? "",
        tip_phrases_fr: data.tip_phrases_fr ?? "",
      });

      setLoading(false);
    };

    load();
  }, [id, setLocation, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = Object.entries(form).filter(
      ([key, value]) => key !== "id" && !value.trim()
    );

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing city details",
        description: "Fill out all city fields before saving.",
      });
      return;
    }

    const payload = {
      slug: form.slug,
      name: form.name,
      image_url: form.image_url,
      tagline_en: form.tagline_en,
      tagline_fr: form.tagline_fr,
      description_en: form.description_en,
      description_fr: form.description_fr,
      tip_best_time_en: form.tip_best_time_en,
      tip_best_time_fr: form.tip_best_time_fr,
      tip_packing_en: form.tip_packing_en,
      tip_packing_fr: form.tip_packing_fr,
      tip_etiquette_en: form.tip_etiquette_en,
      tip_etiquette_fr: form.tip_etiquette_fr,
      tip_transport_en: form.tip_transport_en,
      tip_transport_fr: form.tip_transport_fr,
      tip_phrases_en: form.tip_phrases_en,
      tip_phrases_fr: form.tip_phrases_fr,
    };

    const { error } = await supabase.from("cities").update(payload).eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not update city",
        description: error.message,
      });
      return;
    }

    toast({
      title: "City updated",
      description: `${form.name} was saved successfully.`,
    });
    setLocation("/admin");
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">Edit City</h1>
        <p className="text-muted-foreground mb-8">Update this city.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <input
            name="id"
            placeholder="ID"
            value={form.id}
            className="w-full p-3 rounded-lg bg-muted opacity-70"
            disabled
          />

          <input
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="name"
            placeholder="City name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="image_url"
            placeholder="Hero image URL"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tagline_en"
            placeholder="Tagline EN"
            value={form.tagline_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tagline_fr"
            placeholder="Tagline FR"
            value={form.tagline_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <textarea
            name="description_en"
            placeholder="Description EN"
            value={form.description_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[120px]"
            required
          />

          <textarea
            name="description_fr"
            placeholder="Description FR"
            value={form.description_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[120px]"
            required
          />

          <input
            name="tip_best_time_en"
            placeholder="Best time EN"
            value={form.tip_best_time_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_best_time_fr"
            placeholder="Best time FR"
            value={form.tip_best_time_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_packing_en"
            placeholder="Packing EN"
            value={form.tip_packing_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_packing_fr"
            placeholder="Packing FR"
            value={form.tip_packing_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_etiquette_en"
            placeholder="Etiquette EN"
            value={form.tip_etiquette_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_etiquette_fr"
            placeholder="Etiquette FR"
            value={form.tip_etiquette_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_transport_en"
            placeholder="Transport EN"
            value={form.tip_transport_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_transport_fr"
            placeholder="Transport FR"
            value={form.tip_transport_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_phrases_en"
            placeholder="Useful phrases EN"
            value={form.tip_phrases_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_phrases_fr"
            placeholder="Useful phrases FR"
            value={form.tip_phrases_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setLocation("/admin")}
              className="border border-border px-5 py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
