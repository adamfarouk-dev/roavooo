import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { MapPin, CalendarDays, Plus, FolderOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
};

type TripPlaceCount = {
  trip_id: string;
};

export function Trips() {
  const [, setLocation] = useLocation();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tripPlaceCounts, setTripPlaceCounts] = useState<Record<string, number>>(
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
        .select("id, slug, name")
        .order("name", { ascending: true }),
      supabase
        .from("trip_places")
        .select("trip_id"),
    ]);

    if (tripsRes.error) {
      console.error("Error fetching trips:", tripsRes.error);
    } else {
      setTrips((tripsRes.data as Trip[]) || []);
    }

    if (citiesRes.error) {
      console.error("Error fetching cities:", citiesRes.error);
    } else {
      setCities((citiesRes.data as City[]) || []);
    }

    if (tripPlacesRes.error) {
      console.error("Error fetching trip places:", tripPlacesRes.error);
    } else {
      const counts: Record<string, number> = {};

      ((tripPlacesRes.data as TripPlaceCount[]) || []).forEach((item) => {
        counts[item.trip_id] = (counts[item.trip_id] || 0) + 1;
      });

      setTripPlaceCounts(counts);
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
      alert("Please enter a trip title.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      alert("End date must be after start date.");
      return;
    }

    setCreating(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      alert("Could not get user.");
      setCreating(false);
      return;
    }

    const user = userData.user;

    if (!user) {
      alert("You must be logged in to create a trip.");
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
      alert("Error creating trip.");
      setCreating(false);
      return;
    }

    resetForm();
    await fetchTrips();
    setCreating(false);
  };

  if (loading) {
    return <div className="p-6 max-w-5xl mx-auto">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Trips</h1>
        <p className="text-muted-foreground">
          Create and organize your trips in one place.
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-xl border border-border p-6 bg-card mb-8">
          <p className="text-muted-foreground">
            No trips yet. Create your first trip below.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {trips.map((trip) => {
            const city = trip.city_id ? cityMap[trip.city_id] : null;
            const placesCount = tripPlaceCounts[trip.id] || 0;

            return (
              <div
                key={trip.id}
                onClick={() => setLocation(`/trips/${trip.id}`)}
                className="p-5 border border-border rounded-2xl bg-card cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-xl">{trip.title}</h2>

                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      {city && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{city.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        <span>
                          {placesCount} {placesCount === 1 ? "place" : "places"} saved
                        </span>
                      </div>
                    </div>

                    {(trip.start_date || trip.end_date) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span>
                          {trip.start_date || "No start date"} →{" "}
                          {trip.end_date || "No end date"}
                        </span>
                      </div>
                    )}

                    {trip.notes && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {trip.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
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