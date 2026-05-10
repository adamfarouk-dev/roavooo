import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function AdminNewCity() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState({
    id: "",
    slug: "",
    name: "",
    image_url: "",
    tagline_en: "",
    tagline_fr: "",
    description_en: "",
    description_fr: "",
    tip_best_time_en: "",
    tip_best_time_fr: "",
    tip_packing_en: "",
    tip_packing_fr: "",
    tip_etiquette_en: "",
    tip_etiquette_fr: "",
    tip_transport_en: "",
    tip_transport_fr: "",
    tip_phrases_en: "",
    tip_phrases_fr: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = Object.entries(form).filter(
      ([, value]) => !value.trim()
    );

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing city details",
        description: "Fill out all city fields before saving.",
      });
      return;
    }

    const { error } = await supabase.from("cities").insert(form);

    if (error) {
      toast({
        variant: "destructive",
        title: "Could not create city",
        description: error.message,
      });
      return;
    }

    toast({
      title: "City created",
      description: `${form.name} was added successfully.`,
    });
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2">New City</h1>
        <p className="text-muted-foreground mb-8">Add a new city to Roavooo.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <input
            name="id"
            placeholder="ID (example: c4)"
            value={form.id}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="slug"
            placeholder="Slug (example: fes)"
            value={form.slug}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="name"
            placeholder="City name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="image_url"
            placeholder="Hero image URL"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tagline_en"
            placeholder="Tagline EN"
            value={form.tagline_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tagline_fr"
            placeholder="Tagline FR"
            value={form.tagline_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <textarea
            name="description_en"
            placeholder="Description EN"
            value={form.description_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[120px]"
            required
          />

          <textarea
            name="description_fr"
            placeholder="Description FR"
            value={form.description_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted min-h-[120px]"
            required
          />

          <input
            name="tip_best_time_en"
            placeholder="Best time EN"
            value={form.tip_best_time_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_best_time_fr"
            placeholder="Best time FR"
            value={form.tip_best_time_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_packing_en"
            placeholder="Packing EN"
            value={form.tip_packing_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_packing_fr"
            placeholder="Packing FR"
            value={form.tip_packing_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_etiquette_en"
            placeholder="Etiquette EN"
            value={form.tip_etiquette_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_etiquette_fr"
            placeholder="Etiquette FR"
            value={form.tip_etiquette_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_transport_en"
            placeholder="Transport EN"
            value={form.tip_transport_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_transport_fr"
            placeholder="Transport FR"
            value={form.tip_transport_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_phrases_en"
            placeholder="Useful phrases EN"
            value={form.tip_phrases_en}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <input
            name="tip_phrases_fr"
            placeholder="Useful phrases FR"
            value={form.tip_phrases_fr}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-muted"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-3 rounded-lg font-semibold"
            >
              Save City
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
