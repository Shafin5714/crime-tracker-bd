// ============================================================================
// Auth Service - Authentication API calls
// ============================================================================

import apiClient, { setTokens, clearTokens } from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from "@/types/api.types";

const AUTH_BASE = "/auth";

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE}/register`,
      data
    );
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE}/login`,
      data
    );
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  },

  /**
   * Logout - clears tokens from storage
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${AUTH_BASE}/logout`);
    } finally {
      clearTokens();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      `${AUTH_BASE}/refresh`,
      data
    );
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`${AUTH_BASE}/me`);
    return response.data.user;
  },
};

export default authService;
