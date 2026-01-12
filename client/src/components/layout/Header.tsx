"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  MapPin,
  FileWarning,
  LogIn,
  UserPlus,
  Menu,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Search,
  Bell,
  Loader2,
} from "lucide-react";

interface HeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
    avatar?: string;
  } | null;
  onLogout?: () => void;
  logoutPending?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    requiresAdmin: true,
  },
  { name: "Map", href: "/", icon: MapPin, active: true },
  { name: "Report Crime", href: "/report", icon: FileWarning },
];

const roleColors = {
  USER: "secondary",
  MODERATOR: "default",
  ADMIN: "destructive",
  SUPER_ADMIN: "destructive",
} as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({
  user,
  onLogout,
  logoutPending = false,
  onMenuClick,
  className,
}: HeaderProps) {
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (item.requiresAdmin) {
      return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    }
    return true;
  });

  return (
    <header
      className={cn(
        "h-16 border-b bg-background flex items-center justify-between px-4 z-30 shadow-sm",
        className
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:inline-block">
            Crime Tracker BD
          </span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search discussions or reports..."
            className="w-full pl-9 bg-muted/50 focus-visible:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Navigation & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <nav className="hidden md:flex items-center gap-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
                asChild
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pl-2 border-l">
          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge
                      variant={roleColors[user.role]}
                      className="mt-1 w-fit h-4 px-1.5 text-[10px]"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 size-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  disabled={logoutPending}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  {logoutPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  {logoutPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/login">
                  <LogIn className="mr-2 size-4" />
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 size-4" />
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
