"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
} from "lucide-react";

import { PrivateRoute } from "@/components/auth";
import { useCrimes, useValidateCrime } from "@/hooks/useCrimes";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { showSuccess, showError } from "@/lib/toast";
import {
  CrimeType,
  ReportStatus,
  Severity,
  ValidationType,
  UserRole,
  type CrimeReport,
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

function ModerationContent() {
  const [filters, setFilters] = React.useState<CrimeFilters>({
    page: 1,
    limit: 10,
    status: ReportStatus.UNVERIFIED,
  });
  const [selectedReport, setSelectedReport] =
    React.useState<CrimeReport | null>(null);

  const { data, isLoading, refetch } = useCrimes(filters);
  const { mutate: validateCrime, isPending: isValidating } = useValidateCrime();

  const handleValidate = (id: string, type: ValidationType) => {
    validateCrime(
      { id, data: { type } },
      {
        onSuccess: () => {
          showSuccess(
            type === ValidationType.CONFIRM
              ? "Report verified!"
              : "Report rejected"
          );
          setSelectedReport(null);
          refetch();
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : "Validation failed"
          );
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as ReportStatus,
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground mt-1">
          Review and verify submitted crime reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-yellow-500/10">
              <Clock className="size-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">
                {data?.pagination.total || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified Today</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="size-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected Today</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/10">
              <AlertTriangle className="size-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disputed</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reports Queue</CardTitle>
                <Tabs value={filters.status} onValueChange={handleStatusFilter}>
                  <TabsList>
                    <TabsTrigger value={ReportStatus.UNVERIFIED}>
                      Unverified
                    </TabsTrigger>
                    <TabsTrigger value={ReportStatus.DISPUTED}>
                      Disputed
                    </TabsTrigger>
                    <TabsTrigger value={ReportStatus.VERIFIED}>
                      Verified
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : !data?.data.length ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All clear!"
                  description="No reports pending review in this category."
                />
              ) : (
                <div className="space-y-3">
                  {data.data.map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                        selectedReport?.id === report.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                          severityColors[report.severity]
                        }`}
                      >
                        <AlertTriangle className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {crimeTypeLabels[report.crimeType]}
                          </span>
                          <Badge
                            variant="outline"
                            className={severityColors[report.severity]}
                          >
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(report.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {report.address || "Location set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {data.pagination.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={data.pagination.page}
                        totalPages={data.pagination.totalPages}
                        onPageChange={(page) =>
                          setFilters((prev) => ({ ...prev, page }))
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedReport ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Crime Type
                    </span>
                    <p className="font-medium">
                      {crimeTypeLabels[selectedReport.crimeType]}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Severity
                    </span>
                    <Badge className={severityColors[selectedReport.severity]}>
                      {selectedReport.severity}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Description
                    </span>
                    <p className="text-sm mt-1">{selectedReport.description}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                    <p className="text-sm">{selectedReport.address || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedReport.latitude.toFixed(6)},{" "}
                      {selectedReport.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Occurred At
                    </span>
                    <p className="text-sm">
                      {formatDate(selectedReport.occurredAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Reporter
                    </span>
                    <p className="text-sm">
                      {selectedReport.isAnonymous
                        ? "Anonymous"
                        : selectedReport.reporter?.name ||
                          selectedReport.reporter?.email ||
                          "Unknown"}
                    </p>
                  </div>

                  {selectedReport.status === ReportStatus.UNVERIFIED && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleValidate(
                            selectedReport.id,
                            ValidationType.CONFIRM
                          )
                        }
                        disabled={isValidating}
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Verify
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() =>
                          handleValidate(selectedReport.id, ValidationType.DENY)
                        }
                        disabled={isValidating}
                      >
                        <XCircle className="mr-2 size-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Select a report to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ModeratePage() {
  return (
    <PrivateRoute requiredRole={UserRole.MODERATOR}>
      <ModerationContent />
    </PrivateRoute>
  );
}
