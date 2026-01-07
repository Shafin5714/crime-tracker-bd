"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ExternalLink,
  User,
  Shield,
} from "lucide-react";
import type { CrimeReport, Severity, ReportStatus } from "@/types/api.types";

// Severity styling
const SEVERITY_STYLES: Record<
  Severity,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  LOW: { label: "Low", variant: "secondary" },
  MEDIUM: { label: "Medium", variant: "default" },
  HIGH: { label: "High", variant: "destructive" },
  CRITICAL: { label: "Critical", variant: "destructive" },
};

// Status styling
const STATUS_STYLES: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  UNVERIFIED: {
    label: "Unverified",
    className: "bg-yellow-100 text-yellow-800",
  },
  VERIFIED: { label: "Verified", className: "bg-green-100 text-green-800" },
  DISPUTED: { label: "Disputed", className: "bg-orange-100 text-orange-800" },
  HIDDEN: { label: "Hidden", className: "bg-gray-100 text-gray-800" },
  REMOVED: { label: "Removed", className: "bg-red-100 text-red-800" },
};

// Crime type labels
const CRIME_TYPE_LABELS: Record<string, string> = {
  THEFT: "Theft",
  ROBBERY: "Robbery",
  ASSAULT: "Assault",
  MURDER: "Murder",
  KIDNAPPING: "Kidnapping",
  FRAUD: "Fraud",
  CYBERCRIME: "Cybercrime",
  DRUG_RELATED: "Drug Related",
  VANDALISM: "Vandalism",
  HARASSMENT: "Harassment",
  DOMESTIC_VIOLENCE: "Domestic Violence",
  SEXUAL_ASSAULT: "Sexual Assault",
  BURGLARY: "Burglary",
  VEHICLE_THEFT: "Vehicle Theft",
  OTHER: "Other",
};

interface CrimePopupProps {
  crime: CrimeReport;
}

export default function CrimePopup({ crime }: CrimePopupProps) {
  const severityStyle = SEVERITY_STYLES[crime.severity];
  const statusStyle = STATUS_STYLES[crime.status];
  const crimeTypeLabel = CRIME_TYPE_LABELS[crime.crimeType] || crime.crimeType;

  return (
    <div className="min-w-[220px] max-w-[280px] p-4 bg-card text-card-foreground">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-tight">
          {crimeTypeLabel}
        </h3>
        <Badge variant={severityStyle.variant} className="text-xs shrink-0">
          {severityStyle.label}
        </Badge>
      </div>

      {/* Status Badge */}
      <div className="mb-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.className}`}
        >
          {crime.status === "VERIFIED" && <Shield className="h-3 w-3 mr-1" />}
          {statusStyle.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
        {crime.description}
      </p>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
        {/* Location */}
        <div className="flex items-start gap-1.5">
          <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{crime.address}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>
            {format(new Date(crime.occurredAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        {/* Reporter */}
        {!crime.isAnonymous && crime.reporter && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 shrink-0" />
            <span>{crime.reporter.name || "Anonymous"}</span>
          </div>
        )}
        {crime.isAnonymous && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 shrink-0" />
            <span className="italic">Anonymous report</span>
          </div>
        )}
      </div>

      {/* Validation counts */}
      {(crime.confirmations !== undefined || crime.denials !== undefined) && (
        <div className="flex items-center gap-2 text-xs mb-3">
          <span className="text-green-600">
            ✓ {crime.confirmations || 0} confirmed
          </span>
          <span className="text-red-600">✗ {crime.denials || 0} denied</span>
        </div>
      )}

      {/* View Details Link */}
      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
        <Link href={`/crimes/${crime.id}`}>
          <ExternalLink className="h-3 w-3 mr-1" />
          View Full Details
        </Link>
      </Button>
    </div>
  );
}
