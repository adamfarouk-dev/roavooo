import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { PlaceCard } from "@/components/ui/PlaceCard";
import {
  Heart,
  FolderPlus,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
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

export function Favorites() {
  const { favorites, user, loading: favoritesLoading } = useFavorites();
  const { t, lang } = useLanguage();

  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [modalPlaceId, setModalPlaceId] = useState<string | null>(null);
  const [savingToTrip, setSavingToTrip] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);
  const [tripPlaceMap, setTripPlaceMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadPlaces = async () => {
      if (favoritesLoading) return;

      if (!user) {
        setPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      if (favorites.length === 0) {
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

  const closeModal = () => {
    setModalPlaceId(null);
    setSaveStatus(null);
    setSelectedTripId(null);
    setTripPlaceMap({});
    setUserTrips([]);
    setSavingToTrip(false);
  };

  const openTripModal = async (placeId: string) => {
    setModalPlaceId(placeId);
    setSaveStatus(null);
    setSelectedTripId(null);
    setTripPlaceMap({});
    setUserTrips([]);

    if (!user) {
      setSaveStatus({
        type: "error",
        message: "You must be logged in to save a place to a trip.",
      });
      return;
    }

    const [tripsRes, tripPlacesRes] = await Promise.all([
      supabase
        .from("trips")
        .select("id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase.from("trip_places").select("trip_id").eq("place_id", placeId),
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

  const handleSaveToTrip = async (placeId: string, tripId: string) => {
    if (tripPlaceMap[tripId]) return;

    setSavingToTrip(true);
    setSelectedTripId(tripId);
    setSaveStatus(null);

    const { error } = await supabase.from("trip_places").insert({
      trip_id: tripId,
      place_id: placeId,
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

  if (favoritesLoading) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t.favorites.title}
          </h1>
          <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
        </div>

        <div className="text-muted-foreground">Loading favorites...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {t.favorites.title}
          </h1>
          <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
        </div>

        <div className="flex flex-col items-center justify-center py-24 px-4 bg-card rounded-3xl border border-border shadow-sm text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-3">Log in to save favorites</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Create an account or log in to save your favorite places and access them anytime.
          </p>
          <div className="flex gap-3">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 text-lg font-semibold">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-lg font-semibold"
              >
                Sign up
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
          <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
        </div>

        <div className="text-muted-foreground">Loading favorite places...</div>
      </div>
    );
  }

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

  const activePlace = mappedPlaces.find((place) => place.id === modalPlaceId);

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          {t.favorites.title}
        </h1>
        <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
      </div>

      {mappedPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-card rounded-3xl border border-border shadow-sm text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-3">{t.favorites.emptyTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-md">{t.favorites.emptyMessage}</p>
          <Link href="/search">
            <Button size="lg" className="rounded-full px-8 text-lg font-semibold">
              {t.favorites.emptyCta}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mappedPlaces.map((place) => (
            <div key={place.id} className="space-y-3">
              <PlaceCard place={place} />

              <div className="rounded-2xl border border-border bg-card p-3">
                <Button
                  variant="outline"
                  onClick={() => openTripModal(place.id)}
                  className="w-full rounded-xl"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Save to Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalPlaceId && (
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
                {activePlace && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activePlace.name}
                  </p>
                )}
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
                      onClick={() =>
                        modalPlaceId &&
                        !alreadyAdded &&
                        handleSaveToTrip(modalPlaceId, trip.id)
                      }
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