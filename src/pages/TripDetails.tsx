import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Star,
  Trash2,
  CalendarDays,
  Pencil,
  Save,
  X,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Info,
  FolderOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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

type PlaceInfo = {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  location: string | null;
  category: "stay" | "activity" | "restaurant";
};

type RawTripPlaceRow = {
  id: string;
  place_id: string;
  note: string | null;
  places: PlaceInfo | PlaceInfo[] | null;
};

type TripPlaceRow = {
  id: string;
  place_id: string;
  note: string | null;
  place: PlaceInfo | null;
};

type FeedbackMessage = {
  type: "success" | "error" | "info";
  text: string;
} | null;

export function TripDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/trips/:id");
  const tripId = params?.id;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<TripPlaceRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deletingTrip, setDeletingTrip] = useState(false);

  const [editing, setEditing] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [title, setTitle] = useState("");
  const [cityId, setCityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const [noteValues, setNoteValues] = useState<Record<string, string>>({});
  const [savedNoteValues, setSavedNoteValues] = useState<Record<string, string>>(
    {}
  );
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<FeedbackMessage>(null);

  const cityMap = useMemo(() => {
    return Object.fromEntries(cities.map((city) => [city.id, city]));
  }, [cities]);

  const groupedPlaces = useMemo(() => {
    return {
      stay: places.filter((item) => item.place?.category === "stay"),
      activity: places.filter((item) => item.place?.category === "activity"),
      restaurant: places.filter((item) => item.place?.category === "restaurant"),
    };
  }, [places]);

  const notesCount = useMemo(() => {
    return places.filter((item) => (item.note || "").trim().length > 0).length;
  }, [places]);

  const showFeedback = (
    type: "success" | "error" | "info",
    text: string,
    autoHide = true
  ) => {
    setFeedback({ type, text });

    if (autoHide) {
      window.clearTimeout((showFeedback as unknown as { timeout?: number }).timeout);
      (showFeedback as unknown as { timeout?: number }).timeout = window.setTimeout(
        () => setFeedback(null),
        2500
      );
    }
  };

  const fillFormFromTrip = (tripData: Trip) => {
    setTitle(tripData.title || "");
    setCityId(tripData.city_id || "");
    setStartDate(tripData.start_date || "");
    setEndDate(tripData.end_date || "");
    setNotes(tripData.notes || "");
  };

  const formatDate = (value: string | null) => {
    if (!value) return null;

    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchTripDetails = async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const [tripRes, placesRes, citiesRes] = await Promise.all([
      supabase.from("trips").select("*").eq("id", tripId).single(),
      supabase
        .from("trip_places")
        .select(
          `
          id,
          place_id,
          note,
          places (
            id,
            name,
            image_url,
            rating,
            location,
            category
          )
        `
        )
        .eq("trip_id", tripId),
      supabase
        .from("cities")
        .select("id, slug, name")
        .order("name", { ascending: true }),
    ]);

    if (tripRes.error) {
      console.error("Failed to fetch trip:", tripRes.error);
      setTrip(null);
      setPlaces([]);
      setLoading(false);
      return;
    }

    const tripData = tripRes.data as Trip;
    setTrip(tripData);
    fillFormFromTrip(tripData);

    if (placesRes.error) {
      console.error("Failed to fetch trip places:", placesRes.error);
      setPlaces([]);
      setNoteValues({});
      setSavedNoteValues({});
    } else {
      const normalized: TripPlaceRow[] = (
        (placesRes.data as RawTripPlaceRow[]) || []
      ).map((item) => ({
        id: item.id,
        place_id: item.place_id,
        note: item.note ?? "",
        place: Array.isArray(item.places) ? item.places[0] ?? null : item.places,
      }));

      setPlaces(normalized);

      const notesMap: Record<string, string> = {};
      normalized.forEach((item) => {
        notesMap[item.id] = item.note || "";
      });

      setNoteValues(notesMap);
      setSavedNoteValues(notesMap);
    }

    if (citiesRes.error) {
      console.error("Failed to fetch cities:", citiesRes.error);
      setCities([]);
    } else {
      setCities((citiesRes.data as City[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!tripId) return;
    fetchTripDetails();
  }, [tripId]);

  const handleRemovePlace = async (tripPlaceId: string) => {
    setRemovingId(tripPlaceId);
    setFeedback(null);

    const { error } = await supabase
      .from("trip_places")
      .delete()
      .eq("id", tripPlaceId);

    if (error) {
      console.error("Failed to remove place from trip:", error);
      showFeedback("error", "Could not remove this place from the trip.");
      setRemovingId(null);
      return;
    }

    setPlaces((prev) => prev.filter((p) => p.id !== tripPlaceId));
    setNoteValues((prev) => {
      const next = { ...prev };
      delete next[tripPlaceId];
      return next;
    });
    setSavedNoteValues((prev) => {
      const next = { ...prev };
      delete next[tripPlaceId];
      return next;
    });

    setRemovingId(null);
    showFeedback("success", "Place removed from trip.");
  };

  const handleSaveTrip = async () => {
    if (!trip) return;

    const cleanTitle = title.trim();
    const cleanNotes = notes.trim();

    if (!cleanTitle) {
      showFeedback("error", "Please enter a trip title.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      showFeedback("error", "End date must be after start date.");
      return;
    }

    setSavingTrip(true);
    setFeedback(null);

    const { data, error } = await supabase
      .from("trips")
      .update({
        title: cleanTitle,
        city_id: cityId || null,
        start_date: startDate || null,
        end_date: endDate || null,
        notes: cleanNotes || null,
      })
      .eq("id", trip.id)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update trip:", error);
      showFeedback("error", "Could not update trip.");
      setSavingTrip(false);
      return;
    }

    const updatedTrip = data as Trip;
    setTrip(updatedTrip);
    fillFormFromTrip(updatedTrip);
    setEditing(false);
    setSavingTrip(false);
    showFeedback("success", "Trip updated successfully.");
  };

  const handleCancelEdit = () => {
    if (!trip) return;
    fillFormFromTrip(trip);
    setEditing(false);
    setFeedback(null);
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this trip? This will also remove all places saved inside it."
    );

    if (!confirmed) return;

    setDeletingTrip(true);
    setFeedback(null);

    const { error } = await supabase.from("trips").delete().eq("id", trip.id);

    if (error) {
      console.error("Failed to delete trip:", error);
      showFeedback("error", "Could not delete trip.");
      setDeletingTrip(false);
      return;
    }

    setDeletingTrip(false);
    setLocation("/trips");
  };

  const handleSaveNote = async (tripPlaceId: string) => {
    const note = (noteValues[tripPlaceId] ?? "").trim();

    setSavingNoteId(tripPlaceId);
    setSavedNoteId(null);
    setFeedback(null);

    const { error } = await supabase
      .from("trip_places")
      .update({ note: note || null })
      .eq("id", tripPlaceId);

    if (error) {
      console.error("Failed to save note:", error);
      showFeedback("error", "Could not save note.");
      setSavingNoteId(null);
      return;
    }

    setPlaces((prev) =>
      prev.map((item) =>
        item.id === tripPlaceId ? { ...item, note } : item
      )
    );

    setNoteValues((prev) => ({
      ...prev,
      [tripPlaceId]: note,
    }));

    setSavedNoteValues((prev) => ({
      ...prev,
      [tripPlaceId]: note,
    }));

    setSavingNoteId(null);
    setSavedNoteId(tripPlaceId);
    showFeedback("success", "Note saved.");

    setTimeout(() => {
      setSavedNoteId((current) => (current === tripPlaceId ? null : current));
    }, 1800);
  };

  const handleDeleteNote = async (tripPlaceId: string) => {
    setSavingNoteId(tripPlaceId);
    setSavedNoteId(null);
    setFeedback(null);

    const { error } = await supabase
      .from("trip_places")
      .update({ note: null })
      .eq("id", tripPlaceId);

    if (error) {
      console.error("Failed to delete note:", error);
      showFeedback("error", "Could not delete note.");
      setSavingNoteId(null);
      return;
    }

    setPlaces((prev) =>
      prev.map((item) =>
        item.id === tripPlaceId ? { ...item, note: "" } : item
      )
    );

    setNoteValues((prev) => ({
      ...prev,
      [tripPlaceId]: "",
    }));

    setSavedNoteValues((prev) => ({
      ...prev,
      [tripPlaceId]: "",
    }));

    setSavingNoteId(null);
    showFeedback("success", "Note deleted.");
  };

  const renderPlaceCard = (item: TripPlaceRow) => {
    const place = item.place;

    if (!place) {
      return (
        <div
          key={item.id}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <p className="text-muted-foreground">
            This place could not be loaded.
          </p>
        </div>
      );
    }

    const currentNote = noteValues[item.id] ?? "";
    const savedNote = savedNoteValues[item.id] ?? "";
    const isChanged = currentNote !== savedNote;
    const hasSavedNote = savedNote.trim().length > 0;

    return (
      <div
        key={item.id}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <Link href={`/place/${place.id}`}>
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-52 object-cover cursor-pointer"
          />
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <Link href={`/place/${place.id}`}>
                <h2 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                  {place.name}
                </h2>
              </Link>

              <p className="text-sm text-muted-foreground capitalize mt-1">
                {place.category}
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold bg-muted px-2.5 py-1.5 rounded-lg shrink-0">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{place.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{place.location || "No location"}</span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              value={currentNote}
              onChange={(e) =>
                setNoteValues((prev) => ({
                  ...prev,
                  [item.id]: e.target.value,
                }))
              }
              placeholder="Add a note for this place..."
              rows={3}
              className="w-full rounded-xl border border-border bg-muted p-3 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleSaveNote(item.id)}
              disabled={savingNoteId === item.id || !isChanged}
              className="flex-1"
            >
              {savingNoteId === item.id ? (
                "Saving..."
              ) : savedNoteId === item.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : hasSavedNote ? (
                isChanged ? "Save changes" : "Saved"
              ) : (
                "Save note"
              )}
            </Button>

            {hasSavedNote ? (
              <Button
                variant="outline"
                onClick={() => handleDeleteNote(item.id)}
                disabled={savingNoteId === item.id}
                className="flex-1"
              >
                Delete note
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleRemovePlace(item.id)}
                disabled={removingId === item.id}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {removingId === item.id ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>

          {hasSavedNote && (
            <Button
              variant="ghost"
              onClick={() => handleRemovePlace(item.id)}
              disabled={removingId === item.id}
              className="w-full mt-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {removingId === item.id
                ? "Removing..."
                : "Remove place from trip"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderPlaceSection = (title: string, items: TripPlaceRow[]) => {
    if (items.length === 0) return null;

    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "place" : "places"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(renderPlaceCard)}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse rounded-2xl border border-border bg-card p-6 mb-8">
          <div className="h-8 w-56 bg-muted rounded mb-4" />
          <div className="h-5 w-40 bg-muted rounded mb-3" />
          <div className="h-5 w-72 bg-muted rounded mb-3" />
          <div className="h-20 w-full bg-muted rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="h-52 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-40 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-24 w-full bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-3">Trip not found</h1>
          <p className="text-muted-foreground mb-6">
            This trip may have been deleted or is no longer available.
          </p>
          <Button onClick={() => setLocation("/trips")}>
            Back to trips
          </Button>
        </div>
      </div>
    );
  }

  const city = trip.city_id ? cityMap[trip.city_id] : null;
  const tripDateLabel =
    trip.start_date || trip.end_date
      ? `${formatDate(trip.start_date) || "No start date"} → ${
          formatDate(trip.end_date) || "No end date"
        }`
      : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setLocation("/trips")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to trips
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 flex items-center gap-3 ${
            feedback.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : feedback.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-border bg-card text-muted-foreground"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : feedback.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <Info className="w-5 h-5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 mb-8">
        {!editing ? (
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{trip.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {city && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{city.name}</span>
                  </div>
                )}

                {tripDateLabel && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span>{tripDateLabel}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span>
                    {places.length} saved {places.length === 1 ? "place" : "places"}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  <StickyNote className="w-4 h-4 text-primary" />
                  <span>{notesCount} {notesCount === 1 ? "note" : "notes"}</span>
                </div>
              </div>

              {trip.notes ? (
                <p className="text-muted-foreground leading-relaxed">
                  {trip.notes}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground/70">
                  No trip notes yet.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit trip
              </Button>

              <Button
                variant="outline"
                onClick={handleDeleteTrip}
                disabled={deletingTrip}
                className="border-red-500/40 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deletingTrip ? "Deleting..." : "Delete trip"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold">Edit trip</h1>
              <button
                onClick={handleCancelEdit}
                className="text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Trip title"
                className="p-3 rounded-lg bg-muted border border-border outline-none"
              />

              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="p-3 rounded-lg bg-muted border border-border outline-none"
              >
                <option value="">Select a city (optional)</option>
                {cities.map((cityOption) => (
                  <option key={cityOption.id} value={cityOption.id}>
                    {cityOption.name}
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
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Trip notes"
              className="w-full p-3 rounded-lg bg-muted border border-border outline-none resize-none mb-4"
            />

            <div className="flex gap-3">
              <Button onClick={handleSaveTrip} disabled={savingTrip}>
                <Save className="w-4 h-4 mr-2" />
                {savingTrip ? "Saving..." : "Save changes"}
              </Button>

              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>

      {places.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Saved places</h2>
          </div>

          <p className="text-muted-foreground">
            No places added to this trip yet.
          </p>

          <Link
            href="/search"
            className="inline-flex mt-4 text-sm font-medium text-primary hover:opacity-80"
          >
            Explore places
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            <StickyNote className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Saved places</h2>
          </div>

          {renderPlaceSection("Stays", groupedPlaces.stay)}
          {renderPlaceSection("Activities", groupedPlaces.activity)}
          {renderPlaceSection("Restaurants", groupedPlaces.restaurant)}
        </>
      )}
    </div>
  );
}