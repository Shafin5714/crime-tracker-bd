"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  AlertTriangle,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

import { useCrime, useValidateCrime, useDeleteCrime } from "@/hooks/useCrimes";
import { ReportStatus, Severity, ValidationType } from "@/types/api.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ReportMiniMap = dynamic(
  () => import("@/components/report/ReportMiniMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

export default function ReportDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  const { data: report, isLoading, isError } = useCrime(reportId);
  const validateMutation = useValidateCrime();
  const deleteMutation = useDeleteCrime();

  const [validationComment, setValidationComment] = useState("");
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleVerify = () => {
    if (!report) return;

    validateMutation.mutate(
      {
        id: report.id,
        data: {
          type: ValidationType.CONFIRM,
          comment: validationComment,
        },
      },
      {
        onSuccess: () => {
          toast.success("Report Verified", {
            description: "The crime report has been successfully verified.",
          });
          setIsVerifyDialogOpen(false);
        },
        onError: () => {
          toast.error("Error", {
            description: "Failed to verify the report. Please try again.",
          });
        },
      },
    );
  };

  const handleDelete = () => {
    if (!report) return;

    deleteMutation.mutate(report.id, {
      onSuccess: () => {
        toast.success("Report Removed", {
          description: "The crime report has been removed.",
        });
        setIsDeleteDialogOpen(false);
        router.push("/admin/reports");
      },
      onError: () => {
        toast.error("Error", {
          description: "Failed to remove the report. Please try again.",
        });
      },
    });
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <AlertTriangle className="size-12 text-destructive" />
        <h2 className="text-xl font-semibold">Report not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/admin" className="hover:text-primary transition-colors">
          Admin
        </Link>
        <ChevronRight className="size-4" />
        <Link
          href="/admin/reports"
          className="hover:text-primary transition-colors"
        >
          Reports
        </Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {report.id}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Report Details</h1>
          <p className="text-sm text-muted-foreground">ID: {report.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {report.status !== ReportStatus.VERIFIED && (
            <Dialog
              open={isVerifyDialogOpen}
              onOpenChange={setIsVerifyDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 size-4" />
                  Verify Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Verify Report</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to verify this report? This will mark
                    it as confirmed and visible to all users.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Textarea
                    placeholder="Add a verification note (optional)..."
                    value={validationComment}
                    onChange={(e) => setValidationComment(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsVerifyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerify}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={validateMutation.isPending}
                  >
                    {validateMutation.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 size-4" />
                    )}
                    Confirm Verification
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">
                <XCircle className="mr-2 size-4" />
                Remove Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Report</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this report? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 size-4" />
                  )}
                  Delete Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800 translate-y-0 hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {report.crimeType}
                    {getStatusBadge(report.status)}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Calendar className="size-4" />
                    Happened on{" "}
                    {format(new Date(report.occurredAt), "PPP 'at' p")}
                  </CardDescription>
                </div>
                <div>{getSeverityBadge(report.severity)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <MapPin className="size-4" /> Location
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {report.address}
                  </p>
                  <div className="mt-1 text-xs text-muted-foreground font-mono">
                    {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Division: {report.division || "N/A"}</p>
                    <p>District: {report.district || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Media / Sources */}
              {report.media && report.media.length > 0 && (
                <div>
                  <Separator className="mb-4" />
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="size-4" /> Sources / Evidence
                  </h4>
                  <div className="space-y-2">
                    {report.media.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all"
                      >
                        <ExternalLink className="size-3 shrink-0" />
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-zinc-50 dark:bg-zinc-900/50 border-t py-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-green-600" />
                <span>
                  Verified encrypted report data • Source: Community Reporting
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Location Map */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4" />
                Location View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportMiniMap
                latitude={report.latitude}
                longitude={report.longitude}
                crimeType={report.crimeType}
                severity={report.severity}
              />
            </CardContent>
          </Card>

          {/* Reporter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Reporter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.isAnonymous ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="size-4" />
                  <span>This report was submitted anonymously.</span>
                </div>
              ) : report.user ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                    <span className="font-medium">Name:</span>
                    <span>{report.user.name || "N/A"}</span>
                    <span className="font-medium">Email:</span>
                    <span>{report.user.email}</span>
                    <span className="font-medium">User ID:</span>
                    <span className="font-mono text-xs">{report.user.id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Reporter information is unavailable.
                </p>
              )}
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="size-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <span className="font-medium">Created At:</span>
                  <span>{format(new Date(report.createdAt), "PP pp")}</span>
                  <span className="font-medium">Last Updated:</span>
                  <span>{format(new Date(report.updatedAt), "PP pp")}</span>
                  <span className="font-medium">Validation Count:</span>
                  <span>{report._count?.validations || 0}</span>
                  <span className="font-medium">Confirmations:</span>
                  <span className="text-green-600 font-medium">
                    {report.verificationCount || 0}
                  </span>
                  <span className="font-medium">Denials:</span>
                  <span className="text-red-600 font-medium">
                    {report.denialCount || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
