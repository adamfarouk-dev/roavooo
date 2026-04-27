import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Search as SearchIcon,
  MapPin,
  ArrowRight,
  Bed,
  Compass,
  Utensils,
  History,
} from "lucide-react";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type DbCity = {
  id: string;
  slug: string;
  name: string;
  image_url: string;
  tagline_en: string;
  tagline_fr: string;
  description_en: string;
  description_fr: string;
  tip_best_time_en: string;
  tip_best_time_fr: string;
  tip_packing_en: string;
  tip_packing_fr: string;
  tip_etiquette_en: string;
  tip_etiquette_fr: string;
  tip_transport_en: string;
  tip_transport_fr: string;
  tip_phrases_en: string;
  tip_phrases_fr: string;
};

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

export function Home() {
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "stay" | "activity" | "restaurant"
  >("stay");
  const [cities, setCities] = useState<DbCity[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<DbPlace[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);

      const [{ data: userData }, citiesRes, placesRes] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("cities").select("*").order("name", { ascending: true }),
        supabase
          .from("places")
          .select("*")
          .order("rating", { ascending: false }),
      ]);

      setUserId(userData.user?.id ?? null);

      if (citiesRes.error) {
        console.error("Failed to fetch cities:", citiesRes.error);
        setCities([]);
      } else {
        setCities((citiesRes.data ?? []) as DbCity[]);
      }

      if (placesRes.error) {
        console.error("Failed to fetch places:", placesRes.error);
        setPlaces([]);
      } else {
        setPlaces((placesRes.data ?? []) as DbPlace[]);
      }

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!userId) {
        setRecentPlaces([]);
        return;
      }

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
        .eq("user_id", userId)
        .order("viewed_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Failed to fetch recently viewed places:", error);
        setRecentPlaces([]);
        return;
      }

      const normalized = ((data ?? []) as RecentViewRow[])
        .map((item) =>
          Array.isArray(item.places) ? item.places[0] ?? null : item.places
        )
        .filter(Boolean) as DbPlace[];

      setRecentPlaces(normalized);
    };

    fetchRecentlyViewed();
  }, [userId]);

  const CATEGORIES = [
    { label: t.hero.tabs.stays, value: "stay" as const, icon: Bed },
    {
      label: t.hero.tabs.experiences,
      value: "activity" as const,
      icon: Compass,
    },
    {
      label: t.hero.tabs.dining,
      value: "restaurant" as const,
      icon: Utensils,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    params.set("category", activeCategory);

    setLocation(`/search?${params.toString()}`);
  };

  const mapPlace = (place: DbPlace) => ({
    id: place.id,
    cityId: place.city_id,
    name: place.name,
    category: String(place.category).trim().toLowerCase() as
      | "stay"
      | "activity"
      | "restaurant",
    description: lang === "fr" ? place.description_fr : place.description_en,
    imageUrl: place.image_url,
    location: place.location ?? undefined,
    rating: place.rating,
    pricePerNight: place.price_per_night ?? undefined,
    priceRange: place.price_range ?? undefined,
    cuisine: place.cuisine ?? undefined,
  });

  const mappedPlaces = useMemo(() => {
    return places.map(mapPlace);
  }, [places, lang]);

  const mappedRecentPlaces = useMemo(() => {
    return recentPlaces.map(mapPlace);
  }, [recentPlaces, lang]);

  const featuredStays = useMemo(
    () =>
      mappedPlaces
        .filter((p) => p.category === "stay")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [mappedPlaces]
  );

  const featuredActivities = useMemo(
    () =>
      mappedPlaces
        .filter((p) => p.category === "activity")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [mappedPlaces]
  );

  const featuredRestaurants = useMemo(
    () =>
      mappedPlaces
        .filter((p) => p.category === "restaurant")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [mappedPlaces]
  );

  return (
    <div className="w-full">
      <section className="relative h-[88vh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80"
            alt="Morocco"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-5"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-[4.5rem] font-serif text-white font-bold mb-5 leading-tight tracking-tight"
          >
            {t.hero.headline1}
            <br className="hidden md:block" /> {t.hero.headline2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="bg-card/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-border/50"
          >
            <div className="flex border-b border-border/60 mb-2">
              {CATEGORIES.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveCategory(value)}
                  className={`flex items-center gap-2 flex-1 justify-center py-2.5 text-sm font-semibold transition-all rounded-t-xl ${
                    activeCategory === value
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 p-1">
              <div className="relative flex-grow flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder={t.hero.placeholder[activeCategory]}
                  className="w-full pl-10 pr-4 h-11 rounded-xl border-none bg-muted/60 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 h-11 rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <SearchIcon className="w-4 h-4" />
                {t.hero.searchBtn}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {userId && mappedRecentPlaces.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10 gap-4">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
                {t.home.recent.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                <History className="w-8 h-8 text-primary" />
                {t.home.recent.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                {t.home.recent.subtitle}
              </p>
            </div>

            <Link
              href="/recent"
              className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
            >
              {t.home.recent.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedRecentPlaces.slice(0, 3).map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <PlaceCard place={place} showSaveToTrip />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/recent"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/40 px-6 py-3 rounded-full hover:bg-primary/5 transition-colors"
            >
              {t.home.recent.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 gap-4">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
              {t.home.destinations.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {t.home.destinations.title}
            </h2>
          </div>

          <Link
            href="/cities"
            className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
          >
            {t.home.destinations.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-[3/4] rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cities.slice(0, 3).map((city, i) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setLocation(`/city/${city.slug}`)}
                >
                  <img
                    src={city.image_url}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      {city.name}
                    </h3>

                    <p className="text-white/70 text-sm line-clamp-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                      {lang === "fr" ? city.tagline_fr : city.tagline_en}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
                      {t.home.destinations.exploreCity}{" "}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/cities"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/40 px-6 py-3 rounded-full hover:bg-primary/5 transition-colors"
              >
                {t.home.destinations.viewAll}{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
                {t.home.stays.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t.home.stays.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                {t.home.stays.subtitle}
              </p>
            </div>

            <Link
              href="/search?category=stay"
              className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
            >
              {t.home.stays.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredStays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStays.map((stay, i) => (
                <motion.div
                  key={stay.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <PlaceCard place={stay} showSaveToTrip />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No stays available yet.</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/search?category=stay"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/40 px-6 py-3 rounded-full hover:bg-primary/5 transition-colors"
            >
              {t.home.stays.viewAllMobile} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
              {t.home.experiences.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {t.home.experiences.title}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              {t.home.experiences.subtitle}
            </p>
          </div>

          <Link
            href="/search?category=activity"
            className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
          >
            {t.home.experiences.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <PlaceCard place={activity} showSaveToTrip />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No experiences available yet.
            </p>
          </div>
        )}
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">
                {t.home.dining.eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {t.home.dining.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                {t.home.dining.subtitle}
              </p>
            </div>

            <Link
              href="/search?category=restaurant"
              className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
            >
              {t.home.dining.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-2/3 bg-muted rounded" />
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant, i) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <PlaceCard place={restaurant} showSaveToTrip />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">
                No dining spots available yet.
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/search?category=restaurant"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold border border-primary/40 px-6 py-3 rounded-full hover:bg-primary/5 transition-colors"
            >
              {t.home.dining.viewAllMobile}{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}