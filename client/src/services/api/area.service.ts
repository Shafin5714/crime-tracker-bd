import apiClient from "./client";
import type {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  ApiSuccessResponse,
} from "@/types/api.types";

const AREAS_BASE = "/areas";

export const areaService = {
  /**
   * Get all areas
   */
  async getAreas(): Promise<Area[]> {
    const response = await apiClient.get<{ data: Area[] }>(AREAS_BASE);
    return response.data.data;
  },

  /**
   * Get area by ID
   */
  async getAreaById(id: string): Promise<Area> {
    const response = await apiClient.get<ApiSuccessResponse<Area>>(
      `${AREAS_BASE}/${id}`,
    );
    return response.data.data;
  },

  /**
   * Search area by name
   */
  async searchArea(query: string): Promise<Area | null> {
    const response = await apiClient.get<{ data: Area | null }>(
      `${AREAS_BASE}/search?q=${encodeURIComponent(query)}`,
    );
    return response.data.data;
  },

  /**
   * Create a new area (Admin only)
   */
  async createArea(data: CreateAreaRequest): Promise<Area> {
    const response = await apiClient.post<ApiSuccessResponse<Area>>(
      AREAS_BASE,
      data,
    );
    return response.data.data;
  },

  /**
   * Update an area (Admin only)
   */
  async updateArea(id: string, data: UpdateAreaRequest): Promise<Area> {
    const response = await apiClient.put<ApiSuccessResponse<Area>>(
      `${AREAS_BASE}/${id}`,
      data,
    );
    return response.data.data;
  },

  /**
   * Delete an area (Admin only)
   */
  async deleteArea(id: string): Promise<void> {
    await apiClient.delete(`${AREAS_BASE}/${id}`);
  },
};

export default areaService;
