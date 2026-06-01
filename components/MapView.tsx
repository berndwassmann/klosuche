"use client";

import { useEffect, useRef } from "react";
import { Toilet } from "@/lib/types";

interface MapViewProps {
  toilets: Toilet[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function MapView({ toilets, selectedId, onSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([48.1351, 11.582], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      toilets.forEach((toilet) => {
        const marker = L.marker([toilet.lat, toilet.lng]).addTo(map);
        markersRef.current.set(toilet.id, marker);

        const stars = toilet.rating_avg
          ? `<span style="color:#f59e0b">${"★".repeat(Math.round(toilet.rating_avg))}${"☆".repeat(5 - Math.round(toilet.rating_avg))}</span> <span style="color:#888;font-size:11px">${toilet.rating_avg.toFixed(1)}</span>`
          : `<span style="color:#aaa;font-size:11px">Keine Bewertung</span>`;

        const badges = [
          toilet.is_free ? `<span style="background:#dcfce7;color:#166534;padding:1px 6px;border-radius:9999px;font-size:11px">Kostenlos</span>` : "",
          toilet.is_accessible ? `<span style="background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:9999px;font-size:11px">♿ Barrierefrei</span>` : "",
        ].filter(Boolean).join(" ");

        marker.bindPopup(`
          <div style="min-width:180px;font-family:sans-serif">
            <strong style="font-size:14px;color:#111">${toilet.name}</strong><br/>
            <span style="color:#888;font-size:12px">📍 ${toilet.address}</span><br/>
            <div style="margin:6px 0 4px">${stars}</div>
            ${badges ? `<div style="margin-bottom:6px">${badges}</div>` : ""}
            ${toilet.opening_hours ? `<div style="color:#666;font-size:11px;margin-bottom:6px">🕐 ${toilet.opening_hours}</div>` : ""}
            <a href="/klo/${toilet.id}" style="color:#2563eb;font-size:12px;font-weight:500">Details ansehen →</a>
          </div>
        `);

        marker.on("click", () => {
          onSelect?.(toilet.id);
        });
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom zu ausgewählter Toilette
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    const L_marker = marker as { getLatLng: () => { lat: number; lng: number }; openPopup: () => void };
    const map = mapInstanceRef.current as { setView: (latlng: [number, number], zoom: number, opts?: object) => void };
    const { lat, lng } = L_marker.getLatLng();
    map.setView([lat, lng], 16, { animate: true });
    L_marker.openPopup();
  }, [selectedId]);

  // Marker aktualisieren wenn gefiltert
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const visibleIds = new Set(toilets.map((t) => t.id));
    markersRef.current.forEach((marker, id) => {
      const m = marker as { addTo: (map: unknown) => void; remove: () => void; _map?: unknown };
      if (visibleIds.has(id)) {
        if (!m._map) m.addTo(mapInstanceRef.current!);
      } else {
        m.remove();
      }
    });
  }, [toilets]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
