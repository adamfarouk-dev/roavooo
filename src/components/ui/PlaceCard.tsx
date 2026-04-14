import { useState } from "react";
import { Link } from "wouter";
import { Heart, MapPin, Star, FolderPlus } from "lucide-react";
import { Place } from "@/lib/data";
import { useFavorites } from "@/hooks/use-favorites";
import { useLanguage } from "@/contexts/LanguageContext";
import { SaveToTripModal } from "@/components/trips/SaveToTripModal";

interface PlaceCardProps {
  place: Place;
  showSaveToTrip?: boolean;
}

export function PlaceCard({
  place,
  showSaveToTrip = false,
}: PlaceCardProps) {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const { t } = useLanguage();
  const isFav = isFavorite(place.id);

  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const categoryLabel = t.card.category[place.category] ?? place.category;
  const translatedPlace = t.place.content?.[
    place.id as keyof typeof t.place.content
  ];
  const description = translatedPlace?.description ?? place.description;

  return (
    <>
      <div className="group flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-border hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          <Link href={`/place/${place.id}`} className="block w-full h-full">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-xs font-semibold rounded-full uppercase tracking-wider text-primary border border-primary/30">
              {categoryLabel}
            </span>
          </div>

          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await toggleFavorite(place.id);
            }}
            disabled={loading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
              isFav
                ? "bg-primary/20 border border-primary/40"
                : "bg-black/40 border border-white/20 hover:bg-black/60"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            type="button"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? "fill-primary text-primary" : "text-white"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <Link href={`/place/${place.id}`} className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 leading-snug">
                {place.name}
              </h3>
            </Link>

            <div className="flex items-center gap-1 shrink-0 bg-muted px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-semibold text-foreground">
                {place.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{place.location}</span>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-grow mb-4">
            {description}
          </p>

          <div className="pt-4 border-t border-border/50 mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <div>
                {place.pricePerNight && (
                  <span className="font-bold text-foreground text-sm">
                    ${place.pricePerNight}
                    <span className="text-muted-foreground text-xs font-normal ml-1">
                      {t.card.perNight}
                    </span>
                  </span>
                )}

                {place.priceRange && (
                  <span className="font-bold text-primary text-sm">
                    {place.priceRange}
                  </span>
                )}

                {!place.pricePerNight && !place.priceRange && (
                  <span className="text-xs text-muted-foreground">
                    {t.card.freeToExplore}
                  </span>
                )}
              </div>

              <Link
                href={`/place/${place.id}`}
                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                {t.card.details} <span aria-hidden>→</span>
              </Link>
            </div>

            {showSaveToTrip && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSaveModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                Save to Trip
              </button>
            )}
          </div>
        </div>
      </div>

      <SaveToTripModal
        placeId={place.id}
        placeName={place.name}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </>
  );
}