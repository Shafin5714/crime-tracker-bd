// ============================================================================
// User Service - User Management API calls (Admin)
// ============================================================================

import apiClient from "./client";
import type {
  UserListItem,
  UserFilters,
  UpdateUserRoleRequest,
  PaginatedResponse,
  User,
} from "@/types/api.types";

const USERS_BASE = "/users";

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

export const userService = {
  /**
   * Get paginated list of users (Admin only)
   */
  async getUsers(
    filters: UserFilters = {}
  ): Promise<PaginatedResponse<UserListItem>> {
    const queryString = buildQueryString(filters as Record<string, unknown>);
    const url = queryString ? `${USERS_BASE}?${queryString}` : USERS_BASE;
    const response = await apiClient.get<{
      users: UserListItem[];
      pagination: PaginatedResponse<UserListItem>["pagination"];
    }>(url);
    // Map backend response (users) to frontend expected format (data)
    return {
      data: response.data.users,
      pagination: response.data.pagination,
    };
  },

  /**
   * Get a single user by ID (Admin only)
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`${USERS_BASE}/${id}`);
    return response.data.user;
  },

  /**
   * Update a user's role (Super Admin only)
   */
  async updateUserRole(id: string, data: UpdateUserRoleRequest): Promise<User> {
    const response = await apiClient.put<{ user: User }>(
      `${USERS_BASE}/${id}/role`,
      data
    );
    return response.data.user;
  },

  /**
   * Ban a user (Admin only)
   */
  async banUser(id: string): Promise<User> {
    const response = await apiClient.post<{ user: User }>(
      `${USERS_BASE}/${id}/ban`
    );
    return response.data.user;
  },

  /**
   * Unban a user (Admin only)
   */
  async unbanUser(id: string): Promise<User> {
    const response = await apiClient.post<{ user: User }>(
      `${USERS_BASE}/${id}/unban`
    );
    return response.data.user;
  },
};

export default userService;
