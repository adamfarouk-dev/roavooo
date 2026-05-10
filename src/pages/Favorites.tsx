import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Heart, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { PageHeaderSkeleton, PlaceGridSkeleton } from "@/components/ui/loading-states";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  useDocumentTitle("My Favorites - Roavooo");

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
        toast({
          variant: "destructive",
          title: "Could not load favorite places",
          description: error.message,
        });
        setPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      setPlaces((data as DbPlace[]) || []);
      setLoadingPlaces(false);
    };

    loadPlaces();
  }, [favorites, user, favoritesLoading, toast]);

  const mappedPlaces = useMemo(() => {
    return places.map((place) => ({
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
  }, [places, lang]);

  if (favoritesLoading) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeaderSkeleton />
        <PlaceGridSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full rounded-3xl border border-border bg-card p-8 md:p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
            {t.favorites.title}
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t.profile.subtitle}
          </p>

          <div className="flex justify-center gap-3">
            <Link href="/login">
              <Button className="rounded-xl px-5 py-3">{t.profile.logIn}</Button>
            </Link>

            <Link href="/signup">
              <Button variant="outline" className="rounded-xl px-5 py-3">
                {t.profile.signUp}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPlaces) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t.favorites.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.favorites.subtitle}
          </p>
        </div>

        <PlaceGridSkeleton />
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
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-serif font-bold mb-2">
            {t.favorites.emptyTitle}
          </h2>

          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t.favorites.emptyMessage}
          </p>

          <Link href="/search">
            <Button className="rounded-xl px-5 py-3">
              {t.favorites.emptyCta}
            </Button>
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
