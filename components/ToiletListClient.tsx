"use client";

import Link from "next/link";
import { Toilet } from "@/lib/types";

function StarRating({ value }: { value: number | null }) {
  if (!value) return <span className="text-xs text-gray-400">Keine Bewertung</span>;
  return (
    <span className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}</span>
      <span className="text-gray-500 text-xs">{value.toFixed(1)}</span>
    </span>
  );
}

export default function ToiletListClient({
  toilets,
  selectedId,
  onSelect,
}: {
  toilets: Toilet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (toilets.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-3xl mb-2">🔍</div>
        <p className="text-gray-500 text-sm">Keine Einträge gefunden.</p>
        <p className="text-gray-400 text-xs mt-1">Versuche einen anderen Suchbegriff.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {toilets.map((t) => (
        <li key={t.id}>
          <Link
            href={`/klo/${t.id}`}
            onClick={() => onSelect(t.id)}
            className={`block px-4 py-3 transition-colors hover:bg-blue-50 ${
              selectedId === t.id ? "bg-blue-50 border-l-4 border-blue-500" : "border-l-4 border-transparent"
            }`}
          >
            <div className="font-medium text-gray-900 text-sm">{t.name}</div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {t.address}
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StarRating value={t.rating_avg} />
              {t.is_free && (
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                  Kostenlos
                </span>
              )}
              {t.is_accessible && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                  ♿ Barrierefrei
                </span>
              )}
              {t.opening_hours && (
                <span className="text-xs text-gray-400">🕐 {t.opening_hours}</span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
