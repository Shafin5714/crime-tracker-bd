"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { CrimeType, Severity } from "@/types/api.types";
import { getMarkerHtml } from "@/components/map/marker-utils";
import { Card } from "@/components/ui/card";

interface ReportMiniMapProps {
  latitude: number;
  longitude: number;
  crimeType: CrimeType;
  severity: Severity;
  zoom?: number;
}

// Component to handle map centering
function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function ReportMiniMap({
  latitude,
  longitude,
  crimeType,
  severity,
  zoom = 15,
}: ReportMiniMapProps) {
  const markerIcon = L.divIcon({
    className: "custom-crime-marker",
    html: getMarkerHtml(crimeType, severity),
    iconSize: [48, 58],
    iconAnchor: [24, 58],
  });

  const position: [number, number] = [latitude, longitude];

  return (
    <Card className="overflow-hidden h-[300px] relative w-full border-zinc-200 dark:border-zinc-800 shadow-sm">
      <MapContainer
        key={`${latitude}-${longitude}`}
        center={position}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full z-0"
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={markerIcon} />
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>

      {/* Coordinates Badge Overlay */}
      <div className="absolute bottom-3 left-3 z-1000">
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-800">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </div>
    </Card>
  );
}
