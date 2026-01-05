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
  Shield,
  Users,
  Search,
  MoreHorizontal,
  UserCog,
  History,
  AlertTriangle,
  Lock,
  Key,
  Settings,
  Database,
  FileText,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { useUsers, useUpdateUserRole } from "@/hooks/useUsers";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { RoleIndicator } from "@/components/common/RoleIndicator";
import { showSuccess, showError } from "@/lib/toast";
import { UserRole, type UserFilters } from "@/types/api.types";

function SuperAdminContent() {
  const [filters, setFilters] = React.useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data, isLoading, refetch } = useUsers(filters);
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRole(
      { id: userId, data: { role: newRole } },
      {
        onSuccess: () => {
          showSuccess(`User role updated to ${newRole}`);
          refetch();
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : "Failed to update role"
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

  // Mock audit log data
  const auditLogs = [
    {
      action: "Role changed",
      target: "john@example.com",
      from: "USER",
      to: "MODERATOR",
      by: "admin@example.com",
      time: "2 min ago",
    },
    {
      action: "User banned",
      target: "spam@test.com",
      from: "-",
      to: "-",
      by: "admin@example.com",
      time: "1 hour ago",
    },
    {
      action: "Role changed",
      target: "sarah@example.com",
      from: "MODERATOR",
      to: "ADMIN",
      by: "superadmin@example.com",
      time: "3 hours ago",
    },
    {
      action: "User unbanned",
      target: "user123@example.com",
      from: "-",
      to: "-",
      by: "admin@example.com",
      time: "1 day ago",
    },
    {
      action: "Role changed",
      target: "newmod@example.com",
      from: "USER",
      to: "MODERATOR",
      by: "admin@example.com",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-red-500/10">
          <Shield className="size-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Super Admin Panel
          </h1>
          <p className="text-muted-foreground">
            System-wide role management and audit controls
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
        <CardContent className="flex gap-3 p-4">
          <AlertTriangle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Elevated Privileges Active</p>
            <p className="mt-1 text-yellow-700 dark:text-yellow-300">
              Actions taken in this panel are logged and audited. Role changes
              take effect immediately.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-500/10">
              <Users className="size-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Users</p>
              <p className="text-2xl font-bold">
                {data?.pagination.total || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <UserCog className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moderators</p>
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
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
              <Key className="size-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Super Admins</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5" />
                Role Management
              </CardTitle>
              <CardDescription>Assign and modify user roles</CardDescription>
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
          ) : !data?.data.length ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search."
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Change Role</TableHead>
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
                          <RoleIndicator role={user.role} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  isUpdating ||
                                  user.role === UserRole.SUPER_ADMIN
                                }
                              >
                                Change Role
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Select New Role
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, UserRole.USER)
                                }
                                disabled={user.role === UserRole.USER}
                              >
                                <Badge className="bg-gray-500/10 text-gray-600 mr-2">
                                  USER
                                </Badge>
                                Basic User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, UserRole.MODERATOR)
                                }
                                disabled={user.role === UserRole.MODERATOR}
                              >
                                <Badge className="bg-blue-500/10 text-blue-600 mr-2">
                                  MODERATOR
                                </Badge>
                                Report Moderator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(user.id, UserRole.ADMIN)
                                }
                                disabled={user.role === UserRole.ADMIN}
                              >
                                <Badge className="bg-purple-500/10 text-purple-600 mr-2">
                                  ADMIN
                                </Badge>
                                Administrator
                              </DropdownMenuItem>
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

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5" />
            Audit Log
          </CardTitle>
          <CardDescription>Recent administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.target}</TableCell>
                    <TableCell>
                      {log.from !== "-" ? (
                        <span className="text-sm">
                          {log.from} → {log.to}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.by}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Advanced system settings (Super Admin only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <Database className="size-8 text-muted-foreground mb-2" />
              <h4 className="font-medium">Database Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Backup, restore, and maintenance
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Manage
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <Key className="size-8 text-muted-foreground mb-2" />
              <h4 className="font-medium">Security Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Authentication and access control
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Configure
              </Button>
            </div>
            <div className="rounded-lg border p-4">
              <FileText className="size-8 text-muted-foreground mb-2" />
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Export reports and user data
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <PrivateRoute requiredRole={UserRole.SUPER_ADMIN}>
      <SuperAdminContent />
    </PrivateRoute>
  );
}
