"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { CrimeReport, Severity } from "@/types/api.types";
import CrimePopup from "./CrimePopup";

// Severity color mapping
const SEVERITY_COLORS: Record<Severity, string> = {
  LOW: "#22c55e", // green-500
  MEDIUM: "#eab308", // yellow-500
  HIGH: "#f97316", // orange-500
  CRITICAL: "#ef4444", // red-500
};

// Create custom marker icon based on severity
function createMarkerIcon(severity: Severity): L.DivIcon {
  const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.MEDIUM;

  return L.divIcon({
    className: "custom-crime-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

interface MapMarkerProps {
  crime: CrimeReport;
  onClick?: () => void;
}

export default function MapMarker({ crime, onClick }: MapMarkerProps) {
  const icon = useMemo(
    () => createMarkerIcon(crime.severity),
    [crime.severity]
  );

  return (
    <Marker
      position={[crime.latitude, crime.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup
        maxWidth={300}
        minWidth={250}
        className="crime-popup"
        closeButton={true}
      >
        <CrimePopup crime={crime} />
      </Popup>
    </Marker>
  );
}
