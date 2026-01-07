"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  AlertTriangle,
  ChevronRight,
  Clock,
  Map,
} from "lucide-react";
import { useCrimes } from "@/hooks/useCrimes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import {
  CrimeType,
  Severity,
  ReportStatus,
  type CrimeFilters,
} from "@/types/api.types";

const crimeTypeLabels: Record<CrimeType, string> = {
  [CrimeType.THEFT]: "Theft",
  [CrimeType.ROBBERY]: "Robbery",
  [CrimeType.ASSAULT]: "Assault",
  [CrimeType.MURDER]: "Murder",
  [CrimeType.KIDNAPPING]: "Kidnapping",
  [CrimeType.FRAUD]: "Fraud",
  [CrimeType.CYBERCRIME]: "Cybercrime",
  [CrimeType.DRUG_RELATED]: "Drug Related",
  [CrimeType.VANDALISM]: "Vandalism",
  [CrimeType.HARASSMENT]: "Harassment",
  [CrimeType.DOMESTIC_VIOLENCE]: "Domestic Violence",
  [CrimeType.SEXUAL_ASSAULT]: "Sexual Assault",
  [CrimeType.BURGLARY]: "Burglary",
  [CrimeType.VEHICLE_THEFT]: "Vehicle Theft",
  [CrimeType.OTHER]: "Other",
};

const severityColors: Record<Severity, string> = {
  [Severity.LOW]: "bg-green-500/10 text-green-600 border-green-200",
  [Severity.MEDIUM]: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  [Severity.HIGH]: "bg-orange-500/10 text-orange-600 border-orange-200",
  [Severity.CRITICAL]: "bg-red-500/10 text-red-600 border-red-200",
};

const statusColors: Record<ReportStatus, string> = {
  [ReportStatus.UNVERIFIED]: "bg-yellow-500/10 text-yellow-600",
  [ReportStatus.VERIFIED]: "bg-green-500/10 text-green-600",
  [ReportStatus.DISPUTED]: "bg-orange-500/10 text-orange-600",
  [ReportStatus.HIDDEN]: "bg-gray-500/10 text-gray-600",
  [ReportStatus.REMOVED]: "bg-red-500/10 text-red-600",
};

export default function SearchPage() {
  const [filters, setFilters] = React.useState<CrimeFilters>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, error } = useCrimes(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a full implementation, this would geocode the search query
    // For now, we just trigger a refetch
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof CrimeFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Section */}
      <section className="border-b bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Search Crime Reports
            </h1>
            <p className="mt-2 text-muted-foreground">
              Find crime reports by location, type, or date range
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location (e.g., Dhaka, Chittagong)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 size-4" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="size-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Crime Type Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="crimeType">Crime Type</Label>
                    <select
                      id="crimeType"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={filters.crimeType || ""}
                      onChange={(e) =>
                        handleFilterChange("crimeType", e.target.value)
                      }
                    >
                      <option value="">All Types</option>
                      {Object.entries(crimeTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Severity Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <select
                      id="severity"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={filters.severity || ""}
                      onChange={(e) =>
                        handleFilterChange("severity", e.target.value)
                      }
                    >
                      <option value="">All Severities</option>
                      <option value={Severity.LOW}>Low</option>
                      <option value={Severity.MEDIUM}>Medium</option>
                      <option value={Severity.HIGH}>High</option>
                      <option value={Severity.CRITICAL}>Critical</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={filters.status || ""}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">All Statuses</option>
                      <option value={ReportStatus.UNVERIFIED}>
                        Unverified
                      </option>
                      <option value={ReportStatus.VERIFIED}>Verified</option>
                      <option value={ReportStatus.DISPUTED}>Disputed</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">From Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filters.startDate || ""}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">To Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filters.endDate || ""}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                    />
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setFilters({ page: 1, limit: 10 })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <main className="lg:col-span-3">
              {/* Map Preview */}
              <Card className="mb-6 overflow-hidden border-dashed">
                <div className="flex h-48 items-center justify-center bg-muted/50">
                  <div className="text-center">
                    <Map className="mx-auto size-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Interactive map view coming soon
                    </p>
                  </div>
                </div>
              </Card>

              {/* Results List */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {data?.pagination.total
                      ? `${data.pagination.total} Reports Found`
                      : "Crime Reports"}
                  </CardTitle>
                  <CardDescription>
                    Browse crime reports in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 border rounded-lg"
                        >
                          <Skeleton className="size-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-2/3" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <EmptyState
                      icon={AlertTriangle}
                      title="Error loading reports"
                      description="There was an error loading crime reports. Please try again."
                    />
                  ) : !data?.data.length ? (
                    <EmptyState
                      icon={Search}
                      title="No reports found"
                      description="Try adjusting your filters or search in a different area."
                    />
                  ) : (
                    <div className="space-y-4">
                      {data.data.map((crime) => (
                        <div
                          key={crime.id}
                          className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div
                            className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${
                              severityColors[crime.severity]
                            }`}
                          >
                            <AlertTriangle className="size-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">
                                  {crimeTypeLabels[crime.crimeType]}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {crime.description}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={statusColors[crime.status]}
                              >
                                {crime.status}
                              </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {crime.address ||
                                  `${crime.latitude.toFixed(
                                    4
                                  )}, ${crime.longitude.toFixed(4)}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatDate(crime.occurredAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                Reported {formatDate(crime.createdAt)}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/crime/${crime.id}`}>
                              <ChevronRight className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}

                      {/* Pagination */}
                      {data.pagination.totalPages > 1 && (
                        <div className="mt-6">
                          <Pagination
                            currentPage={data.pagination.page}
                            totalPages={data.pagination.totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
