"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Users, Eye, Clock, MapPin } from "lucide-react";
import { MOCK_ALERTS, MOCK_CRIMES } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

export function RealTimeSidebar() {
  return (
    <aside className="w-80 border-l bg-background flex flex-col h-full z-20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Real-Time Data Streams
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Critical Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                Critical Alerts
              </h4>
              <button className="text-xs text-primary hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-card border-l-4 border-l-red-500 rounded-r-md p-3 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-1">
                    <Badge
                      variant="destructive"
                      className="text-[10px] h-4 px-1"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm leading-tight mb-1">
                        {alert.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-1">
                        {alert.location}
                      </p>
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incident Feed */}
          <div>
            <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Recent Incident Feed
            </h4>
            <div className="space-y-3">
              {MOCK_CRIMES.slice(0, 3).map((crime) => (
                <div
                  key={crime.id}
                  className="bg-muted/20 rounded-md p-3 hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                      {crime.isAnonymous ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-sm truncate pr-2">
                          {crime.crimeType.replace(/_/g, " ")}
                        </h5>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {crime.description}
                      </p>
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(crime.occurredAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer / Action Button */}
      <div className="p-4 border-t bg-muted/10">
        <Button
          asChild
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md h-12"
          size="lg"
        >
          <Link href="/report">
            <Plus className="mr-2 h-5 w-5" />
            Report New Incident
          </Link>
        </Button>
        <div className="flex justify-between items-center mt-3 text-[10px] text-muted-foreground px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            v2.4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
