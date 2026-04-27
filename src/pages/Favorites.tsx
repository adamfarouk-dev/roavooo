import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type DbPlace = {
  id: string;
  city_id: string;
  name: string;
  category: "stay" | "activity" | "restaurant";
  description_en: string;
  description_fr: string;
  image_url: string;
  location: string | null;
  rating: number;
  price_per_night: number | null;
  price_range: string | null;
  cuisine: string | null;
};

export function Favorites() {
  const { favorites, user, loading: favoritesLoading } = useFavorites();
  const { t, lang } = useLanguage();

  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      if (favoritesLoading) return;

      if (!user || favorites.length === 0) {
        setPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      setLoadingPlaces(true);

      const { data, error } = await supabase
        .from("places")
        .select("*")
        .in("id", favorites);

      if (error) {
        console.error("Failed to fetch favorite places:", error);
        setPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      setPlaces((data as DbPlace[]) || []);
      setLoadingPlaces(false);
    };

    loadPlaces();
  }, [favorites, user, favoritesLoading]);

  const mappedPlaces = places.map((place) => ({
    id: place.id,
    cityId: place.city_id,
    name: place.name,
    category: place.category,
    description: lang === "fr" ? place.description_fr : place.description_en,
    imageUrl: place.image_url,
    location: place.location ?? undefined,
    rating: place.rating,
    pricePerNight: place.price_per_night ?? undefined,
    priceRange: place.price_range ?? undefined,
    cuisine: place.cuisine ?? undefined,
  }));

  if (favoritesLoading) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif font-bold mb-4">
          {t.favorites.title}
        </h1>
        <p className="text-muted-foreground">{t.favorites.subtitle}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">
          {t.favorites.title}
        </h1>

        <p className="text-muted-foreground mb-6">{t.profile.subtitle}</p>

        <div className="flex justify-center gap-3">
          <Link href="/login">
            <Button>{t.profile.logIn}</Button>
          </Link>

          <Link href="/signup">
            <Button variant="outline">{t.profile.signUp}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loadingPlaces) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-4">
          {t.favorites.title}
        </h1>
        <p className="text-muted-foreground">{t.trips.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          {t.favorites.title}
        </h1>
        <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
      </div>

      {mappedPlaces.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="mx-auto mb-4 w-10 h-10 text-muted-foreground" />

          <h2 className="text-xl font-semibold mb-2">
            {t.favorites.emptyTitle}
          </h2>

          <p className="text-muted-foreground mb-6">
            {t.favorites.emptyMessage}
          </p>

          <Link href="/search">
            <Button>{t.favorites.emptyCta}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} showSaveToTrip />
          ))}
        </div>
      )}
    </div>
  );
}