"use client";

import Link from "next/link";
import { Toilet } from "@/lib/types";

function StarRating({ value }: { value: number | null }) {
  if (!value) return <span className="text-xs text-gray-400">Keine Bewertung</span>;
  return (
    <span className="text-yellow-500 text-sm">
      {"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}
      <span className="text-gray-500 text-xs ml-1">{value.toFixed(1)}</span>
    </span>
  );
}

export default function ToiletList({ toilets }: { toilets: Toilet[] }) {
  if (toilets.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Keine Einträge gefunden.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {toilets.map((t) => (
        <li key={t.id}>
          <Link
            href={`/klo/${t.id}`}
            className="block px-4 py-3 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900 text-sm">{t.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{t.address}</div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={t.rating_avg} />
              {t.is_free && (
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                  Kostenlos
                </span>
              )}
              {t.is_accessible && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Barrierefrei
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
