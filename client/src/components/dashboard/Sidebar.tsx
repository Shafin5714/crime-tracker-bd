"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, MapPin, Clock, Plus, Shield } from "lucide-react";
import { crimeService } from "@/services/api";
import { CrimeReport, ReportStatus, Severity } from "@/types/api.types";
import { formatDistanceToNow } from "date-fns";

export function Sidebar() {
  const [recentReports, setRecentReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoading(true);
        // Fetch verified reports, limited to 10
        const response = await crimeService.getCrimes({
          status: ReportStatus.VERIFIED,
          limit: 10,
        });
        setRecentReports(response.data);
      } catch (error) {
        console.error("Failed to fetch recent reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
      case Severity.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case Severity.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case Severity.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <aside className="w-80 border-r bg-background flex flex-col h-full z-20 shadow-sm">
      {/* Quick Actions */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
          size="lg"
        >
          <Link href="/report">
            <Plus className="mr-2 h-4 w-4" />
            Report New Incident
          </Link>
        </Button>
      </div>

      {/* Verified Reports List */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 flex items-center justify-between border-b bg-muted/20">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4" /> Verified Reports
          </h3>
          <Link
            href="/search"
            className="text-xs text-primary hover:underline font-medium"
          >
            View All
          </Link>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ))
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => (
                <Card
                  key={report.id}
                  className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={`${getSeverityColor(
                          report.severity
                        )} text-[10px] px-1.5 py-0 h-5`}
                      >
                        {report.severity}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(report.occurredAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {report.crimeType.replace(/_/g, " ")}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      <span className="truncate">
                        {report.address || "Location unavailable"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No verified reports found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 justify-center bg-muted/20">
        <Link href="#" className="hover:text-foreground">
          Emergency Contacts
        </Link>
        <Link href="#" className="hover:text-foreground">
          Help & Support
        </Link>
        <Link href="#" className="hover:text-foreground">
          Privacy Policy
        </Link>
      </div>
    </aside>
  );
}
