import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import {
  MapPin,
  Star,
  Heart,
  ArrowLeft,
  Share2,
  FolderPlus,
  X,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import NotFound from "./not-found";
import { PlaceCard } from "@/components/ui/PlaceCard";
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

type Trip = {
  id: string;
  title: string;
};

type SaveStatus = {
  type: "success" | "error" | "info";
  message: string;
} | null;

type TripPlaceRow = {
  trip_id: string;
};

export function Place() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();

  const [cities, setCities] = useState<DbCity[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loading, setLoading] = useState(true);

  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [savingToTrip, setSavingToTrip] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tripPlaceMap, setTripPlaceMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [citiesRes, placesRes] = await Promise.all([
        supabase.from("cities").select("*").order("id", { ascending: true }),
        supabase.from("places").select("*").order("id", { ascending: true }),
      ]);

      if (citiesRes.error) {
        console.error("Failed to fetch cities:", citiesRes.error);
      } else {
        setCities((citiesRes.data as DbCity[]) || []);
      }

      if (placesRes.error) {
        console.error("Failed to fetch places:", placesRes.error);
      } else {
        setPlaces((placesRes.data as DbPlace[]) || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setSaveStatus(null);
    setSelectedTripId(null);
    setTripPlaceMap({});
    setUserTrips([]);
    setSavingToTrip(false);
  };

  const fetchUserTrips = async () => {
    setSaveStatus(null);
    setSelectedTripId(null);
    setTripPlaceMap({});
    setUserTrips([]);
    setModalOpen(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to get user:", userError);
      setSaveStatus({
        type: "error",
        message: "Could not get user.",
      });
      return;
    }

    const user = userData.user;

    if (!user) {
      setSaveStatus({
        type: "error",
        message: "You must be logged in to save a place to a trip.",
      });
      return;
    }

    if (!id) {
      setSaveStatus({
        type: "error",
        message: "Could not identify this place.",
      });
      return;
    }

    const [tripsRes, tripPlacesRes] = await Promise.all([
      supabase
        .from("trips")
        .select("id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase.from("trip_places").select("trip_id").eq("place_id", id),
    ]);

    if (tripsRes.error) {
      console.error("Failed to fetch trips:", tripsRes.error);
      setSaveStatus({
        type: "error",
        message: "Could not load your trips.",
      });
      return;
    }

    if (tripPlacesRes.error) {
      console.error("Failed to fetch trip places:", tripPlacesRes.error);
      setSaveStatus({
        type: "error",
        message: "Could not check existing saved trips.",
      });
      return;
    }

    const trips = (tripsRes.data as Trip[]) || [];
    const tripPlaces = (tripPlacesRes.data as TripPlaceRow[]) || [];

    const map: Record<string, boolean> = {};
    tripPlaces.forEach((item) => {
      map[item.trip_id] = true;
    });

    setTripPlaceMap(map);
    setUserTrips(trips);

    if (trips.length === 0) {
      setSaveStatus({
        type: "info",
        message: "You do not have any trips yet. Create one first.",
      });
    }
  };

  const handleSaveToTrip = async (tripId: string) => {
    if (!id) return;
    if (tripPlaceMap[tripId]) return;

    setSavingToTrip(true);
    setSaveStatus(null);
    setSelectedTripId(tripId);

    const { error } = await supabase.from("trip_places").insert({
      trip_id: tripId,
      place_id: id,
    });

    if (error) {
      console.error("Failed to save place to trip:", error);

      const message = error.message.toLowerCase();

      if (
        message.includes("duplicate") ||
        message.includes("unique") ||
        message.includes("trip_places_trip_id_place_id_key")
      ) {
        setSaveStatus({
          type: "error",
          message: "This place is already in that trip.",
        });
      } else {
        setSaveStatus({
          type: "error",
          message: "Could not save this place to the trip.",
        });
      }

      setSavingToTrip(false);
      return;
    }

    setTripPlaceMap((prev) => ({
      ...prev,
      [tripId]: true,
    }));

    setSaveStatus({
      type: "success",
      message: "Place added to trip successfully.",
    });

    setSavingToTrip(false);

    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  if (loading) {
    return <div className="w-full min-h-screen bg-background" />;
  }

  const dbPlace = places.find((p) => p.id === id);

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
      description: place.description_en,
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
  const description = translatedPlace?.description ?? dbPlace.description_en;
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
              onClick={fetchUserTrips}
              className="w-full py-6 text-lg rounded-xl mb-4 font-semibold"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              Save to Trip
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
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
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
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-semibold">Save to Trip</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {dbPlace.name}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveStatus && (
              <div
                className={`mb-4 rounded-xl border px-3 py-2 text-sm flex items-center gap-2 ${
                  saveStatus.type === "success"
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : saveStatus.type === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {saveStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : saveStatus.type === "error" ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <FolderPlus className="w-4 h-4 shrink-0" />
                )}
                <span>{saveStatus.message}</span>
              </div>
            )}

            {userTrips.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You do not have any trips yet. Create one first.
                </p>
                <Link
                  href="/trips"
                  className="inline-flex text-sm font-medium text-primary hover:opacity-80"
                >
                  Go to trips
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {userTrips.map((trip) => {
                  const alreadyAdded = tripPlaceMap[trip.id];

                  return (
                    <button
                      key={trip.id}
                      onClick={() => !alreadyAdded && handleSaveToTrip(trip.id)}
                      disabled={savingToTrip || alreadyAdded}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors disabled:opacity-60 ${
                        alreadyAdded
                          ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                          : selectedTripId === trip.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{trip.title}</span>

                        {alreadyAdded ? (
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Already added
                          </span>
                        ) : savingToTrip && selectedTripId === trip.id ? (
                          <span className="text-xs text-muted-foreground">
                            Saving...
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {saveStatus?.type === "success" && (
              <Link
                href="/trips"
                className="inline-flex mt-4 text-sm font-medium text-primary hover:opacity-80"
              >
                View my trips
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}