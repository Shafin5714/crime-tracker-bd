import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileWarning, Users, AlertTriangle, TrendingUp } from "lucide-react";

// Placeholder stats - will be replaced with real data
const stats = [
  {
    title: "Total Reports",
    value: "1,234",
    description: "+12% from last month",
    icon: FileWarning,
    trend: "up",
  },
  {
    title: "Pending Moderation",
    value: "23",
    description: "5 urgent",
    icon: AlertTriangle,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "892",
    description: "+3% from last week",
    icon: Users,
    trend: "up",
  },
  {
    title: "Reports This Week",
    value: "56",
    description: "-8% from last week",
    icon: TrendingUp,
    trend: "down",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of crime reports and platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest crime reports awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Report list will be displayed here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crime Trends</CardTitle>
            <CardDescription>Weekly crime statistics by type</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
