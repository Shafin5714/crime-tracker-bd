// ============================================================================
// RoleIndicator - Badge component displaying user's role
// ============================================================================

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/auth";
import { UserRole } from "@/types/api.types";
import { Shield, UserCheck, UserCog, Crown } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

interface RoleIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * The user role to display
   */
  role: UserRole;
  /**
   * Whether to show an icon alongside the role label
   * @default false
   */
  showIcon?: boolean;
  /**
   * Size variant for the badge
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
}

/**
 * Get the appropriate icon for each role
 */
const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return Crown;
    case UserRole.ADMIN:
      return Shield;
    case UserRole.MODERATOR:
      return UserCog;
    case UserRole.USER:
    default:
      return UserCheck;
  }
};

/**
 * Get the appropriate variant/styling for each role
 */
const getRoleVariant = (
  role: UserRole
): VariantProps<typeof badgeVariants>["variant"] => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "default"; // Primary color for highest role
    case UserRole.ADMIN:
      return "destructive"; // Red/attention color for admin
    case UserRole.MODERATOR:
      return "secondary"; // Secondary color for moderator
    case UserRole.USER:
    default:
      return "outline"; // Subtle outline for regular users
  }
};

/**
 * RoleIndicator component displays the user's role as a styled badge.
 * Uses different colors and icons to visually distinguish role levels.
 *
 * @example
 * // Basic usage
 * <RoleIndicator role={UserRole.ADMIN} />
 *
 * @example
 * // With icon
 * <RoleIndicator role={UserRole.MODERATOR} showIcon />
 *
 * @example
 * // Different sizes
 * <RoleIndicator role={UserRole.USER} size="sm" />
 * <RoleIndicator role={UserRole.ADMIN} size="lg" showIcon />
 */
export function RoleIndicator({
  role,
  showIcon = false,
  size = "default",
  className,
  ...props
}: RoleIndicatorProps) {
  const Icon = getRoleIcon(role);
  const variant = getRoleVariant(role);
  const label = getRoleLabel(role);

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0",
    default: "text-xs px-2 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  const iconSizes = {
    sm: "size-2.5",
    default: "size-3",
    lg: "size-4",
  };

  return (
    <Badge
      variant={variant}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {showIcon && <Icon className={cn(iconSizes[size], "shrink-0")} />}
      {label}
    </Badge>
  );
}

export default RoleIndicator;
