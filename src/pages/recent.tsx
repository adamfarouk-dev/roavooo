import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { History, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { useLanguage } from "@/contexts/LanguageContext";

type DbPlace = {
  id: string;
  city_id: string;
  name: string;
  category: "stay" | "activity" | "restaurant" | string;
  description_en: string;
  description_fr: string;
  image_url: string;
  location: string | null;
  rating: number;
  price_per_night: number | null;
  price_range: string | null;
  cuisine: string | null;
};

type RecentViewRow = {
  place_id: string;
  viewed_at: string;
  places: DbPlace | DbPlace[] | null;
};

export function Recent() {
  const { t, lang } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [recentPlaces, setRecentPlaces] = useState<DbPlace[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRecentPlaces = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError);
        setRecentPlaces([]);
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const user = userData.user;

      if (!user) {
        setRecentPlaces([]);
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data, error } = await supabase
        .from("recently_viewed")
        .select(
          `
          place_id,
          viewed_at,
          places (
            id,
            city_id,
            name,
            category,
            description_en,
            description_fr,
            image_url,
            location,
            rating,
            price_per_night,
            price_range,
            cuisine
          )
        `
        )
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch recently viewed places:", error);
        setRecentPlaces([]);
        setLoading(false);
        return;
      }

      const normalized = ((data ?? []) as RecentViewRow[])
        .map((item) =>
          Array.isArray(item.places) ? item.places[0] ?? null : item.places
        )
        .filter(Boolean) as DbPlace[];

      setRecentPlaces(normalized);
      setLoading(false);
    };

    fetchRecentPlaces();
  }, []);

  const mappedRecentPlaces = useMemo(() => {
    return recentPlaces.map((place) => ({
      id: place.id,
      cityId: place.city_id,
      name: place.name,
      category: String(place.category).trim().toLowerCase() as
        | "stay"
        | "activity"
        | "restaurant",
      description:
        lang === "fr" ? place.description_fr : place.description_en,
      imageUrl: place.image_url,
      location: place.location ?? undefined,
      rating: place.rating,
      pricePerNight: place.price_per_night ?? undefined,
      priceRange: place.price_range ?? undefined,
      cuisine: place.cuisine ?? undefined,
    }));
  }, [recentPlaces, lang]);

  // LOADING
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4" />
          <div className="h-10 w-72 bg-muted rounded animate-pulse mb-4" />
          <div className="h-5 w-96 max-w-full bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
            >
              <div className="h-56 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.city.backToHome}
        </Link>

        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <History className="w-8 h-8 text-primary mx-auto mb-4" />

          <h1 className="text-3xl font-bold mb-3">
            {t.recent.loginTitle}
          </h1>

          <p className="text-muted-foreground mb-6">
            {t.recent.loginMessage}
          </p>

          <Link
            href="/login"
            className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t.recent.logIn}
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY
  if (mappedRecentPlaces.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.city.backToHome}
        </Link>

        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <History className="w-8 h-8 text-primary mx-auto mb-4" />

          <h1 className="text-3xl font-bold mb-3">
            {t.recent.emptyTitle}
          </h1>

          <p className="text-muted-foreground mb-6">
            {t.recent.emptyMessage}
          </p>

          <Link
            href="/search"
            className="inline-flex rounded-full border px-6 py-3 text-sm font-semibold"
          >
            {t.recent.explorePlaces}
          </Link>
        </div>
      </div>
    );
  }

  // MAIN
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.city.backToHome}
      </Link>

      <div className="mb-12">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
          {t.recent.eyebrow}
        </p>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 flex items-center gap-3">
          <History className="w-9 h-9 text-primary" />
          {t.recent.title}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl">
          {t.recent.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mappedRecentPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} showSaveToTrip />
        ))}
      </div>
    </div>
  );
}