// ============================================================================
// useAuth Hook - Authentication React Query hooks integrated with Redux
// ============================================================================

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, clearTokens, getAccessToken, setTokens } from "@/services/api";
import { hasPermission } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  logout as logoutAction,
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from "@/types/api.types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

/**
 * Hook to get the current authenticated user
 * Fetches from API and syncs with Redux
 */
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      // Sync with Redux - update user data
      const accessToken = getAccessToken();
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken && refreshToken) {
        dispatch(
          setCredentials({
            user: user,
            accessToken,
            refreshToken,
          })
        );
      }
      return user;
    },
    enabled: typeof window !== "undefined" && !!getAccessToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

/**
 * Hook to login a user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Sync with Redux
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      // Set the user in TanStack Query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Also set tokens in localStorage (done in authService, but ensure sync)
      setTokens(data.accessToken, data.refreshToken);
      // Check for redirect path
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    },
  });
};

/**
 * Hook to register a new user
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Sync with Redux
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      // Set the user in TanStack Query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Redirect to home
      router.push("/");
    },
  });
};

/**
 * Hook to logout the user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Redux state
      dispatch(logoutAction());
      // Clear the user from TanStack Query cache
      queryClient.setQueryData(authKeys.currentUser(), null);
      // Invalidate all queries
      queryClient.clear();
      // Redirect to login
      router.push("/login");
    },
    onError: () => {
      // Even on error, clear everything and redirect
      dispatch(logoutAction());
      clearTokens();
      queryClient.clear();
      router.push("/login");
    },
  });
};

/**
 * Combined auth hook for convenience
 * Reads auth state from Redux using selectors
 */
export const useAuth = () => {
  // Use selectors for computed state
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  
  // Use TanStack Query for API-level user data
  const { isLoading, error } = useCurrentUser();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  /**
   * Check if the current user has at least the required role
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    return hasPermission(user?.role as UserRole | undefined, requiredRole);
  };

  return {
    user: user as User | null,
    isLoading,
    isAuthenticated,
    error,
    hasRole,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation,
    logout: logoutMutation.mutate,
    logoutStatus: logoutMutation,
  };
};

export default useAuth;
