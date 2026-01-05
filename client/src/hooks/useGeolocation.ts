// ============================================================================
// useGeolocation Hook - Browser geolocation API wrapper
// ============================================================================

import { useState, useCallback, useEffect } from "react";

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationResult {
  position: GeolocationPosition | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

// Default fallback position (Dhaka, Bangladesh)
const DEFAULT_POSITION: GeolocationPosition = {
  latitude: 23.8103,
  longitude: 90.4125,
  accuracy: 0,
};

export function useGeolocation(autoRequest = false): UseGeolocationResult {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser");
      setPosition(DEFAULT_POSITION);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        let errorMessage = "Failed to get location";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setError(errorMessage);
        // Don't set default position on error to avoid unexpected map jumps
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache
      }
    );
  }, []);

  // Auto-request location on mount if specified
  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return {
    position,
    loading,
    error,
    requestLocation,
  };
}

export default useGeolocation;
