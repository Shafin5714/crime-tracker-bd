"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Default center (Dhaka, Bangladesh)
const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];
const DEFAULT_ZOOM = 13;

// Custom location marker icon
const locationIcon = L.divIcon({
  className: "custom-location-marker",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      background: #3b82f6;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: white;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface LocationPickerMapEventsProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationPickerMapEvents({
  onLocationSelect,
}: LocationPickerMapEventsProps) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

interface LocationPickerProps {
  value?: { latitude: number; longitude: number };
  onChange: (location: { latitude: number; longitude: number }) => void;
  className?: string;
}

export default function LocationPicker({
  value,
  onChange,
  className = "",
}: LocationPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(value ? [value.latitude, value.longitude] : null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedPosition([value.latitude, value.longitude]);
    }
  }, [value]);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setSelectedPosition([lat, lng]);
      onChange({ latitude: lat, longitude: lng });
    },
    [onChange]
  );

  const handleGetCurrentLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPosition([latitude, longitude]);
          onChange({ latitude, longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={selectedPosition || DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full min-h-[300px] rounded-lg z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPickerMapEvents onLocationSelect={handleLocationSelect} />

        {selectedPosition && (
          <Marker
            position={selectedPosition}
            icon={locationIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleLocationSelect(position.lat, position.lng);
              },
            }}
          />
        )}
      </MapContainer>

      {/* Instructions */}
      <div className="absolute top-2 left-2 z-[1000]">
        <Card className="px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Click on map to select location</span>
          </div>
        </Card>
      </div>

      {/* Current Location Button */}
      <div className="absolute bottom-2 right-2 z-[1000]">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleGetCurrentLocation}
          className="shadow-lg"
        >
          <Crosshair className="h-4 w-4 mr-1" />
          Use My Location
        </Button>
      </div>

      {/* Selected Coordinates Display */}
      {selectedPosition && (
        <div className="absolute bottom-2 left-2 z-[1000]">
          <Card className="px-3 py-2 shadow-lg">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Lat:</span>{" "}
              {selectedPosition[0].toFixed(6)},{" "}
              <span className="font-medium">Lng:</span>{" "}
              {selectedPosition[1].toFixed(6)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
