// ============================================================================
// RoleGuard - Conditionally render content based on user role
// ============================================================================

"use client";

import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/slices/authSlice";
import { hasPermission } from "@/lib/auth";
import type { UserRole } from "@/types/api.types";

interface RoleGuardProps {
  children: React.ReactNode;
  /**
   * The minimum role required to render the children
   */
  requiredRole: UserRole;
  /**
   * Optional fallback component to render if user lacks permission
   * If not provided, nothing is rendered
   */
  fallback?: React.ReactNode;
  /**
   * If true, checks for exact role match instead of minimum role
   */
  exactRole?: boolean;
}

/**
 * RoleGuard component for conditional rendering based on user role.
 * Unlike PrivateRoute, this doesn't redirect - it just shows/hides content.
 * Uses Redux selectors to compute auth state from persisted data.
 *
 * @example
 * // Show edit button only for moderators and above
 * <RoleGuard requiredRole={UserRole.MODERATOR}>
 *   <EditButton />
 * </RoleGuard>
 *
 * @example
 * // Show admin panel link only for admins, with fallback for others
 * <RoleGuard requiredRole={UserRole.ADMIN} fallback={<span>Upgrade to access</span>}>
 *   <AdminPanelLink />
 * </RoleGuard>
 *
 * @example
 * // Show only for exact role match
 * <RoleGuard requiredRole={UserRole.MODERATOR} exactRole>
 *   <ModeratorOnlyFeature />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  requiredRole,
  fallback = null,
  exactRole = false,
}: RoleGuardProps) {
  // Use selectors to compute auth state
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  // Not authenticated - show fallback
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check exact role match
  if (exactRole) {
    if (user.role === requiredRole) {
      return <>{children}</>;
    }
    return <>{fallback}</>;
  }

  // Check minimum role
  if (hasPermission(user.role as UserRole, requiredRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default RoleGuard;
