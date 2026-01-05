"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MOCK_OVERVIEW_STATS,
  MOCK_REGIONAL_DATA,
  MOCK_TYPE_DISTRIBUTION,
} from "@/data/mockData";
import { BarChart, ArrowUp, ArrowDown, Target } from "lucide-react";

export function OverviewSidebar() {
  return (
    <aside className="w-80 border-r bg-background flex flex-col h-full z-20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <BarChart className="h-4 w-4" /> Crime Overview
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-1">
                Total Incidents
              </div>
              <div className="text-2xl font-bold">
                {MOCK_OVERVIEW_STATS.totalIncidents}
              </div>
              <div className="flex items-center text-xs mt-1 text-green-500">
                <ArrowUp className="h-3 w-3 mr-0.5" />
                {MOCK_OVERVIEW_STATS.totalIncidentsChange}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-1">
                High Priority
              </div>
              <div className="text-2xl font-bold">
                {MOCK_OVERVIEW_STATS.highPriority}
              </div>
              <div className="flex items-center text-xs mt-1 text-red-500">
                <ArrowDown className="h-3 w-3 mr-0.5" />
                {Math.abs(MOCK_OVERVIEW_STATS.highPriorityChange)} (
                {MOCK_OVERVIEW_STATS.highPriorityChange > 0 ? "+" : ""}
                {MOCK_OVERVIEW_STATS.highPriorityChange})
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Breakdown */}
        <div>
          <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Regional Breakdown
          </h4>
          <div className="space-y-2">
            {MOCK_REGIONAL_DATA.map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{region.region}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">{region.count}</span>
                  <span
                    className={`text-xs ${
                      region.change > 0
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    ({region.change > 0 ? "+" : ""}
                    {region.change})
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full text-center text-xs text-primary mt-3 hover:underline">
            View All Regions
          </button>
        </div>

        {/* Incident Type Distribution */}
        <div>
          <h4 className="font-medium text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            Incident Type Distribution
          </h4>
          <div className="space-y-4">
            {MOCK_TYPE_DISTRIBUTION.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium">{item.type}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
