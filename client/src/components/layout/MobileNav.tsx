"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Shield,
  MapPin,
  FileWarning,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  } | null;
  onLogout?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  roles?: ("USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN")[];
}

const navItems: NavItem[] = [
  { name: "Map", href: "/", icon: MapPin },
  {
    name: "Report Crime",
    href: "/report",
    icon: FileWarning,
    requiresAuth: true,
  },
  { name: "Profile", href: "/profile", icon: User, requiresAuth: true },
  { name: "Settings", href: "/settings", icon: Settings, requiresAuth: true },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: LayoutDashboard,
    requiresAuth: true,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

export function MobileNav({
  open,
  onOpenChange,
  user,
  onLogout,
}: MobileNavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.roles && user && !item.roles.includes(user.role)) return false;
    return true;
  });

  const handleNavClick = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-y-0 left-0 h-full w-72 max-w-full rounded-none border-r p-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
        <DialogTitle className="sr-only">Navigation Menu</DialogTitle>

        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={handleNavClick}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-5" />
            </div>
            <span className="font-bold tracking-tight">Crime Tracker BD</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          {user ? (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  onLogout?.();
                  onOpenChange(false);
                }}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" onClick={handleNavClick}>
                <Link href="/login">
                  <LogIn className="mr-2 size-4" />
                  Log in
                </Link>
              </Button>
              <Button asChild onClick={handleNavClick}>
                <Link href="/register">
                  <UserPlus className="mr-2 size-4" />
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileNav;
