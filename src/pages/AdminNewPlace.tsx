import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

type DbCity = {
  id: string;
  name: string;
};

export function AdminNewPlace() {
  const [, setLocation] = useLocation();

  const [cities, setCities] = useState<DbCity[]>([]);
  const [form, setForm] = useState({
    id: "",
    city_id: "",
    name: "",
    category: "stay",
    description_en: "",
    description_fr: "",
    image_url: "",
    location: "",
    rating: "4.5",
    price_per_night: "",
    price_range: "",
    cuisine: "",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("cities").select("id,name").order("id", { ascending: true });
      setCities((data as DbCity[]) || []);
    };

    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: form.id,
      city_id: form.city_id,
      name: form.name,
      category: form.category,
      description_en: form.description_en,
      description_fr: form.description_fr,
      image_url: form.image_url,
      location: form.location || null,
      rating: Number(form.rating),
      price_per_night: form.price_per_night ? Number(form.price_per_night) : null,
      price_range: form.price_range || null,
      cuisine: form.cuisine || null,
    };

    const { error } = await supabase.from("places").insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">New Place</h1>
        <p className="text-muted-foreground mb-8">Add a new stay, activity, or restaurant.</p>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <input
            name="id"
            placeholder="ID (example: s9)"
            value={form.id}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <select
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.id})
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Place name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
          >
            <option value="stay">Stay</option>
            <option value="activity">Activity</option>
            <option value="restaurant">Restaurant</option>
          </select>

          <textarea
            name="description_en"
            placeholder="Description EN"
            value={form.description_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[100px]"
            required
          />

          <textarea
            name="description_fr"
            placeholder="Description FR"
            value={form.description_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[100px]"
            required
          />

          <input
            name="image_url"
            placeholder="Image URL"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
          />

          <input
            name="rating"
            placeholder="Rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="price_per_night"
            placeholder="Price per night"
            value={form.price_per_night}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
          />

          <input
            name="price_range"
            placeholder="Price range ($$, $$$)"
            value={form.price_range}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
          />

          <input
            name="cuisine"
            placeholder="Cuisine"
            value={form.cuisine}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-3 rounded-lg font-semibold"
            >
              Save Place
            </button>

            <button
              type="button"
              onClick={() => setLocation("/admin")}
              className="border border-border px-5 py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}