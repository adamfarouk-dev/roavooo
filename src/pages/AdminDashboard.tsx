import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
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
};

type AnalyticsRow = {
  label: string;
  count: number;
};

type UserEvent = {
  event_type: string;
  metadata: Record<string, any> | null;
};

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  useDocumentTitle("Admin Dashboard - Roavooo");

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "places" | "cities" | "analytics"
  >("places");

  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [cities, setCities] = useState<DbCity[]>([]);

  const [mostClickedPlaces, setMostClickedPlaces] = useState<AnalyticsRow[]>(
    []
  );
  const [mostSearchedTerms, setMostSearchedTerms] = useState<AnalyticsRow[]>(
    []
  );
  const [mostSavedPlaces, setMostSavedPlaces] = useState<AnalyticsRow[]>([]);

  const loadPlaces = async () => {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Could not load places",
        description: error.message,
      });
      return;
    }

    setPlaces((data as DbPlace[]) || []);
  };

  const loadCities = async () => {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Could not load cities",
        description: error.message,
      });
      return;
    }

    setCities((data as DbCity[]) || []);
  };

  const loadAnalytics = async () => {
    const { data, error } = await supabase
      .from("user_events")
      .select("event_type, metadata");

    if (error) {
      console.error("Failed to load analytics:", error);
      toast({
        variant: "destructive",
        title: "Could not load analytics",
        description: error.message,
      });
      return;
    }

    const events = ((data as UserEvent[]) || []);

    const countBy = (
      eventType: string,
      metadataKeys: string[]
    ): AnalyticsRow[] => {
      const counts: Record<string, number> = {};

      events
        .filter((event) => event.event_type === eventType)
        .forEach((event) => {
          const metadata = event.metadata || {};

          const value =
            metadataKeys.map((key) => metadata[key]).find(Boolean) || null;

          if (!value) return;

          counts[String(value)] = (counts[String(value)] || 0) + 1;
        });

      return Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    setMostClickedPlaces(countBy("place_click", ["place_name", "place_id"]));
    setMostSearchedTerms(countBy("search", ["query"]));
    setMostSavedPlaces(countBy("save_to_trip", ["place_name", "place_id"]));
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setLocation("/admin/login");
        return;
      }

      await Promise.all([loadPlaces(), loadCities(), loadAnalytics()]);
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleDeletePlace = async (id: string) => {
    const ok = window.confirm("Delete this place?");
    if (!ok) return;

    const { error } = await supabase.from("places").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not delete place",
        description: error.message,
      });
      return;
    }

    await loadPlaces();
    toast({
      title: "Place deleted",
      description: "The place was removed successfully.",
    });
  };

  const handleDeleteCity = async (id: string) => {
    const ok = window.confirm("Delete this city?");
    if (!ok) return;

    const { error } = await supabase.from("cities").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not delete city",
        description: error.message,
      });
      return;
    }

    await loadCities();
    toast({
      title: "City deleted",
      description: "The city was removed successfully.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Skeleton className="h-10 w-72 mb-3" />
              <Skeleton className="h-5 w-96 max-w-full" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Skeleton className="h-14 w-full rounded-none" />
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border"
              >
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-5" />
                <Skeleton className="h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your Roavooo cities, places, and user behavior.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("places")}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                activeTab === "places"
                  ? "bg-primary text-white border-primary"
                  : "border-border"
              }`}
            >
              Places
            </button>

            <button
              onClick={() => setActiveTab("cities")}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                activeTab === "cities"
                  ? "bg-primary text-white border-primary"
                  : "border-border"
              }`}
            >
              Cities
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg font-semibold border ${
                activeTab === "analytics"
                  ? "bg-primary text-white border-primary"
                  : "border-border"
              }`}
            >
              Analytics
            </button>

            {activeTab === "places" && (
              <button
                onClick={() => setLocation("/admin/places/new")}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
              >
                New Place
              </button>
            )}

            {activeTab === "cities" && (
              <button
                onClick={() => setLocation("/admin/cities/new")}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
              >
                New City
              </button>
            )}

            <button
              onClick={handleLogout}
              className="border border-border px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === "analytics" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { title: "Most clicked places", rows: mostClickedPlaces },
              { title: "Most searched terms", rows: mostSearchedTerms },
              { title: "Most saved places", rows: mostSavedPlaces },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>

                {section.rows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {section.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-border pb-2 text-sm"
                      >
                        <span className="truncate pr-4">{row.label}</span>
                        <span className="font-bold text-primary">
                          {row.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === "places" ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border font-semibold text-sm">
              <div>Name</div>
              <div>City ID</div>
              <div>Category</div>
              <div>Rating</div>
              <div>Location</div>
              <div>Actions</div>
            </div>

            {places.map((place) => (
              <div
                key={place.id}
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-border text-sm items-center"
              >
                <div>{place.name}</div>
                <div>{place.city_id}</div>
                <div className="capitalize">{place.category}</div>
                <div>{place.rating}</div>
                <div>{place.location || "-"}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setLocation(`/admin/places/${place.id}/edit`)
                    }
                    className="px-3 py-1 rounded-md border border-border"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlace(place.id)}
                    className="px-3 py-1 rounded-md border border-red-300 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {places.length === 0 && (
              <div className="px-6 py-10 text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  No places yet.
                </p>
                <button
                  onClick={() => setLocation("/admin/places/new")}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  type="button"
                >
                  New Place
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border font-semibold text-sm">
              <div>Name</div>
              <div>ID</div>
              <div>Slug</div>
              <div>Hero Image</div>
              <div>Actions</div>
            </div>

            {cities.map((city) => (
              <div
                key={city.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border text-sm items-center"
              >
                <div>{city.name}</div>
                <div>{city.id}</div>
                <div>{city.slug}</div>
                <div className="truncate">{city.image_url}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setLocation(`/admin/cities/${city.id}/edit`)
                    }
                    className="px-3 py-1 rounded-md border border-border"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCity(city.id)}
                    className="px-3 py-1 rounded-md border border-red-300 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {cities.length === 0 && (
              <div className="px-6 py-10 text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  No cities yet.
                </p>
                <button
                  onClick={() => setLocation("/admin/cities/new")}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                  type="button"
                >
                  New City
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
