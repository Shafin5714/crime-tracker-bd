"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Eye,
  MoreHorizontal,
  Search,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { useCrimes } from "@/hooks/useCrimes";
import { ReportStatus, Severity, CrimeType } from "@/types/api.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<ReportStatus | undefined>(undefined);
  const [severity, setSeverity] = useState<Severity | undefined>(undefined);

  // Custom crime type filter could be added here

  const { data, isLoading, isError } = useCrimes({
    page,
    limit,
    status,
    severity,
  });

  const handleStatusChange = (value: string) => {
    setStatus(value === "ALL" ? undefined : (value as ReportStatus));
    setPage(1);
  };

  const handleSeverityChange = (value: string) => {
    setSeverity(value === "ALL" ? undefined : (value as Severity));
    setPage(1);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.VERIFIED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
        );
      case ReportStatus.UNVERIFIED:
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            Unverified
          </Badge>
        );
      case ReportStatus.DISPUTED:
        return (
          <Badge
            variant="destructive"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Disputed
          </Badge>
        );
      case ReportStatus.REMOVED:
        return <Badge variant="destructive">Removed</Badge>;
      case ReportStatus.HIDDEN:
        return (
          <Badge variant="outline" className="text-gray-500">
            Hidden
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>;
      case Severity.HIGH:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
        );
      case Severity.MEDIUM:
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
        );
      case Severity.LOW:
        return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crime Reports</h2>
          <p className="text-muted-foreground">
            Manage and verify reported incidents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="mr-2 size-4" />
            Audit Logs
          </Button>
          <Button size="sm">
            <Search className="mr-2 size-4" />
            Search Reports
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            A list of all crime reports in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search by description..."
                className="max-w-[300px]"
              />
            </div>

            <div className="flex flex-1 gap-4 md:justify-end">
              <Select defaultValue="ALL" onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value={ReportStatus.UNVERIFIED}>
                    Unverified
                  </SelectItem>
                  <SelectItem value={ReportStatus.VERIFIED}>
                    Verified
                  </SelectItem>
                  <SelectItem value={ReportStatus.DISPUTED}>
                    Disputed
                  </SelectItem>
                  <SelectItem value={ReportStatus.HIDDEN}>Hidden</SelectItem>
                  <SelectItem value={ReportStatus.REMOVED}>Removed</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="ALL" onValueChange={handleSeverityChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Severities</SelectItem>
                  <SelectItem value={Severity.CRITICAL}>Critical</SelectItem>
                  <SelectItem value={Severity.HIGH}>High</SelectItem>
                  <SelectItem value={Severity.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={Severity.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-destructive"
                    >
                      Error loading reports.
                    </TableCell>
                  </TableRow>
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {report.crimeType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={report.address}
                      >
                        {report.address}
                      </TableCell>
                      <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        {format(new Date(report.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/reports/${report.id}`}>
                                <Eye className="mr-2 size-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 size-4" />
                              Verify Report
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="mr-2 size-4" />
                              Remove Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {data?.data.length || 0} of {data?.pagination?.total || 0}{" "}
              reports
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
