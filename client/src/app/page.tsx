"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OverviewSidebar } from "@/components/dashboard/OverviewSidebar";
import { RealTimeSidebar } from "@/components/dashboard/RealTimeSidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MapFilterPills } from "@/components/dashboard/MapFilterPills";
import { Loader2 } from "lucide-react";
import type { CrimeFilters } from "@/types/api.types";

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

export default function DashboardPage() {
  const [filters, setFilters] = useState<Partial<CrimeFilters>>({});
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      {/* Top Navigation - Full Width */}
      <TopBar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Crime Overview */}
        <OverviewSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setLeftSidebarOpen(!isLeftSidebarOpen)}
        />

        {/* Map Area (Center) */}
        <div className="relative flex-1 bg-muted/10 flex flex-col min-w-0">
            <div className="relative flex-1 h-full w-full">
               {/* Filter Pills Overlay */}
              <MapFilterPills
                  filters={filters}
                  onFilterChange={setFilters}
              />

              {/* Map Component */}
              <CrimeMap
                  showFilters={false}
                  className="w-full h-full"
                  filters={filters}
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
