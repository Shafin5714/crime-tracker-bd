"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileWarning,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { useCrimes } from "@/hooks/useCrimes";
import { ReportStatus, CrimeType, Severity, UserRole } from "@/types/api.types";

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

function DashboardContent() {
  const { data: allReports, isLoading } = useCrimes({ limit: 100 });
  const { data: pendingReports } = useCrimes({
    status: ReportStatus.UNVERIFIED,
    limit: 5,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate stats from reports
  const stats = React.useMemo(() => {
    if (!allReports?.data) {
      return {
        total: 0,
        verified: 0,
        pending: 0,
        critical: 0,
      };
    }

    return {
      total: allReports.pagination.total,
      verified: allReports.data.filter(
        (r) => r.status === ReportStatus.VERIFIED
      ).length,
      pending: allReports.data.filter(
        (r) => r.status === ReportStatus.UNVERIFIED
      ).length,
      critical: allReports.data.filter((r) => r.severity === Severity.CRITICAL)
        .length,
    };
  }, [allReports]);

  // Calculate crime type distribution
  const crimeDistribution = React.useMemo(() => {
    if (!allReports?.data) return [];

    const counts: Record<string, number> = {};
    allReports.data.forEach((report) => {
      counts[report.crimeType] = (counts[report.crimeType] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({
        type: crimeTypeLabels[type as CrimeType] || type,
        count,
        percentage: ((count / allReports.data.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [allReports]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Crime statistics and analytics overview
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="mr-2 size-4" />
          Last 30 days
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reports
            </CardTitle>
            <FileWarning className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-green-500" />
                  <span className="text-green-500">+12%</span> from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.verified}</div>
                <p className="text-xs text-muted-foreground">
                  Confirmed by community
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting moderation
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.critical}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Crime Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="size-5" />
              Crime Type Distribution
            </CardTitle>
            <CardDescription>Most reported crime types</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : crimeDistribution.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data available
              </p>
            ) : (
              <div className="space-y-4">
                {crimeDistribution.map((item) => (
                  <div key={item.type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.type}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trend Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Reports Over Time
            </CardTitle>
            <CardDescription>Daily report submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed bg-muted/20">
              <div className="text-center">
                <BarChart3 className="mx-auto size-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization coming soon
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Integrate with Recharts for trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Pending Reports
            </CardTitle>
            <CardDescription>Reports awaiting moderation</CardDescription>
          </CardHeader>
          <CardContent>
            {!pendingReports?.data.length ? (
              <p className="text-center text-muted-foreground py-8">
                No pending reports
              </p>
            ) : (
              <div className="space-y-3">
                {pendingReports.data.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex size-8 items-center justify-center rounded bg-yellow-500/10">
                      <AlertTriangle className="size-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {crimeTypeLabels[report.crimeType]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {report.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Report verified",
                  user: "Moderator",
                  time: "2 min ago",
                  type: "success",
                },
                {
                  action: "New report submitted",
                  user: "Anonymous",
                  time: "5 min ago",
                  type: "info",
                },
                {
                  action: "Report rejected",
                  user: "Admin",
                  time: "12 min ago",
                  type: "destructive",
                },
                {
                  action: "User registered",
                  user: "System",
                  time: "1 hour ago",
                  type: "info",
                },
                {
                  action: "Critical alert raised",
                  user: "System",
                  time: "2 hours ago",
                  type: "warning",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`size-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "destructive"
                        ? "bg-red-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute requiredRole={UserRole.ADMIN}>
      <DashboardContent />
    </PrivateRoute>
  );
}
