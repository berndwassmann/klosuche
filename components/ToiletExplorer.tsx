"use client";

import { useState, useMemo } from "react";
import { Toilet } from "@/lib/types";
import MapView from "./MapView";
import ToiletListClient from "./ToiletListClient";

export default function ToiletExplorer({ toilets }: { toilets: Toilet[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return toilets;
    return toilets.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q)
    );
  }, [search, toilets]);

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="md:w-80 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
        {/* Suchfeld */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name oder Adresse suchen..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5 pl-1">
            {filtered.length} {filtered.length === 1 ? "Eintrag" : "Einträge"} gefunden
          </p>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          <ToiletListClient
            toilets={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </aside>

      {/* Karte */}
      <div className="flex-1 relative min-h-64">
        <MapView
          toilets={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
