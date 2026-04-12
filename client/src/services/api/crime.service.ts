// ============================================================================
// Crime Service - Crime Report API calls
// ============================================================================

import apiClient from "./client";
import type {
  CrimeReport,
  CreateCrimeRequest,
  UpdateCrimeRequest,
  ValidateCrimeRequest,
  CrimeFilters,
  HeatmapFilters,
  HeatmapPoint,
  PaginatedResponse,
  ApiSuccessResponse,
  CrimeStatsResponse,
} from "@/types/api.types";

const CRIMES_BASE = "/crimes";

// Helper to convert filters object to query string
const buildQueryString = (filters: Record<string, unknown>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

export const crimeService = {
  /**
   * Get paginated list of crime reports with filters
   */
  async getCrimes(
    filters: CrimeFilters = {}
  ): Promise<PaginatedResponse<CrimeReport>> {
    const queryString = buildQueryString(filters as Record<string, unknown>);
    const url = queryString ? `${CRIMES_BASE}?${queryString}` : CRIMES_BASE;
    const response = await apiClient.get<PaginatedResponse<CrimeReport>>(url);
    return response.data;
  },

  /**
   * Get a single crime report by ID
   */
  async getCrimeById(id: string): Promise<CrimeReport> {
    const response = await apiClient.get<ApiSuccessResponse<CrimeReport>>(
      `${CRIMES_BASE}/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new crime report
   */
  async createCrime(data: CreateCrimeRequest): Promise<CrimeReport> {
    const response = await apiClient.post<ApiSuccessResponse<CrimeReport>>(
      CRIMES_BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update a crime report (Admin/Moderator only)
   */
  async updateCrime(
    id: string,
    data: UpdateCrimeRequest
  ): Promise<CrimeReport> {
    const response = await apiClient.put<ApiSuccessResponse<CrimeReport>>(
      `${CRIMES_BASE}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete a crime report (Admin only)
   */
  async deleteCrime(id: string): Promise<void> {
    await apiClient.delete(`${CRIMES_BASE}/${id}`);
  },

  /**
   * Validate (confirm/deny) a crime report
   */
  async validateCrime(
    id: string,
    data: ValidateCrimeRequest
  ): Promise<CrimeReport> {
    const response = await apiClient.post<ApiSuccessResponse<CrimeReport>>(
      `${CRIMES_BASE}/${id}/validate`,
      data
    );
    return response.data.data;
  },

  /**
   * Get heatmap data for visualization
   */
  async getHeatmapData(filters: HeatmapFilters = {}): Promise<HeatmapPoint[]> {
    const queryString = buildQueryString(filters as Record<string, unknown>);
    const url = queryString
      ? `${CRIMES_BASE}/heatmap?${queryString}`
      : `${CRIMES_BASE}/heatmap`;
    const response = await apiClient.get<ApiSuccessResponse<HeatmapPoint[]>>(
      url
    );
    return response.data.data;
  },

  /**
   * Get aggregated crime statistics
   */
  async getCrimeStats(division?: string): Promise<CrimeStatsResponse> {
    const queryString = division ? `?division=${encodeURIComponent(division)}` : "";
    const response = await apiClient.get<ApiSuccessResponse<CrimeStatsResponse>>(
      `${CRIMES_BASE}/stats${queryString}`
    );
    return response.data.data;
  },

  /**
   * Get crimes within a radius of a point
   */
  async getCrimesNearby(
    lat: number,
    lng: number,
    radius: number,
    additionalFilters: Omit<CrimeFilters, "lat" | "lng" | "radius"> = {}
  ): Promise<PaginatedResponse<CrimeReport>> {
    return this.getCrimes({
      lat,
      lng,
      radius,
      ...additionalFilters,
    });
  },

  /**
   * Get crimes within a bounding box
   */
  async getCrimesInBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
    additionalFilters: Omit<
      CrimeFilters,
      "minLat" | "maxLat" | "minLng" | "maxLng"
    > = {}
  ): Promise<PaginatedResponse<CrimeReport>> {
    return this.getCrimes({
      minLat,
      maxLat,
      minLng,
      maxLng,
      ...additionalFilters,
    });
  },
};

export default crimeService;
