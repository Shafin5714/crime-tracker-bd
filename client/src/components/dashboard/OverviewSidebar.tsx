"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MOCK_OVERVIEW_STATS,
  MOCK_REGIONAL_DATA,
  MOCK_TYPE_DISTRIBUTION,
} from "@/data/mockData";
import {
  BarChart,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  X,
} from "lucide-react";

// Popular places data
const POPULAR_PLACES = [
  { name: "Gulshan", type: "area" },
  { name: "Banani", type: "area" },
  { name: "Dhanmondi", type: "area" },
  { name: "Mirpur", type: "area" },
  { name: "Uttara", type: "area" },
  { name: "Motijheel", type: "area" },
  { name: "Bashundhara", type: "area" },
  { name: "Mohammadpur", type: "area" },
];

interface OverviewSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function OverviewSidebar({ isOpen, onToggle }: OverviewSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Filter places based on search query
  const filteredPlaces = searchQuery
    ? POPULAR_PLACES.filter((place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region);
    setSearchQuery("");
  };

  const handlePlaceSelect = (placeName: string) => {
    setSelectedRegion(placeName);
    setSearchQuery("");
  };

  const clearSelection = () => {
    setSelectedRegion(null);
    setSearchQuery("");
  };

  return (
    <aside
      className={`relative flex-shrink-0 transition-all duration-300 z-20 ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      {/* Sidebar Content Container */}
      <div
        className={`w-80 h-full border-r bg-background flex flex-col overflow-hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Crime Overview
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search by Region / Places */}
          <div>
            <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Search by Region
            </h4>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-muted/30 border-muted focus:bg-background transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && filteredPlaces.length > 0 && (
              <div className="mt-2 bg-card border rounded-lg shadow-lg overflow-hidden">
                {filteredPlaces.map((place) => (
                  <button
                    key={place.name}
                    onClick={() => handlePlaceSelect(place.name)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{place.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto capitalize">
                      {place.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && filteredPlaces.length === 0 && (
              <div className="mt-2 p-3 text-sm text-muted-foreground text-center bg-muted/20 rounded-lg">
                No places found for &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Selected Region Badge */}
            {selectedRegion && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Filtering by:
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  <MapPin className="h-3 w-3" />
                  {selectedRegion}
                  <button onClick={clearSelection} className="hover:opacity-70">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}

            {/* Quick Region Buttons */}
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">
                Popular areas:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PLACES.slice(0, 6).map((place) => (
                  <button
                    key={place.name}
                    onClick={() => handleRegionSelect(place.name)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedRegion === place.name
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Total Incidents
                </div>
                <div className="text-2xl font-bold">
                  {MOCK_OVERVIEW_STATS.totalIncidents}
                </div>
                <div className="flex items-center text-xs mt-1 text-green-500">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  {MOCK_OVERVIEW_STATS.totalIncidentsChange}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  High Priority
                </div>
                <div className="text-2xl font-bold">
                  {MOCK_OVERVIEW_STATS.highPriority}
                </div>
                <div className="flex items-center text-xs mt-1 text-red-500">
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                  {Math.abs(MOCK_OVERVIEW_STATS.highPriorityChange)} (
                  {MOCK_OVERVIEW_STATS.highPriorityChange > 0 ? "+" : ""}
                  {MOCK_OVERVIEW_STATS.highPriorityChange})
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Breakdown */}
          <div>
            <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Regional Breakdown
            </h4>
            <div className="space-y-2">
              {MOCK_REGIONAL_DATA.map((region) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{region.count}</span>
                    <span
                      className={`text-xs ${
                        region.change > 0 ? "text-orange-500" : "text-green-500"
                      }`}
                    >
                      ({region.change > 0 ? "+" : ""}
                      {region.change})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-xs text-primary mt-3 hover:underline">
              View All Regions
            </button>
          </div>

          {/* Incident Type Distribution */}
          <div>
            <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Incident Type Distribution
            </h4>
            <div className="space-y-4">
              {MOCK_TYPE_DISTRIBUTION.map((item) => (
                <div key={item.type}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border shadow-md p-0"
      >
        {isOpen ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
