import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

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

export function Search() {
  const [location, setLocation] = useLocation();
  const { t, lang } = useLanguage();

  const [cities, setCities] = useState<DbCity[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setSearchQuery(params.get("q") || "");
    setCategoryFilter(params.get("category") || "all");
    setCityFilter(params.get("city") || "all");
  }, [location]);

  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true);

      const [citiesRes, placesRes] = await Promise.all([
        supabase.from("cities").select("*").order("name", { ascending: true }),
        supabase.from("places").select("*").order("name", { ascending: true }),
      ]);

      if (citiesRes.error) {
        console.error("Failed to fetch cities:", citiesRes.error);
        setCities([]);
      } else {
        setCities((citiesRes.data as DbCity[]) || []);
      }

      if (placesRes.error) {
        console.error("Failed to fetch places:", placesRes.error);
        setPlaces([]);
      } else {
        setPlaces((placesRes.data as DbPlace[]) || []);
      }

      setLoading(false);
    };

    fetchSearchData();
  }, []);

  const updateUrlParams = (
    nextQuery: string,
    nextCategory: string,
    nextCity: string
  ) => {
    const params = new URLSearchParams();

    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextCity !== "all") params.set("city", nextCity);

    const queryString = params.toString();
    setLocation(queryString ? `/search?${queryString}` : "/search");
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const city = cities.find((c) => c.id === place.city_id);

      const searchableText = [
        place.name,
        place.description_en,
        place.description_fr,
        place.location || "",
        place.cuisine || "",
        city?.name || "",
        place.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || place.category === categoryFilter;
      const matchesCity = cityFilter === "all" || place.city_id === cityFilter;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [places, cities, searchQuery, categoryFilter, cityFilter]);

  const mappedPlaces = filteredPlaces.map((place) => ({
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

  const resultLabel = mappedPlaces.length === 1 ? t.search.result : t.search.results;

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setCityFilter("all");
    setLocation("/search");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="h-10 w-64 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse" />
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-12">
          <div className="h-14 w-full bg-muted rounded-xl animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-14 bg-muted rounded-xl animate-pulse" />
            <div className="h-14 bg-muted rounded-xl animate-pulse" />
          </div>
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
                <div className="h-4 w-5/6 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          {t.search.title}
        </h1>
        <p className="text-xl text-muted-foreground">{t.search.subtitle}</p>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-12">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.search.placeholder}
            value={searchQuery}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearchQuery(nextValue);
              updateUrlParams(nextValue, categoryFilter, cityFilter);
            }}
            className="pl-12 py-6 rounded-xl text-lg bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={cityFilter}
            onValueChange={(value) => {
              setCityFilter(value);
              updateUrlParams(searchQuery, categoryFilter, value);
            }}
          >
            <SelectTrigger className="w-full py-6 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder={t.search.allCities} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allCities}</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              updateUrlParams(searchQuery, value, cityFilter);
            }}
          >
            <SelectTrigger className="w-full py-6 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder={t.search.allTypes} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allTypes}</SelectItem>
              <SelectItem value="stay">{t.search.staysLabel}</SelectItem>
              <SelectItem value="activity">{t.search.experiencesLabel}</SelectItem>
              <SelectItem value="restaurant">{t.search.diningLabel}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || categoryFilter !== "all" || cityFilter !== "all") && (
          <div className="mt-4">
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              {t.search.clearFilters}
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8 flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-semibold">
          {mappedPlaces.length} {resultLabel} {t.search.found}
        </h2>
      </div>

      {mappedPlaces.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border">
          <h3 className="text-2xl font-serif font-semibold mb-2">
            {t.search.noResultsTitle}
          </h3>
          <p className="text-muted-foreground mb-6">{t.search.noResultsMsg}</p>
          <Button variant="outline" onClick={clearFilters}>
            {t.search.clearFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}