"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OverviewSidebar } from "@/components/dashboard/OverviewSidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { MapFilterPills } from "@/components/dashboard/MapFilterPills";
import { Loader2 } from "lucide-react";
import type { CrimeFilters } from "@/types/api.types";
import { useAuth } from "@/hooks/useAuth";

// Dynamically import CrimeMap to avoid SSR issues with Leaflet
const CrimeMap = dynamic(() => import("@/components/map/CrimeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading Map...</p>
      </div>
    </div>
  ),
});

const RealTimeSidebar = dynamic(
  () =>
    import("@/components/dashboard/RealTimeSidebar").then(
      (mod) => mod.RealTimeSidebar,
    ),
  { ssr: false },
);

export default function DashboardPage() {
  const [filters, setFilters] = useState<Partial<CrimeFilters>>({});
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { user, logout, logoutStatus, isAuthenticated } = useAuth();

  // Format user for Header/MobileNav components
  const formattedUser =
    isAuthenticated && user
      ? {
          id: user.id,
          name: user.name ?? "User",
          email: user.email,
          role: user.role as "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN",
        }
      : null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Unified Header - Full Width */}
      <Header
        user={formattedUser}
        onLogout={handleLogout}
        logoutPending={logoutStatus.isPending}
        onMenuClick={() => setMobileNavOpen(true)}
      />
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        user={formattedUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Crime Overview */}
        <OverviewSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!isLeftSidebarOpen)}
          onLocationSelect={(loc) => {
            setFilters((prev) => ({
              ...prev,
              lat: loc.lat,
              lng: loc.lng,
              radius: 5,
            }));
          }}
          onClear={() => {
            setFilters((prev) => ({
              ...prev,
              lat: undefined,
              lng: undefined,
              radius: undefined,
            }));
          }}
        />

        {/* Map Area (Center) */}
        <div className="relative flex-1 bg-muted/10 flex flex-col min-w-0">
          <div className="relative flex-1 h-full w-full">
            {/* Filter Pills Overlay */}
            <div className="absolute top-4 left-0 right-0 z-1000 flex flex-col items-center gap-4 pointer-events-none">
              <div className="pointer-events-auto">
                <MapFilterPills filters={filters} onFilterChange={setFilters} />
              </div>
            </div>

            {/* Map Component */}
            <CrimeMap
              showFilters={false}
              className="w-full h-full"
              filters={filters}
              sidebarOpen={isLeftSidebarOpen || isRightSidebarOpen}
            />
          </div>
        </div>

        {/* Right Sidebar - Real-Time Data Streams */}
        <RealTimeSidebar
          isOpen={isRightSidebarOpen}
          onToggle={() => setRightSidebarOpen(!isRightSidebarOpen)}
        />
      </div>
    </div>
  );
}
