"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { CrimeReport } from "@/types/api.types";
import CrimePopup from "./CrimePopup";
import { getMarkerHtml } from "./marker-utils";

interface MapMarkerProps {
  crime: CrimeReport;
  onClick?: () => void;
}

export default function MapMarker({ crime, onClick }: MapMarkerProps) {
  const icon = useMemo(() => {
    return L.divIcon({
      className: "custom-crime-marker",
      html: getMarkerHtml(crime.crimeType, crime.severity),
      iconSize: [48, 58],
      iconAnchor: [24, 58], // Tip of the pin
      popupAnchor: [0, -58], // Above the pin
    });
  }, [crime.crimeType, crime.severity]);

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
