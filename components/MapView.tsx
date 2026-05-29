"use client";

import { useEffect, useRef } from "react";
import { Toilet } from "@/lib/types";

export default function MapView({ toilets }: { toilets: Toilet[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Fix default marker icons
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
        marker.bindPopup(`
          <div style="min-width:160px">
            <strong style="font-size:14px">${toilet.name}</strong><br/>
            <span style="color:#666;font-size:12px">${toilet.address}</span><br/>
            ${toilet.rating_avg ? `<span style="color:#f59e0b">★ ${toilet.rating_avg.toFixed(1)}</span><br/>` : ""}
            <a href="/klo/${toilet.id}" style="color:#2563eb;font-size:12px;text-decoration:underline">Details ansehen →</a>
          </div>
        `);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [toilets]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  );
}
