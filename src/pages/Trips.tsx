import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  MapPin,
  CalendarDays,
  Plus,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Trip = {
  id: string;
  user_id: string;
  title: string;
  city_id: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
};

type City = {
  id: string;
  slug: string;
  name: string;
  image_url: string;
};

type TripPlaceRow = {
  trip_id: string;
  places:
    | {
        image_url: string | null;
      }
    | {
        image_url: string | null;
      }[]
    | null;
};

export function Trips() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tripPlaceCounts, setTripPlaceCounts] = useState<Record<string, number>>(
    {}
  );
  const [tripCoverImages, setTripCoverImages] = useState<Record<string, string>>(
    {}
  );

  const [title, setTitle] = useState("");
  const [cityId, setCityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const cityMap = useMemo(() => {
    return Object.fromEntries(cities.map((city) => [city.id, city]));
  }, [cities]);

  const formatDate = (value: string | null) => {
    if (!value) return null;

    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchTrips = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      setLoading(false);
      return;
    }

    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const [tripsRes, citiesRes, tripPlacesRes] = await Promise.all([
      supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("cities")
        .select("id, slug, name, image_url")
        .order("name", { ascending: true }),

      supabase.from("trip_places").select(`
        trip_id,
        places (
          image_url
        )
      `),
    ]);

    if (tripsRes.error) {
      console.error("Error fetching trips:", tripsRes.error);
    } else {
      setTrips((tripsRes.data ?? []) as Trip[]);
    }

    if (citiesRes.error) {
      console.error("Error fetching cities:", citiesRes.error);
    } else {
      setCities((citiesRes.data ?? []) as City[]);
    }

    if (tripPlacesRes.error) {
      console.error("Error fetching trip places:", tripPlacesRes.error);
    } else {
      const counts: Record<string, number> = {};
      const covers: Record<string, string> = {};

      ((tripPlacesRes.data ?? []) as TripPlaceRow[]).forEach((item) => {
        counts[item.trip_id] = (counts[item.trip_id] || 0) + 1;

        if (!covers[item.trip_id]) {
          const placeData = Array.isArray(item.places)
            ? item.places[0]
            : item.places;

          if (placeData?.image_url) {
            covers[item.trip_id] = placeData.image_url;
          }
        }
      });

      setTripPlaceCounts(counts);
      setTripCoverImages(covers);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const resetForm = () => {
    setTitle("");
    setCityId("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  };

  const handleCreateTrip = async () => {
    const cleanTitle = title.trim();
    const cleanNotes = notes.trim();

    if (!cleanTitle) {
      toast({
        variant: "destructive",
        title: "Trip title required",
        description: "Please enter a trip title.",
      });
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      toast({
        variant: "destructive",
        title: "Invalid dates",
        description: "End date must be after start date.",
      });
      return;
    }

    setCreating(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      toast({
        variant: "destructive",
        title: "Could not get user",
        description: "Please try again.",
      });
      setCreating(false);
      return;
    }

    const user = userData.user;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "You must be logged in to create a trip.",
      });
      setCreating(false);
      return;
    }

    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      title: cleanTitle,
      city_id: cityId || null,
      start_date: startDate || null,
      end_date: endDate || null,
      notes: cleanNotes || null,
    });

    if (error) {
      console.error("Error creating trip:", error);
      toast({
        variant: "destructive",
        title: "Could not create trip",
        description: "Please try again.",
      });
      setCreating(false);
      return;
    }

    resetForm();
    await fetchTrips();
    setCreating(false);

    toast({
      title: "Trip created",
      description: "Your trip was created successfully.",
    });
  };

  if (loading) {
    return <div className="p-6 max-w-6xl mx-auto">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Trips</h1>
        <p className="text-muted-foreground">
          Create and organize your trips in one place.
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No trips yet</h2>
          <p className="text-muted-foreground mb-5">
            Create your first trip below and start building your itinerary.
          </p>
          <Link
            href="/search"
            className="inline-flex text-sm font-medium text-primary hover:opacity-80"
          >
            Explore places →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {trips.map((trip) => {
            const city = trip.city_id ? cityMap[trip.city_id] : null;
            const placesCount = tripPlaceCounts[trip.id] || 0;
            const coverImage = tripCoverImages[trip.id] || city?.image_url || null;
            const formattedStartDate = formatDate(trip.start_date);
            const formattedEndDate = formatDate(trip.end_date);

            return (
              <div
                key={trip.id}
                onClick={() => setLocation(`/trips/${trip.id}`)}
                className="rounded-3xl overflow-hidden border border-border bg-card cursor-pointer hover:translate-y-[-2px] hover:shadow-xl transition-all"
              >
                <div className="relative h-56 bg-muted">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {trip.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                      {city && (
                        <div className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{city.name}</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4" />
                        <span>
                          {placesCount} {placesCount === 1 ? "place" : "places"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {(trip.start_date || trip.end_date) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <span>
                        {formattedStartDate || "No start date"} →{" "}
                        {formattedEndDate || "No end date"}
                      </span>
                    </div>
                  )}

                  {trip.notes ? (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {trip.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/70 italic mb-4">
                      No trip notes yet.
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Created {formatDate(trip.created_at) || "Unknown date"}
                    </span>
                    <span className="text-primary font-medium">Open trip →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Create a new trip</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Trip title (ex: Marrakech Spring Trip)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-lg bg-muted border border-border outline-none"
          />

          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="p-3 rounded-lg bg-muted border border-border outline-none"
          >
            <option value="">Select a city (optional)</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 rounded-lg bg-muted border border-border outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 rounded-lg bg-muted border border-border outline-none"
          />
        </div>

        <textarea
          placeholder="Trip notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-lg bg-muted border border-border outline-none resize-none mb-4"
        />

        <button
          onClick={handleCreateTrip}
          disabled={creating}
          className="px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create trip"}
        </button>
      </div>
    </div>
  );
}