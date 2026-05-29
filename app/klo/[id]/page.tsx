import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Toilet, Rating } from "@/lib/types";

function StarRating({ value }: { value: number | null }) {
  if (!value) return <span className="text-gray-400">Noch keine Bewertung</span>;
  return (
    <span className="text-yellow-500 text-xl">
      {"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}
      <span className="text-gray-600 text-base ml-2">{value.toFixed(1)} / 5</span>
    </span>
  );
}

export default async function ToiletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: toilet } = await supabase
    .from("toilets")
    .select("*")
    .eq("id", id)
    .single();

  if (!toilet) notFound();

  const { data: ratings } = await supabase
    .from("ratings")
    .select("*")
    .eq("toilet_id", id)
    .order("created_at", { ascending: false });

  const t = toilet as Toilet;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-blue-200 hover:text-white text-sm">
            ← Zurück zur Karte
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h1 className="text-2xl font-bold text-gray-900">{t.name}</h1>
          <p className="text-gray-500 mt-1">{t.address}, {t.city}</p>

          <div className="mt-3">
            <StarRating value={t.rating_avg} />
            {t.rating_count > 0 && (
              <span className="text-gray-400 text-sm ml-2">({t.rating_count} Bewertungen)</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {t.is_free && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Kostenlos
              </span>
            )}
            {t.is_accessible && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                ♿ Barrierefrei
              </span>
            )}
          </div>

          {t.opening_hours && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Öffnungszeiten</h3>
              <p className="text-gray-600 text-sm mt-1">{t.opening_hours}</p>
            </div>
          )}

          {t.description && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Beschreibung</h3>
              <p className="text-gray-600 text-sm mt-1">{t.description}</p>
            </div>
          )}
        </div>

        {/* Karte */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-48">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${t.lng - 0.005},${t.lat - 0.003},${t.lng + 0.005},${t.lat + 0.003}&layer=mapnik&marker=${t.lat},${t.lng}`}
          />
        </div>

        {/* Bewertungen */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Bewertungen ({(ratings as Rating[])?.length ?? 0})
          </h2>
          {!ratings || ratings.length === 0 ? (
            <p className="text-gray-400 text-sm">Noch keine Bewertungen vorhanden.</p>
          ) : (
            <ul className="space-y-3">
              {(ratings as Rating[]).map((r) => (
                <li key={r.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="text-yellow-500">
                    {"★".repeat(r.score)}{"☆".repeat(5 - r.score)}
                  </div>
                  {r.comment && (
                    <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(r.created_at).toLocaleDateString("de-DE")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
