"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Toilet } from "@/lib/types";

const CITIES = ["München", "Hamburg", "Berlin", "Köln", "Frankfurt"];

type FormData = Omit<Toilet, "id" | "rating_avg" | "rating_count" | "created_at">;

const defaultForm: FormData = {
  name: "",
  description: "",
  address: "",
  city: "München",
  lat: 48.1351,
  lng: 11.582,
  is_accessible: false,
  is_free: true,
  opening_hours: "",
};

export default function ToiletForm({ toilet }: { toilet?: Toilet }) {
  const [form, setForm] = useState<FormData>(
    toilet
      ? {
          name: toilet.name,
          description: toilet.description ?? "",
          address: toilet.address,
          city: toilet.city,
          lat: toilet.lat,
          lng: toilet.lng,
          is_accessible: toilet.is_accessible,
          is_free: toilet.is_free,
          opening_hours: toilet.opening_hours ?? "",
        }
      : defaultForm
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function set(field: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const payload = {
      ...form,
      description: form.description || null,
      opening_hours: form.opening_hours || null,
    };

    const { error } = toilet
      ? await supabase.from("toilets").update(payload).eq("id", toilet.id)
      : await supabase.from("toilets").insert(payload);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!toilet) return;
    if (!confirm("Eintrag wirklich löschen?")) return;
    const supabase = createClient();
    await supabase.from("toilets").delete().eq("id", toilet.id);
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="z.B. Marienhof Toilettenanlage"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
          <input
            required
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Straße Hausnummer"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stadt *</label>
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Öffnungszeiten</label>
          <input
            value={form.opening_hours ?? ""}
            onChange={(e) => set("opening_hours", e.target.value)}
            placeholder="z.B. Mo-So 8:00–22:00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breitengrad (lat) *</label>
          <input
            required
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => set("lat", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Längengrad (lng) *</label>
          <input
            required
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => set("lng", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Zusätzliche Informationen..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_free"
            checked={form.is_free}
            onChange={(e) => set("is_free", e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="is_free" className="text-sm text-gray-700">Kostenlos</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_accessible"
            checked={form.is_accessible}
            onChange={(e) => set("is_accessible", e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="is_accessible" className="text-sm text-gray-700">Barrierefrei</label>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        {toilet && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Eintrag löschen
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Speichern..." : toilet ? "Änderungen speichern" : "Eintrag anlegen"}
          </button>
        </div>
      </div>
    </form>
  );
}
