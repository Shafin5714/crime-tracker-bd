// ============================================================================
// PermissionButton - Button that conditionally renders based on user role
// ============================================================================

"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PermissionButtonProps extends ButtonProps {
  /**
   * The minimum role required to interact with this button
   */
  requiredRole: UserRole;
  /**
   * Behavior when user lacks permission
   * - "hide": Don't render the button at all
   * - "disable": Render but disable the button
   * @default "hide"
   */
  fallbackBehavior?: "hide" | "disable";
  /**
   * Custom fallback content to render when user lacks permission and fallbackBehavior is "hide"
   */
  fallback?: React.ReactNode;
  /**
   * Tooltip message to show when button is disabled due to insufficient permissions
   * @default "You don't have permission to perform this action"
   */
  disabledTooltip?: string;
  /**
   * If true, checks for exact role match instead of minimum role
   * @default false
   */
  exactRole?: boolean;
}

/**
 * PermissionButton wraps the Button component with role-based access control.
 * It conditionally shows, hides, or disables the button based on user permissions.
 *
 * @example
 * // Hide button for non-admins
 * <PermissionButton requiredRole={UserRole.ADMIN} onClick={handleDelete}>
 *   Delete Report
 * </PermissionButton>
 *
 * @example
 * // Disable button for non-moderators with tooltip
 * <PermissionButton
 *   requiredRole={UserRole.MODERATOR}
 *   fallbackBehavior="disable"
 *   disabledTooltip="Only moderators can approve reports"
 * >
 *   Approve
 * </PermissionButton>
 *
 * @example
 * // Show custom fallback for non-admins
 * <PermissionButton
 *   requiredRole={UserRole.ADMIN}
 *   fallback={<span className="text-muted-foreground">Admin only</span>}
 * >
 *   Manage Users
 * </PermissionButton>
 */
export function PermissionButton({
  requiredRole,
  fallbackBehavior = "hide",
  fallback = null,
  disabledTooltip = "You don't have permission to perform this action",
  exactRole = false,
  disabled,
  children,
  ...props
}: PermissionButtonProps) {
  const { hasRole, user, isAuthenticated } = useAuth();

  // Check permission based on exact or minimum role
  const hasPermission = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;

    if (exactRole) {
      return user.role === requiredRole;
    }

    return hasRole(requiredRole);
  }, [isAuthenticated, user, exactRole, requiredRole, hasRole]);

  // User has permission - render normal button
  if (hasPermission) {
    return (
      <Button disabled={disabled} {...props}>
        {children}
      </Button>
    );
  }

  // No permission - handle based on fallback behavior
  if (fallbackBehavior === "hide") {
    return <>{fallback}</>;
  }

  // Disable behavior - show disabled button with optional tooltip
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-block">
          <Button disabled {...props}>
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{disabledTooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default PermissionButton;
