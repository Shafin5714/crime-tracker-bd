// ============================================================================
// PrivateRoute - Wrapper component for protected routes
// ============================================================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/slices/authSlice";
import { hasPermission } from "@/lib/auth";
import { LoadingSpinner } from "@/components/common";
import type { UserRole } from "@/types/api.types";

interface PrivateRouteProps {
  children: React.ReactNode;
  /**
   * Optional minimum role required to access this route.
   * If not provided, any authenticated user can access.
   */
  requiredRole?: UserRole;
  /**
   * Custom loading component to show while checking auth
   */
  loadingComponent?: React.ReactNode;
  /**
   * Custom redirect path for unauthenticated users (default: /login)
   */
  loginRedirect?: string;
  /**
   * Custom redirect path for unauthorized users (default: /unauthorized)
   */
  unauthorizedRedirect?: string;
}

/**
 * PrivateRoute component wraps protected pages and handles:
 * - Redirecting unauthenticated users to login
 * - Optionally checking role-based access and redirecting to unauthorized page
 *
 * Uses Redux selectors to compute auth state from persisted data.
 * PersistGate handles the loading state, so no loading check needed here.
 *
 * @example
 * // Protect a route for any authenticated user
 * <PrivateRoute>
 *   <ProfilePage />
 * </PrivateRoute>
 *
 * @example
 * // Protect a route for admins only
 * <PrivateRoute requiredRole={UserRole.ADMIN}>
 *   <AdminDashboard />
 * </PrivateRoute>
 */
export function PrivateRoute({
  children,
  requiredRole,
  loadingComponent,
  loginRedirect = "/login",
  unauthorizedRedirect = "/unauthorized",
}: PrivateRouteProps) {
  const router = useRouter();
  
  // Use selectors to compute auth state from persisted data
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Store the current URL to redirect back after login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      router.replace(loginRedirect);
      return;
    }

    // Check role-based access
    if (requiredRole && !hasPermission(user?.role as UserRole, requiredRole)) {
      router.replace(unauthorizedRedirect);
      return;
    }
  }, [
    isAuthenticated,
    user?.role,
    requiredRole,
    router,
    loginRedirect,
    unauthorizedRedirect,
  ]);

  // Not authenticated - show loading while redirect happens
  if (!isAuthenticated) {
    return loadingComponent ?? (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // No required role or user has permission
  if (!requiredRole || hasPermission(user?.role as UserRole, requiredRole)) {
    return <>{children}</>;
  }

  // Unauthorized - show loading while redirect happens
  return loadingComponent ?? (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default PrivateRoute;
