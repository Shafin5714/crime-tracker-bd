"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CrimeType } from "@/types/api.types";

interface MapFilterPillsProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const FILTERS = [
  { id: "all", label: "All Incidents", value: null },
  { id: "theft", label: "Theft", value: CrimeType.THEFT },
  { id: "assault", label: "Assault", value: CrimeType.ASSAULT },
  { id: "disturbance", label: "Disturbance", value: CrimeType.HARASSMENT }, // Mapping Disturbance to Harassment
  { id: "robbery", label: "Robbery", value: CrimeType.ROBBERY },
];

export function MapFilterPills({ activeFilter, onFilterChange }: MapFilterPillsProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 p-1 bg-background/80 backdrop-blur-md rounded-full shadow-lg border">
      {FILTERS.map((filter) => {
        const isActive =
          (filter.value === null && activeFilter === null) ||
          filter.value === activeFilter;

        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "rounded-full px-4 h-8 text-xs font-medium transition-all",
              isActive
                ? "shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
