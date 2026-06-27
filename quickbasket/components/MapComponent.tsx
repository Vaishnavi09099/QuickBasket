"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  position: [number, number] | null;
  onDragEnd: (pos: [number, number]) => void;
};

export default function MapComponent({ position, onDragEnd }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const customIcon = new L.Icon({
        iconUrl: "/location.jpg",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      if (!mapRef.current) {
        const center = position ?? [0, 0];
        const map = L.map(mapContainerRef.current as HTMLElement).setView(center, position ? 15 : 2);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const marker = L.marker(center, {
          icon: customIcon,
          draggable: true,
        }).addTo(map);
        markerRef.current = marker;

        marker.on("dragend", () => {
          const { lat, lng } = marker.getLatLng();
          onDragEnd([lat, lng]);
        });
      } else {
        if (position) {
          mapRef.current.setView(position, 15, { animate: true });
          markerRef.current?.setLatLng(position);
        }
      }
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      cancelled = true;
    };
  }, [position, onDragEnd]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
