// ============================================================================
// useAuth Hook - Authentication React Query hooks
// ============================================================================

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, clearTokens, getAccessToken } from "@/services/api";
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/api.types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

/**
 * Hook to get the current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
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

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Set the user in the cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Redirect to home
      router.push("/");
    },
  });
};

/**
 * Hook to register a new user
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // Set the user in the cache
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

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear the user from cache
      queryClient.setQueryData(authKeys.currentUser(), null);
      // Invalidate all queries
      queryClient.clear();
      // Redirect to login
      router.push("/login");
    },
    onError: () => {
      // Even on error, clear tokens and redirect
      clearTokens();
      queryClient.clear();
      router.push("/login");
    },
  });
};

/**
 * Combined auth hook for convenience
 */
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    user: user as User | null | undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation,
    logout: logoutMutation.mutate,
    logoutStatus: logoutMutation,
  };
};

export default useAuth;
