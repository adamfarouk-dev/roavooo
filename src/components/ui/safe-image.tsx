import { useEffect, useState } from "react";
import type { ImgHTMLAttributes } from "react";

const DEFAULT_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23ede5d8'/%3E%3Cpath d='M0 580c150-92 274-118 398-76 97 33 165 95 270 80 132-18 200-144 330-146 78-1 148 42 202 90v272H0z' fill='%23d5b982'/%3E%3Cpath d='M0 664c156-58 282-68 408-28 108 34 192 80 314 45 121-35 195-125 320-110 66 8 118 35 158 66v163H0z' fill='%239b7a45' opacity='.55'/%3E%3Ccircle cx='890' cy='196' r='78' fill='%23c96f45' opacity='.82'/%3E%3Ctext x='600' y='414' text-anchor='middle' font-family='Georgia, serif' font-size='72' font-weight='700' fill='%23382f26'%3ERoavooo%3C/text%3E%3C/svg%3E";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  loading = "lazy",
  decoding = "async",
  ...props
}: SafeImageProps) {
  const initialSrc = src || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      {...props}
      src={currentSrc}
      loading={loading}
      decoding={decoding}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

