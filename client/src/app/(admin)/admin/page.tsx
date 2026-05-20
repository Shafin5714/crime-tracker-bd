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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  MoreHorizontal,
  Shield,
  Ban,
  CheckCircle2,
  FileWarning,
  Settings,
  UserCog,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { useUsers, useBanUser, useUnbanUser, useUserStats } from "@/hooks/useUsers";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleIndicator } from "@/components/common/RoleIndicator";
import { showSuccess, showError } from "@/lib/toast";
import { UserRole, type UserFilters } from "@/types/api.types";

function AdminContent() {
  const [filters, setFilters] = React.useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, refetch } = useUsers(filters);
  const { data: statsData, isLoading: isLoadingStats } = useUserStats();
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
  };

  const handleRoleChange = (value: string) => {
    const role = value === "ALL" ? undefined : (value as UserRole);
    setFilters((prev) => ({ ...prev, role, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    let isBanned: boolean | undefined;
    if (value === "ACTIVE") isBanned = false;
    else if (value === "BANNED") isBanned = true;
    setFilters((prev) => ({ ...prev, isBanned, page: 1 }));
  };

  const handleLimitChange = (value: string) => {
    setFilters((prev) => ({ ...prev, limit: parseInt(value, 10), page: 1 }));
  };

  const handleBan = (userId: string) => {
    banUser(userId, {
      onSuccess: () => {
        showSuccess("User has been banned");
        refetch();
      },
      onError: (error) => {
        showError(
          error instanceof Error ? error.message : "Failed to ban user"
        );
      },
    });
  };

  const handleUnban = (userId: string) => {
    unbanUser(userId, {
      onSuccess: () => {
        showSuccess("User has been unbanned");
        refetch();
      },
      onError: (error) => {
        showError(
          error instanceof Error ? error.message : "Failed to unban user"
        );
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <Users className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  statsData?.totalUsers ?? 0
                )}
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
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  (statsData?.totalUsers ?? 0) - (statsData?.bannedCount ?? 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/10">
              <Shield className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moderators</p>
              <p className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  statsData?.roleDistribution?.MODERATOR ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <Ban className="size-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Banned</p>
              <p className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  statsData?.bannedCount ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="border-border/50 shadow-xs">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Users</CardTitle>
              <CardDescription>
                A list of all users in the platform
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-md w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-background/50 dark:bg-input/20 border-border/80 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" variant="secondary" className="shrink-0 font-medium">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {/* Role Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Role:</span>
                <Select
                  value={filters.role || "ALL"}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-[130px] bg-background/50 dark:bg-input/20 border-border/80 text-xs h-9">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-popover border-border">
                    <SelectItem value="ALL" className="text-xs">All Roles</SelectItem>
                    <SelectItem value={UserRole.USER} className="text-xs">Basic Users</SelectItem>
                    <SelectItem value={UserRole.MODERATOR} className="text-xs">Moderators</SelectItem>
                    <SelectItem value={UserRole.ADMIN} className="text-xs">Administrators</SelectItem>
                    <SelectItem value={UserRole.SUPER_ADMIN} className="text-xs">Super Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</span>
                <Select
                  value={
                    filters.isBanned === undefined
                      ? "ALL"
                      : filters.isBanned
                      ? "BANNED"
                      : "ACTIVE"
                  }
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[120px] bg-background/50 dark:bg-input/20 border-border/80 text-xs h-9">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-popover border-border">
                    <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE" className="text-xs">Active Only</SelectItem>
                    <SelectItem value="BANNED" className="text-xs">Banned Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Limit Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Show:</span>
                <Select
                  value={String(filters.limit || 10)}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-[75px] bg-background/50 dark:bg-input/20 border-border/80 text-xs h-9">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-popover border-border">
                    <SelectItem value="5" className="text-xs">5</SelectItem>
                    <SelectItem value="10" className="text-xs">10</SelectItem>
                    <SelectItem value="25" className="text-xs">25</SelectItem>
                    <SelectItem value="50" className="text-xs">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data?.data?.length ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.name || "No name"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleIndicator role={user.role} size="sm" />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user._count?.crimeReports ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-600"
                            >
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <UserCog className="mr-2 size-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileWarning className="mr-2 size-4" />
                                View Reports
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.isBanned ? (
                                <DropdownMenuItem
                                  onClick={() => handleUnban(user.id)}
                                  disabled={isUnbanning}
                                >
                                  <CheckCircle2 className="mr-2 size-4" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleBan(user.id)}
                                  disabled={isBanning}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Ban className="mr-2 size-4" />
                                  Ban User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

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
            </>
          )}
        </CardContent>
      </Card>

      {/* System Settings Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure platform-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Report Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Configure report submission rules
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Configure
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Notification Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Manage alert thresholds and channels
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Configure
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">API Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Manage API keys and rate limits
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <PrivateRoute requiredRole={UserRole.ADMIN}>
      <AdminContent />
    </PrivateRoute>
  );
}
