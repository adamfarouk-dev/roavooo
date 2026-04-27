import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import {
  MapPin,
  Star,
  Heart,
  ArrowLeft,
  Share2,
  FolderPlus,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import NotFound from "./not-found";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { SaveToTripModal } from "@/components/trips/SaveToTripModal";

type DbCity = {
  id: string;
  slug: string;
  name: string;
  image_url: string;
};

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

export function Place() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, lang } = useLanguage();

  const [cities, setCities] = useState<DbCity[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [citiesRes, placesRes] = await Promise.all([
        supabase.from("cities").select("*").order("id", { ascending: true }),
        supabase.from("places").select("*").order("id", { ascending: true }),
      ]);

      if (citiesRes.error) {
        console.error("Failed to fetch cities:", citiesRes.error);
      } else {
        setCities((citiesRes.data ?? []) as DbCity[]);
      }

      if (placesRes.error) {
        console.error("Failed to fetch places:", placesRes.error);
      } else {
        setPlaces((placesRes.data ?? []) as DbPlace[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const dbPlace = useMemo(
    () => places.find((p) => p.id === id),
    [places, id]
  );

  useEffect(() => {
    const trackRecentlyViewed = async () => {
      if (!dbPlace?.id) return;

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user for recently viewed:", userError);
        return;
      }

      const user = userData.user;
      if (!user) return;

      const { error } = await supabase.from("recently_viewed").upsert(
        {
          user_id: user.id,
          place_id: dbPlace.id,
          viewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,place_id",
        }
      );

      if (error) {
        console.error("Failed to track recently viewed place:", error);
      }
    };

    trackRecentlyViewed();
  }, [dbPlace?.id]);

  if (loading) {
    return <div className="w-full min-h-screen bg-background" />;
  }

  if (!dbPlace) return <NotFound />;

  const city = cities.find((c) => c.id === dbPlace.city_id);
  const isFav = isFavorite(dbPlace.id);

  const relatedPlaces = places
    .filter(
      (p) =>
        p.city_id === dbPlace.city_id &&
        p.category === dbPlace.category &&
        p.id !== dbPlace.id
    )
    .slice(0, 3)
    .map((place) => ({
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

  const categoryLabel =
    t.place.categoryLabel[dbPlace.category] ?? dbPlace.category;
  const categoryPlural =
    t.place.categoryPlural[dbPlace.category] ?? dbPlace.category;

  const translatedPlace =
    t.place.content?.[dbPlace.id as keyof typeof t.place.content];
  const description =
    translatedPlace?.description ??
    (lang === "fr" ? dbPlace.description_fr : dbPlace.description_en);
  const details = translatedPlace?.details ?? [];

  return (
    <div className="w-full bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href={`/city/${city?.slug}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t.place.backTo} {city?.name}
        </Link>

        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border"
            onClick={() => toggleFavorite(dbPlace.id)}
          >
            <Heart
              className={`w-4 h-4 ${isFav ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg relative group">
            <img
              src={dbPlace.image_url}
              alt={dbPlace.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-background/90 backdrop-blur-md text-xs font-semibold rounded-full uppercase tracking-wider text-primary shadow-sm">
                {categoryLabel}
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                {dbPlace.name}
              </h1>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-lg font-bold bg-muted px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span>{dbPlace.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-lg mb-8">
              <MapPin className="w-5 h-5 text-primary" />
              <span>
                {dbPlace.location}
                {city?.name ? `, ${city.name}` : ""}
              </span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="text-xl text-foreground font-medium mb-6 leading-relaxed">
                {description}
              </p>

              {details.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="mb-6 pb-6 border-b border-border">
              {dbPlace.price_per_night && (
                <div>
                  <span className="text-3xl font-bold text-foreground">
                    ${dbPlace.price_per_night}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {t.place.perNight}
                  </span>
                </div>
              )}

              {dbPlace.price_range && (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-muted-foreground">
                    {t.place.priceRange}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {dbPlace.price_range}
                  </span>
                </div>
              )}

              {dbPlace.cuisine && (
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-medium text-muted-foreground">
                    {t.place.cuisine}
                  </span>
                  <span className="font-semibold">{dbPlace.cuisine}</span>
                </div>
              )}
            </div>

            <Button className="w-full py-6 text-lg rounded-xl mb-4 font-semibold shadow-md hover:shadow-lg transition-all">
              {dbPlace.category === "stay"
                ? t.place.checkAvailability
                : t.place.bookExperience}
            </Button>

            <Button
              variant="outline"
              onClick={() => setSaveModalOpen(true)}
              className="w-full py-6 text-lg rounded-xl mb-4 font-semibold"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              {t.card.saveToTrip}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t.place.noCharge}
            </p>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-serif font-bold text-lg mb-4">
                {t.place.highlights}
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                {t.place.highlightsList.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {relatedPlaces.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-24">
          <h2 className="text-3xl font-serif font-bold mb-8">
            {t.place.moreIn} {categoryPlural} {t.place.inCity} {city?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPlaces.map((p) => (
              <PlaceCard key={p.id} place={p} showSaveToTrip />
            ))}
          </div>
        </div>
      )}

      <SaveToTripModal
        placeId={dbPlace.id}
        placeName={dbPlace.name}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </div>
  );
}