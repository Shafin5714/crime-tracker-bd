"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertTriangle,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  userRole: "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles: ("MODERATOR" | "ADMIN" | "SUPER_ADMIN")[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Crime Map",
    href: "/",
    icon: MapPin,
    roles: ["MODERATOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Moderation",
    href: "/moderate",
    icon: AlertTriangle,
    badge: "5",
    roles: ["MODERATOR", "ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "User Management",
    href: "/admin",
    icon: Users,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Analytics",
    href: "/dashboard",
    icon: BarChart3,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    name: "Role Management",
    href: "/superadmin",
    icon: UserCog,
    roles: ["SUPER_ADMIN"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

export function Sidebar({
  userRole,
  isCollapsed = false,
  onToggle,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-4" />
            </div>
            <span className="font-semibold">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className={cn(isCollapsed && "mx-auto")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? "secondary" : "destructive"}
                      className="h-5 min-w-5 justify-center px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute right-1 top-0 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <p>Logged in as</p>
            <p className="font-medium text-foreground">{userRole}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
