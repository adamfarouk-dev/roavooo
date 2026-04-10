import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

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

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<DbPlace[]>([]);

  const loadPlaces = async () => {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setPlaces((data as DbPlace[]) || []);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setLocation("/admin/login");
        return;
      }

      await loadPlaces();
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this place?");
    if (!ok) return;

    const { error } = await supabase.from("places").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadPlaces();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/admin/login");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Roavooo places.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setLocation("/admin/places/new")}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
            >
              New Place
            </button>

            <button
              onClick={handleLogout}
              className="border border-border px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

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
                  onClick={() => setLocation(`/admin/places/${place.id}/edit`)}
                  className="px-3 py-1 rounded-md border border-border"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(place.id)}
                  className="px-3 py-1 rounded-md border border-red-300 text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {places.length === 0 && (
            <div className="px-6 py-10 text-muted-foreground text-sm">
              No places yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}