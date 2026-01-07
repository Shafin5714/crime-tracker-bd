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
  Users,
  Search,
  MoreHorizontal,
  Shield,
  Ban,
  CheckCircle2,
  Mail,
  Calendar,
  FileWarning,
  Settings,
  UserCog,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { useUsers, useBanUser, useUnbanUser } from "@/hooks/useUsers";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleIndicator } from "@/components/common/RoleIndicator";
import { showSuccess, showError } from "@/lib/toast";
import { UserRole, type UserFilters } from "@/types/api.types";

const roleColors: Record<UserRole, string> = {
  [UserRole.USER]: "bg-gray-500/10 text-gray-600",
  [UserRole.MODERATOR]: "bg-blue-500/10 text-blue-600",
  [UserRole.ADMIN]: "bg-purple-500/10 text-purple-600",
  [UserRole.SUPER_ADMIN]: "bg-red-500/10 text-red-600",
};

function AdminContent() {
  const [filters, setFilters] = React.useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, refetch } = useUsers(filters);
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
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
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">-</p>
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
              <p className="text-2xl font-bold">-</p>
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
              <p className="text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                A list of all users in the platform
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
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
