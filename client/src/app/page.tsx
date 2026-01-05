"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  MapPin,
  FileWarning,
  Search,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

// Dynamically import CrimeMap to avoid SSR issues with Leaflet
const CrimeMap = dynamic(() => import("@/components/map/CrimeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-3 w-48 mx-auto" />
      </div>
    </div>
  ),
});

// Placeholder stats - will be replaced with real data from API
const stats = [
  {
    title: "Total Reports",
    value: "1,247",
    description: "Crime reports submitted",
    icon: FileWarning,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Verified",
    value: "892",
    description: "Reports verified by community",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Pending Review",
    value: "156",
    description: "Awaiting moderation",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Active Alerts",
    value: "23",
    description: "Critical incidents nearby",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const features = [
  {
    title: "Interactive Crime Map",
    description:
      "View crime incidents on a real-time interactive map with clustering and heatmap visualizations.",
    icon: MapPin,
    href: "#map",
  },
  {
    title: "Report Incidents",
    description:
      "Submit crime reports quickly and easily. Choose to report anonymously for sensitive cases.",
    icon: FileWarning,
    href: "/report",
  },
  {
    title: "Location Search",
    description:
      "Search crime data by location, type, severity, and date range to stay informed about your area.",
    icon: Search,
    href: "/search",
  },
  {
    title: "Community Verified",
    description:
      "Reports are verified by community members and moderators to ensure accuracy and trust.",
    icon: Users,
    href: "/search",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Embedded Map */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            {/* Badge */}
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Shield className="mr-2 size-4 text-primary" />
              Community Safety Platform
            </Badge>

            {/* Heading */}
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Making Bangladesh{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Safer Together
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Report, track, and stay informed about crime in your area. Explore
              the live crime map below.
            </p>
          </div>
        </div>
      </section>

      {/* Main Map Section */}
      <section id="map" className="relative flex-1">
        <div className="h-[60vh] min-h-[500px] w-full">
          <CrimeMap showFilters={true} className="h-full w-full" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`size-4 ${stat.color}`} />
                    </div>
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
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
              How Crime Tracker BD Works
            </h2>
            <p className="text-muted-foreground">
              A community-driven platform designed to keep you informed and
              safe.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Learn more
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="flex flex-col items-center justify-between gap-6 p-8 md:flex-row">
              <div>
                <h3 className="mb-2 text-xl font-bold md:text-2xl">
                  Help Make Your Community Safer
                </h3>
                <p className="text-primary-foreground/80 max-w-xl text-sm md:text-base">
                  Every report matters. Join thousands of citizens contributing
                  to a safer Bangladesh by reporting and verifying crime
                  incidents.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/report">Report a Crime</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <span className="font-semibold">Crime Tracker BD</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Crime Tracker BD. Building safer
              communities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
