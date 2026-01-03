// ==========================================
// Shared Types for Crime Tracker BD
// ==========================================

// User & Authentication
export type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Crime Reports
export type CrimeType =
  | "ROBBERY"
  | "HIJACKING"
  | "HARASSMENT"
  | "THEFT"
  | "ASSAULT"
  | "VANDALISM"
  | "MURDER"
  | "KIDNAPPING"
  | "FRAUD"
  | "OTHER";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ReportStatus =
  | "UNVERIFIED"
  | "VERIFIED"
  | "DISPUTED"
  | "HIDDEN"
  | "REMOVED";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface CrimeReport {
  id: string;
  crimeType: CrimeType;
  description: string;
  severity: Severity;
  latitude: number;
  longitude: number;
  address: string;
  division?: string;
  district?: string;
  occurredAt: string;
  status: ReportStatus;
  verificationCount: number;
  denialCount: number;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CreateCrimeReportInput {
  crimeType: CrimeType;
  description: string;
  severity: Severity;
  latitude: number;
  longitude: number;
  address: string;
  division?: string;
  district?: string;
  occurredAt: string;
  isAnonymous?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Geospatial Query Types
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RadiusQuery {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

// Heatmap Data
export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
}
