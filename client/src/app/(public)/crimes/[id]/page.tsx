"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  AlertTriangle,
  User,
  ExternalLink,
  Info,
  ShieldCheck,
  Share2,
  Flag,
} from "lucide-react";

import { useCrime } from "@/hooks/useCrimes";
import { ReportStatus, Severity } from "@/types/api.types";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the mini map to avoid SSR issues with Leaflet
const ReportMiniMap = dynamic(
  () => import("@/components/report/ReportMiniMap"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  },
);

export default function PublicReportDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  const { data: report, isLoading, isError } = useCrime(reportId);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast here if you had the toast hook available in this scope
    alert("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertTriangle className="size-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Report not found</h2>
        <p className="text-muted-foreground max-w-md">
          The crime report you are looking for does not exist or has been
          removed.
        </p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="mr-2 size-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0 rounded-full"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {report.crimeType}
              </h1>
              {getStatusBadge(report.status)}
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="size-4" />
              Reported on {format(new Date(report.createdAt), "PPP")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 size-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
          >
            <Flag className="mr-2 size-4" />
            Report Issue
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Crime Details
                  </CardTitle>
                </div>
                {getSeverityBadge(report.severity)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </h4>
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin className="size-4" /> Location
                  </h4>
                  <p className="font-medium text-foreground">
                    {report.address}
                  </p>
                  <div className="mt-1 flex gap-2 text-sm text-muted-foreground">
                    <span className="bg-muted px-2 py-0.5 rounded text-xs">
                      {report.division || "N/A"}
                    </span>
                    <span className="bg-muted px-2 py-0.5 rounded text-xs">
                      {report.district || "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Calendar className="size-4" /> Date & Time
                  </h4>
                  <p className="font-medium text-foreground">
                    {format(new Date(report.occurredAt), "PPP")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    approx. {format(new Date(report.occurredAt), "p")}
                  </p>
                </div>
              </div>

              {/* Media / Sources */}
              {report.media && report.media.length > 0 && (
                <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-muted-foreground/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                    <Info className="size-4" /> Sources / Evidence
                  </h4>
                  <div className="space-y-2">
                    {report.media.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline break-all group bg-background p-2 rounded border border-transparent hover:border-border transition-all"
                      >
                        <ExternalLink className="size-3 shrink-0 group-hover:scale-110 transition-transform" />
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 py-3 px-6 border-t flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3 text-green-600" />
                Secure & Anonymous Record
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1 text-green-600">
                  {report.confirmations || 0} Confirmations
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  {report.denials || 0} Denials
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Location Map */}
          <Card className="overflow-hidden shadow-md border-none ring-1 ring-border">
            <CardHeader className="bg-muted/30 pb-3 border-b">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="size-4" />
                Map View
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] w-full">
                <ReportMiniMap
                  latitude={report.latitude}
                  longitude={report.longitude}
                  crimeType={report.crimeType}
                  severity={report.severity}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reporter Info */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="size-4" />
                Reporter
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.isAnonymous ? (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                  <span>
                    This report was submitted anonymously to protect the
                    reporter's identity.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {report.reporter?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {report.reporter?.name || "Verified User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Community Member
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
