import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Toilet, Rating } from "@/lib/types";

function StarRating({ value, size = "md" }: { value: number | null; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  if (!value) return <span className="text-gray-400 text-sm">Noch keine Bewertung</span>;
  return (
    <span className={`${sizes[size]} text-yellow-400`}>
      {"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}
      <span className="text-gray-500 text-sm ml-1.5">{value.toFixed(1)} / 5</span>
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zur Karte
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4 pb-10">

        {/* Hauptkarte */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Mini-Karte */}
          <div className="h-44 bg-gray-100">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${t.lng - 0.005},${t.lat - 0.003},${t.lng + 0.005},${t.lat + 0.003}&layer=mapnik&marker=${t.lat},${t.lng}`}
            />
          </div>

          <div className="p-5">
            <h1 className="text-xl font-bold text-gray-900">{t.name}</h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {t.address}, {t.city}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <StarRating value={t.rating_avg} size="md" />
              {t.rating_count > 0 && (
                <span className="text-gray-400 text-xs">({t.rating_count} Bewertungen)</span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {t.is_free ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">✓ Kostenlos</span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">💰 Kostenpflichtig</span>
              )}
              {t.is_accessible && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">♿ Barrierefrei</span>
              )}
            </div>

            {/* Infos */}
            <div className="mt-4 space-y-2">
              {t.opening_hours && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-base">🕐</span>
                  <div>
                    <span className="font-medium text-gray-700">Öffnungszeiten</span>
                    <p className="text-gray-500">{t.opening_hours}</p>
                  </div>
                </div>
              )}
              {t.description && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-base">ℹ️</span>
                  <div>
                    <span className="font-medium text-gray-700">Beschreibung</span>
                    <p className="text-gray-500">{t.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bewertungen */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Bewertungen
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {(ratings as Rating[])?.length ?? 0}
            </span>
          </h2>
          {!ratings || ratings.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-gray-400 text-sm">Noch keine Bewertungen vorhanden.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {(ratings as Rating[]).map((r) => (
                <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-base">
                      {"★".repeat(r.score)}{"☆".repeat(5 - r.score)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(r.created_at).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
