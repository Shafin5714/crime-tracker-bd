"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, RefreshCw, X, ChevronDown, ChevronUp } from "lucide-react";
import { CrimeType, Severity, ReportStatus } from "@/types/api.types";
import type { CrimeFilters } from "@/types/api.types";

// Crime type options
const CRIME_TYPES: { value: CrimeType; label: string }[] = [
  { value: CrimeType.THEFT, label: "Theft" },
  { value: CrimeType.ROBBERY, label: "Robbery" },
  { value: CrimeType.ASSAULT, label: "Assault" },
  { value: CrimeType.MURDER, label: "Murder" },
  { value: CrimeType.KIDNAPPING, label: "Kidnapping" },
  { value: CrimeType.FRAUD, label: "Fraud" },
  { value: CrimeType.CYBERCRIME, label: "Cybercrime" },
  { value: CrimeType.DRUG_RELATED, label: "Drug Related" },
  { value: CrimeType.VANDALISM, label: "Vandalism" },
  { value: CrimeType.HARASSMENT, label: "Harassment" },
  { value: CrimeType.DOMESTIC_VIOLENCE, label: "Domestic Violence" },
  { value: CrimeType.SEXUAL_ASSAULT, label: "Sexual Assault" },
  { value: CrimeType.BURGLARY, label: "Burglary" },
  { value: CrimeType.VEHICLE_THEFT, label: "Vehicle Theft" },
  { value: CrimeType.OTHER, label: "Other" },
];

// Severity options
const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: Severity.LOW, label: "Low" },
  { value: Severity.MEDIUM, label: "Medium" },
  { value: Severity.HIGH, label: "High" },
  { value: Severity.CRITICAL, label: "Critical" },
];

// Status options
const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: ReportStatus.UNVERIFIED, label: "Unverified" },
  { value: ReportStatus.VERIFIED, label: "Verified" },
  { value: ReportStatus.DISPUTED, label: "Disputed" },
  { value: ReportStatus.HIDDEN, label: "Hidden" },
];

interface MapFiltersProps {
  filters: Partial<CrimeFilters>;
  onFiltersChange: (filters: Partial<CrimeFilters>) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function MapFilters({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading = false,
}: MapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (
    key: keyof CrimeFilters,
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.crimeType ||
    filters.severity ||
    filters.status ||
    filters.startDate ||
    filters.endDate;

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-3 pt-0 space-y-3">
          {/* Crime Type */}
          <div className="space-y-1">
            <Label className="text-xs">Crime Type</Label>
            <Select
              value={filters.crimeType || "all"}
              onValueChange={(value: string) =>
                handleFilterChange("crimeType", value)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {CRIME_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-1">
            <Label className="text-xs">Severity</Label>
            <Select
              value={filters.severity || "all"}
              onValueChange={(value: string) =>
                handleFilterChange("severity", value)
              }
            >
              <SelectTrigger className="h-8 text-xs">
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

          {/* Status */}
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value: string) =>
                handleFilterChange("status", value)
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <Label className="text-xs">Start Date</Label>
            <Input
              type="date"
              className="h-8 text-xs"
              value={filters.startDate || ""}
              onChange={(e) =>
                handleFilterChange("startDate", e.target.value || undefined)
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Date</Label>
            <Input
              type="date"
              className="h-8 text-xs"
              value={filters.endDate || ""}
              onChange={(e) =>
                handleFilterChange("endDate", e.target.value || undefined)
              }
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handleClearFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
