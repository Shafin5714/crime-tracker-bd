"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import {
  MapPin,
  Loader2,
  AlertCircle,
  Locate,
  Plus,
  Minus,
} from "lucide-react";
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

// Unified Map Controls Component
function MapControls({
  onLocate,
  geoLoading,
}: {
  onLocate: () => void;
  geoLoading: boolean;
}) {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-6 z-1000 flex flex-col gap-2">
      {/* Geolocation Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onLocate}
        disabled={geoLoading}
        className="shadow-md h-10 w-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all rounded-xl"
        title="Find my location"
      >
        {geoLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Locate className="h-5 w-5" />
        )}
      </Button>

      {/* Zoom Group */}
      <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => map.zoomIn()}
          className="h-10 w-10 border-b border-zinc-200 dark:border-zinc-800 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Zoom In"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => map.zoomOut()}
          className="h-10 w-10 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Zoom Out"
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
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

  const {
    crimes: apiCrimes,
    isLoading,
    error,
    filters,
    setFilters,
    setBounds,
    refetch,
  } = useMapCrimes(initialFilters);

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
      setFilters((prev: Partial<CrimeFilters>) => {
        // Only update if externalFilters actually change something in there
        // This is a shallow merge, but enough to trigger a loop if not careful
        const nextFilters = {
          ...prev,
          ...externalFilters,
        };

        // If they are exactly the same (shallowly), return previous state to avoid re-render
        const hasChanged = Object.keys(externalFilters).some(
          (key) =>
            externalFilters[key as keyof CrimeFilters] !==
            prev[key as keyof CrimeFilters],
        );

        return hasChanged ? nextFilters : prev;
      });
    }
  }, [externalFilters, setFilters]);

  // Memoize the center position
  // Calculate center position
  let mapCenter: [number, number] = DEFAULT_CENTER;
  if (externalFilters?.lat && externalFilters?.lng) {
    mapCenter = [externalFilters.lat, externalFilters.lng];
  } else if (userPosition) {
    mapCenter = [userPosition.latitude, userPosition.longitude];
  }

  // Recenter map when filters.lat/lng changes
  useEffect(() => {
    if (externalFilters?.lat && externalFilters?.lng && mapRef.current) {
      mapRef.current.flyTo([externalFilters.lat, externalFilters.lng], 14, {
        duration: 1.5,
      });
    }
  }, [externalFilters?.lat, externalFilters?.lng]);

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
    [setBounds],
  );

  // Handle locate me button
  const handleLocateMe = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  // Recenter map when user position changes
  useEffect(() => {
    if (userPosition && mapRef.current) {
      mapRef.current.flyTo(
        [userPosition.latitude, userPosition.longitude],
        14,
        { duration: 1.5 },
      );
    }
  }, [userPosition]);

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
        <MapControls onLocate={handleLocateMe} geoLoading={geoLoading} />

        {/* Map Event Handler */}
        <MapEventHandler onBoundsChange={handleBoundsChange} />

        {/* Recenter when user position changes */}
        {/* handled by useEffect */}

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
        <div className="absolute top-4 left-4 z-1000 max-w-xs">
          <MapFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={refetch}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-1000">
          <Card className="px-3 py-2 flex items-center gap-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm">Loading crimes...</span>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 right-4 z-1000">
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
        <div className="absolute bottom-36 right-4 z-1000">
          <Card className="px-3 py-2 max-w-[200px] shadow-lg">
            <p className="text-xs text-muted-foreground">{geoError}</p>
          </Card>
        </div>
      )}

      {/* Stats Badge */}
      <div className="absolute bottom-4 left-4 z-1000">
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
