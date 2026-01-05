// ============================================================================
// useMapCrimes Hook - Fetch crimes based on map bounds
// ============================================================================

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { crimeService } from "@/services/api";
import type { CrimeFilters, CrimeReport } from "@/types/api.types";

interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface UseMapCrimesResult {
  crimes: CrimeReport[];
  isLoading: boolean;
  error: Error | null;
  filters: Partial<CrimeFilters>;
  setFilters: (filters: Partial<CrimeFilters>) => void;
  setBounds: (bounds: MapBounds) => void;
  refetch: () => void;
}

export function useMapCrimes(
  initialFilters: Partial<CrimeFilters> = {}
): UseMapCrimesResult {
  const [filters, setFilters] = useState<Partial<CrimeFilters>>(initialFilters);
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  // Combine filters with bounds
  const queryFilters = useMemo<CrimeFilters>(() => {
    const combined: CrimeFilters = {
      ...filters,
      limit: 100, // Backend max is 100
    };

    if (bounds) {
      combined.minLat = bounds.minLat;
      combined.maxLat = bounds.maxLat;
      combined.minLng = bounds.minLng;
      combined.maxLng = bounds.maxLng;
    }

    return combined;
  }, [filters, bounds]);

  // Query key includes filters and bounds
  const queryKey = useMemo(() => ["mapCrimes", queryFilters], [queryFilters]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => crimeService.getCrimes(queryFilters),
    enabled: bounds !== null, // Only fetch when bounds are set
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const handleSetFilters = useCallback((newFilters: Partial<CrimeFilters>) => {
    setFilters(newFilters);
  }, []);

  const handleSetBounds = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds);
  }, []);

  return {
    crimes: data?.data || [],
    isLoading,
    error: error as Error | null,
    filters,
    setFilters: handleSetFilters,
    setBounds: handleSetBounds,
    refetch,
  };
}

export default useMapCrimes;
