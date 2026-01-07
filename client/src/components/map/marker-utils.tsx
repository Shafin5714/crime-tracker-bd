import { CrimeType, Severity } from "@/types/api.types";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AlertTriangle,
  Car,
  CircleDollarSign,
  Gavel,
  Hand,
  HelpCircle,
  Home,
  ShieldAlert,
  Skull,
  LucideIcon,
  SprayCan,
  HeartCrack,
  UserMinus,
  FileWarning,
  Laptop2,
  Pill,
  MessageSquareWarning,
} from "lucide-react";

// Severity color mapping - using gradients for premium feel
export const SEVERITY_COLORS: Record<
  Severity,
  { primary: string; light: string; dark: string }
> = {
  LOW: { primary: "#22c55e", light: "#4ade80", dark: "#16a34a" }, // green
  MEDIUM: { primary: "#eab308", light: "#facc15", dark: "#ca8a04" }, // yellow
  HIGH: { primary: "#f97316", light: "#fb923c", dark: "#ea580c" }, // orange
  CRITICAL: { primary: "#ef4444", light: "#f87171", dark: "#dc2626" }, // red
};

// Crime Type to Icon mapping
const CRIME_ICONS: Record<CrimeType, LucideIcon> = {
  [CrimeType.THEFT]: Hand,
  [CrimeType.ROBBERY]: CircleDollarSign,
  [CrimeType.ASSAULT]: Gavel,
  [CrimeType.MURDER]: Skull,
  [CrimeType.KIDNAPPING]: UserMinus,
  [CrimeType.FRAUD]: FileWarning,
  [CrimeType.CYBERCRIME]: Laptop2,
  [CrimeType.DRUG_RELATED]: Pill,
  [CrimeType.VANDALISM]: SprayCan,
  [CrimeType.HARASSMENT]: MessageSquareWarning,
  [CrimeType.DOMESTIC_VIOLENCE]: HeartCrack,
  [CrimeType.SEXUAL_ASSAULT]: ShieldAlert,
  [CrimeType.BURGLARY]: Home,
  [CrimeType.VEHICLE_THEFT]: Car,
  [CrimeType.OTHER]: HelpCircle,
};

// Fallback for missing icons
const DefaultIcon = AlertTriangle;

export function getMarkerHtml(type: CrimeType, severity: Severity): string {
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.MEDIUM;
  const IconComponent = CRIME_ICONS[type] || DefaultIcon;

  // Render icon to string
  const iconSvg = renderToStaticMarkup(
    <IconComponent size={20} color={colors.dark} strokeWidth={2.5} />
  );

  const uniqueId = `grad-${severity}-${type}`;

  return `
    <div class="custom-pin-marker" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
      <svg width="48" height="58" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${uniqueId}" x1="24" y1="0" x2="24" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${colors.light}" />
            <stop offset="50%" stop-color="${colors.primary}" />
            <stop offset="100%" stop-color="${colors.dark}" />
          </linearGradient>
        </defs>
        <!-- Pin Shape -->
        <path 
          d="M24 0C10.7452 0 0 10.7452 0 24C0 37.2548 24 58 24 58C24 58 48 37.2548 48 24C48 10.7452 37.2548 0 24 0Z" 
          fill="url(#${uniqueId})" 
          stroke="white" 
          stroke-width="2"
        />
        <!-- Inner Circle Background -->
        <circle cx="24" cy="24" r="14" fill="white" />
        <!-- Icon Container -->
        <foreignObject x="14" y="14" width="20" height="20">
          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            ${iconSvg}
          </div>
        </foreignObject>
      </svg>
    </div>
  `;
}
