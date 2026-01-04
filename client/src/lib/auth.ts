// ============================================================================
// Auth Utilities - Role hierarchy and permission checking
// ============================================================================

import { UserRole } from "@/types/api.types";

/**
 * Role hierarchy - higher number = more permissions
 */
export const roleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 0,
  [UserRole.MODERATOR]: 1,
  [UserRole.ADMIN]: 2,
  [UserRole.SUPER_ADMIN]: 3,
};

/**
 * Check if a user role has permission for a required role level
 * @param userRole - The user's current role
 * @param requiredRole - The minimum required role
 * @returns true if user has permission, false otherwise
 */
export const hasPermission = (
  userRole: UserRole | undefined | null,
  requiredRole: UserRole
): boolean => {
  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Get a human-readable label for a role
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    [UserRole.USER]: "User",
    [UserRole.MODERATOR]: "Moderator",
    [UserRole.ADMIN]: "Admin",
    [UserRole.SUPER_ADMIN]: "Super Admin",
  };
  return labels[role] || role;
};

/**
 * Get all roles that are lower or equal to the given role
 */
export const getAssignableRoles = (
  currentUserRole: UserRole
): UserRole[] => {
  const level = roleHierarchy[currentUserRole];
  return Object.entries(roleHierarchy)
    .filter(([, roleLevel]) => roleLevel < level)
    .map(([role]) => role as UserRole);
};
