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
import { useCrimes, useCrimeTrends, useAdminActivity } from "@/hooks/useCrimes";
import { ReportStatus, CrimeType, Severity, UserRole } from "@/types/api.types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: allReports, isLoading } = useCrimes({ limit: 100 });
  const { data: pendingReports } = useCrimes({
    status: ReportStatus.UNVERIFIED,
    limit: 5,
  });
  const { data: trendData, isLoading: isLoadingTrends } = useCrimeTrends();
  const { data: activities, isLoading: isLoadingActivity } = useAdminActivity();

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

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

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Reports Over Time
            </CardTitle>
            <CardDescription>Daily report submissions (Last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTrends || !isMounted ? (
              <div className="flex h-[200px] items-center justify-center">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ) : !trendData || trendData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data available
              </p>
            ) : (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: "rgba(255, 255, 255, 0.9)", 
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                      }}
                      labelClassName="font-semibold text-xs text-black"
                      itemStyle={{ color: "#3b82f6", fontSize: "12px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Reports" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorReports)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
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
            {isLoadingActivity ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            ) : !activities || activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div
                      className={`size-2 rounded-full shrink-0 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "destructive"
                          ? "bg-red-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {getRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
