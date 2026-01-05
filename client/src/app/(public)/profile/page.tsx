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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Calendar,
  Shield,
  FileWarning,
  Settings,
  Bell,
  MapPin,
  ChevronRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { RoleIndicator } from "@/components/common/RoleIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useCrimes } from "@/hooks/useCrimes";
import { EmptyState } from "@/components/common/EmptyState";
import { ReportStatus, Severity } from "@/types/api.types";

const severityColors: Record<Severity, string> = {
  [Severity.LOW]: "bg-green-500/10 text-green-600",
  [Severity.MEDIUM]: "bg-yellow-500/10 text-yellow-600",
  [Severity.HIGH]: "bg-orange-500/10 text-orange-600",
  [Severity.CRITICAL]: "bg-red-500/10 text-red-600",
};

const statusLabels: Record<ReportStatus, { label: string; color: string }> = {
  [ReportStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  [ReportStatus.VERIFIED]: {
    label: "Verified",
    color: "bg-green-500/10 text-green-600",
  },
  [ReportStatus.DISPUTED]: {
    label: "Disputed",
    color: "bg-orange-500/10 text-orange-600",
  },
  [ReportStatus.REJECTED]: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-600",
  },
  [ReportStatus.HIDDEN]: {
    label: "Hidden",
    color: "bg-gray-500/10 text-gray-600",
  },
};

function ProfileContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: reports, isLoading: reportsLoading } = useCrimes({
    page: 1,
    limit: 5,
  });

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="relative pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <Avatar className="size-24 border-4 border-background shadow-lg">
                <AvatarImage src={undefined} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 sm:pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {user?.name || "Anonymous User"}
                  </h1>
                  {user?.role && <RoleIndicator role={user.role} />}
                </div>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="size-4" />
                  {user?.email}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 size-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">{user?.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileWarning className="size-5" />
                    Your Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Reports Submitted
                    </span>
                    <Badge variant="secondary">
                      {reports?.pagination.total || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Verified Reports
                    </span>
                    <Badge variant="secondary">-</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Community Standing
                    </span>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Good
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    asChild
                    className="h-auto py-4 flex-col"
                  >
                    <Link href="/report">
                      <FileWarning className="size-6 mb-2" />
                      <span>Submit Report</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-auto py-4 flex-col"
                  >
                    <Link href="/search">
                      <MapPin className="size-6 mb-2" />
                      <span>View Map</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="h-auto py-4 flex-col"
                  >
                    <Link href="/settings">
                      <Bell className="size-6 mb-2" />
                      <span>Notifications</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Your Submitted Reports</CardTitle>
                <CardDescription>
                  View and manage your crime reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : !reports?.data.length ? (
                  <EmptyState
                    icon={FileWarning}
                    title="No reports yet"
                    description="You haven't submitted any crime reports. Help your community by reporting incidents."
                    action={
                      <Button asChild>
                        <Link href="/report">Submit a Report</Link>
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {reports.data.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                            severityColors[report.severity]
                          }`}
                        >
                          <AlertTriangle className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {report.crimeType}
                            </span>
                            <Badge
                              variant="outline"
                              className={statusLabels[report.status].color}
                            >
                              {statusLabels[report.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatDate(report.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {report.address || "Location set"}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about nearby crimes
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4 border-destructive/20">
                  <div>
                    <h4 className="font-medium text-destructive">
                      Delete Account
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and data
                    </p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}
