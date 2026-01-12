"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CrimeType, Severity } from "@/types/api.types";
import type { CrimeFilters } from "@/types/api.types";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MapFilterPillsProps {
  filters: Partial<CrimeFilters>;
  onFilterChange: (filters: Partial<CrimeFilters>) => void;
}

const CATEGORY_FILTERS = [
  { id: "all", label: "All Incidents", value: null },
  { id: "theft", label: "Theft", value: CrimeType.THEFT },
  { id: "assault", label: "Assault", value: CrimeType.ASSAULT },
  { id: "disturbance", label: "Disturbance", value: CrimeType.HARASSMENT },
  { id: "robbery", label: "Robbery", value: CrimeType.ROBBERY },
];

const SEVERITY_OPTIONS = [
  { value: Severity.LOW, label: "Low" },
  { value: Severity.MEDIUM, label: "Medium" },
  { value: Severity.HIGH, label: "High" },
  { value: Severity.CRITICAL, label: "Critical" },
];

export function MapFilterPills({ filters, onFilterChange }: MapFilterPillsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCategoryChange = (category: CrimeType | null) => {
    onFilterChange({
      ...filters,
      crimeType: category || undefined,
    });
  };

  const activeCategory = filters.crimeType || null;
  const hasAdvancedFilters = filters.severity || filters.startDate || filters.endDate;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 items-center">
      {/* Pills Container */}
      <div className="flex gap-2 p-1 bg-background/80 backdrop-blur-md rounded-full shadow-lg border">
        {CATEGORY_FILTERS.map((filter) => {
          const isActive =
            (filter.value === null && !activeCategory) ||
            filter.value === activeCategory;

          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleCategoryChange(filter.value)}
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

      {/* Advanced Filters Button */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogTrigger asChild>
          <Button
            variant={hasAdvancedFilters ? "default" : "secondary"}
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg border bg-background/80 backdrop-blur-md"
            title="Advanced Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Severity */}
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={filters.severity || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    severity: value === "all" ? undefined : (value as Severity),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  {SEVERITY_OPTIONS.map((sev) => (
                    <SelectItem key={sev.value} value={sev.value}>
                      {sev.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      startDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      endDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Clear All */}
            <Button
              variant="outline"
              onClick={() => {
                onFilterChange({});
                setShowAdvanced(false);
              }}
              className="w-full mt-2"
            >
              <X className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
