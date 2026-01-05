"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MapFilterPills } from "@/components/dashboard/MapFilterPills";
import { Loader2 } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Navigation */}
        <TopBar />

        {/* Map Area */}
        <div className="relative flex-1 bg-muted/10 w-full">
          {/* Filter Pills Overlay */}
          <MapFilterPills
            activeFilter={activeCategory}
            onFilterChange={setActiveCategory}
          />

          {/* Map Component */}
          <CrimeMap
            showFilters={false}
            className="w-full h-full"
            categoryFilter={activeCategory}
          />
        </div>
      </div>
    </div>
  );
}
