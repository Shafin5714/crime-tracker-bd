// ============================================================================
// useCrimes Hook - Crime Report React Query hooks
// ============================================================================

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crimeService } from "@/services/api";
import type {
  CreateCrimeRequest,
  UpdateCrimeRequest,
  ValidateCrimeRequest,
  CrimeFilters,
  HeatmapFilters,
} from "@/types/api.types";

// Query keys
export const crimeKeys = {
  all: ["crimes"] as const,
  lists: () => [...crimeKeys.all, "list"] as const,
  list: (filters: CrimeFilters) => [...crimeKeys.lists(), filters] as const,
  details: () => [...crimeKeys.all, "detail"] as const,
  detail: (id: string) => [...crimeKeys.details(), id] as const,
  heatmaps: () => [...crimeKeys.all, "heatmap"] as const,
  heatmap: (filters: HeatmapFilters) =>
    [...crimeKeys.heatmaps(), filters] as const,
};

/**
 * Hook to get paginated list of crimes with filters
 */
export const useCrimes = (filters: CrimeFilters = {}) => {
  return useQuery({
    queryKey: crimeKeys.list(filters),
    queryFn: () => crimeService.getCrimes(filters),
  });
};

/**
 * Hook to get a single crime by ID
 */
export const useCrime = (id: string) => {
  return useQuery({
    queryKey: crimeKeys.detail(id),
    queryFn: () => crimeService.getCrimeById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get heatmap data
 */
export const useHeatmapData = (filters: HeatmapFilters = {}) => {
  return useQuery({
    queryKey: crimeKeys.heatmap(filters),
    queryFn: () => crimeService.getHeatmapData(filters),
  });
};

/**
 * Hook to get crimes near a location
 */
export const useCrimesNearby = (
  lat: number | undefined,
  lng: number | undefined,
  radius: number = 5,
  additionalFilters: Omit<CrimeFilters, "lat" | "lng" | "radius"> = {}
) => {
  return useQuery({
    queryKey: crimeKeys.list({ lat, lng, radius, ...additionalFilters }),
    queryFn: () =>
      crimeService.getCrimesNearby(lat!, lng!, radius, additionalFilters),
    enabled: lat !== undefined && lng !== undefined,
  });
};

/**
 * Hook to submit a new crime report
 */
export const useSubmitCrime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCrimeRequest) => crimeService.createCrime(data),
    onSuccess: (newCrime) => {
      // Invalidate all crime lists
      queryClient.invalidateQueries({ queryKey: crimeKeys.lists() });
      // Invalidate heatmap data
      queryClient.invalidateQueries({ queryKey: crimeKeys.heatmaps() });
      // Add the new crime to the cache
      queryClient.setQueryData(crimeKeys.detail(newCrime.id), newCrime);
    },
  });
};

/**
 * Hook to update a crime report
 */
export const useUpdateCrime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCrimeRequest }) =>
      crimeService.updateCrime(id, data),
    onSuccess: (updatedCrime) => {
      // Update the crime in the cache
      queryClient.setQueryData(crimeKeys.detail(updatedCrime.id), updatedCrime);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: crimeKeys.lists() });
    },
  });
};

/**
 * Hook to delete a crime report
 */
export const useDeleteCrime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crimeService.deleteCrime(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: crimeKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: crimeKeys.lists() });
      // Invalidate heatmap
      queryClient.invalidateQueries({ queryKey: crimeKeys.heatmaps() });
    },
  });
};

/**
 * Hook to validate (confirm/deny) a crime report
 */
export const useValidateCrime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ValidateCrimeRequest }) =>
      crimeService.validateCrime(id, data),
    onSuccess: (updatedCrime) => {
      // Update the crime in the cache
      queryClient.setQueryData(crimeKeys.detail(updatedCrime.id), updatedCrime);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: crimeKeys.lists() });
    },
  });
};

export default useCrimes;
