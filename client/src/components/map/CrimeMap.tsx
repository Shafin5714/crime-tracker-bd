"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { MapPin, Loader2, AlertCircle, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MarkerClusterGroup from "./MarkerCluster";
import MapMarker from "./MapMarker";
import MapFilters from "./MapFilters";
import { useMapCrimes } from "@/hooks/useMapCrimes";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MOCK_CRIMES } from "@/data/mockData";
import type { CrimeFilters, CrimeReport } from "@/types/api.types";

// Default map center (Dhaka, Bangladesh)
const DEFAULT_CENTER: [number, number] = [23.8103, 90.4125];
const DEFAULT_ZOOM = 12;

interface CrimeMapProps {
  className?: string;
  showFilters?: boolean;
  onCrimeSelect?: (crime: CrimeReport) => void;
  initialFilters?: Partial<CrimeFilters>;
  filters?: Partial<CrimeFilters>;
}

// Component to handle map events and sync with bounds
function MapEventHandler({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    },
    zoomend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    },
  });

  // Trigger initial bounds on mount
  useEffect(() => {
    const bounds = map.getBounds();
    onBoundsChange({
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
    });
  }, [map, onBoundsChange]);

  return null;
}

// Component to recenter map
function RecenterControl({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [map, position]);

  return null;
}

export default function CrimeMap({
  className = "",
  showFilters = true,
  onCrimeSelect,
  initialFilters = {},
  filters: externalFilters,
}: CrimeMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const {
    position: userPosition,
    loading: geoLoading,
    error: geoError,
    requestLocation,
  } = useGeolocation();

  const { crimes: apiCrimes, isLoading, error, filters, setFilters, setBounds, refetch } =
    useMapCrimes(initialFilters);

  // Use mock data if API returns empty (only in development)
  const crimes =
    apiCrimes && apiCrimes.length > 0
      ? apiCrimes
      : !isLoading && process.env.NODE_ENV === "development"
      ? MOCK_CRIMES
      : [];

  // Sync external filters from props
  useEffect(() => {
    if (externalFilters) {
      setFilters((prev) => ({
        ...prev,
        ...externalFilters,
      }));
    }
  }, [externalFilters, setFilters]);

  // Memoize the center position
  const mapCenter = useMemo<[number, number]>(() => {
    if (userPosition) {
      return [userPosition.latitude, userPosition.longitude];
    }
    return DEFAULT_CENTER;
  }, [userPosition]);

  // Handle bounds change from map events
  const handleBoundsChange = useCallback(
    (bounds: {
      minLat: number;
      maxLat: number;
      minLng: number;
      maxLng: number;
    }) => {
      setBounds(bounds);
    },
    [setBounds]
  );

  // Handle locate me button
  const handleLocateMe = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {/* Map Event Handler */}
        <MapEventHandler onBoundsChange={handleBoundsChange} />

        {/* Recenter when user position changes */}
        {userPosition && (
          <RecenterControl
            position={[userPosition.latitude, userPosition.longitude]}
          />
        )}

        {/* Crime Markers with Clustering */}
        <MarkerClusterGroup>
          {crimes.map((crime) => (
            <MapMarker
              key={crime.id}
              crime={crime}
              onClick={() => onCrimeSelect?.(crime)}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-4 left-4 z-[1000] max-w-xs">
          <MapFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={refetch}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Locate Me Button */}
      <div className="absolute bottom-24 right-4 z-[1000]">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleLocateMe}
          disabled={geoLoading}
          className="shadow-lg"
          title="Find my location"
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000]">
          <Card className="px-3 py-2 flex items-center gap-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm">Loading crimes...</span>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 right-4 z-[1000]">
          <Card className="px-3 py-2 flex items-center gap-2 shadow-lg border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              Failed to load crimes
            </span>
          </Card>
        </div>
      )}

      {/* Geolocation Error */}
      {geoError && (
        <div className="absolute bottom-36 right-4 z-[1000]">
          <Card className="px-3 py-2 max-w-[200px] shadow-lg">
            <p className="text-xs text-muted-foreground">{geoError}</p>
          </Card>
        </div>
      )}

      {/* Stats Badge */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="px-3 py-2 flex items-center gap-2 shadow-lg">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {crimes.length} {crimes.length === 1 ? "crime" : "crimes"} in view
          </span>
        </Card>
      </div>
    </div>
  );
}
