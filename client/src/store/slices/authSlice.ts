import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Initial state - PersistGate handles loading, so no isLoading needed here
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  updateTokens,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// ============================================================================
// Selectors - Compute derived state
// ============================================================================

import type { RootState } from "../index";

/**
 * Selector to check if user is authenticated
 * Computed from persisted user and accessToken
 */
export const selectIsAuthenticated = (state: RootState): boolean => {
  return !!state.auth.user && !!state.auth.accessToken;
};

/**
 * Selector to get current user
 */
export const selectCurrentUser = (state: RootState): User | null => {
  return state.auth.user;
};

/**
 * Selector to get access token
 */
export const selectAccessToken = (state: RootState): string | null => {
  return state.auth.accessToken;
};
