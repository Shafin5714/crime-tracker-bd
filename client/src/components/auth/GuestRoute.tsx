// ============================================================================
// GuestRoute - Wrapper for routes that should only be accessible to guests
// ============================================================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { LoadingSpinner } from "@/components/common";

interface GuestRouteProps {
  children: React.ReactNode;
  /**
   * Where to redirect authenticated users (default: /)
   */
  redirectTo?: string;
}

/**
 * GuestRoute component wraps pages that should only be accessible to guests
 * (unauthenticated users). If the user is already logged in, they are
 * redirected to the home page or a specified route.
 *
 * Uses Redux selectors to compute auth state from persisted data.
 * PersistGate handles the loading state, so auth is ready when this renders.
 *
 * Use this for login, register, and forgot password pages.
 *
 * @example
 * <GuestRoute>
 *   <LoginPage />
 * </GuestRoute>
 */
export function GuestRoute({
  children,
  redirectTo = "/",
}: GuestRouteProps) {
  const router = useRouter();
  
  // Use selector to compute auth state from persisted data
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Authenticated - show loading while redirect happens
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated - show the page
  return <>{children}</>;
}

export default GuestRoute;
