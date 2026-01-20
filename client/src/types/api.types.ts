// ============================================================================
// API Types - Frontend type definitions matching backend schemas
// ============================================================================

// -------------------- Enums --------------------
export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum CrimeType {
  THEFT = "THEFT",
  ROBBERY = "ROBBERY",
  ASSAULT = "ASSAULT",
  MURDER = "MURDER",
  KIDNAPPING = "KIDNAPPING",
  FRAUD = "FRAUD",
  CYBERCRIME = "CYBERCRIME",
  DRUG_RELATED = "DRUG_RELATED",
  VANDALISM = "VANDALISM",
  HARASSMENT = "HARASSMENT",
  DOMESTIC_VIOLENCE = "DOMESTIC_VIOLENCE",
  SEXUAL_ASSAULT = "SEXUAL_ASSAULT",
  BURGLARY = "BURGLARY",
  VEHICLE_THEFT = "VEHICLE_THEFT",
  OTHER = "OTHER",
}

export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ReportStatus {
  UNVERIFIED = "UNVERIFIED",
  VERIFIED = "VERIFIED",
  DISPUTED = "DISPUTED",
  HIDDEN = "HIDDEN",
  REMOVED = "REMOVED",
}

export enum ValidationType {
  CONFIRM = "CONFIRM",
  DENY = "DENY",
}

// -------------------- User Types --------------------
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
  _count?: {
    crimeReports: number;
    validations: number;
  };
}

// -------------------- Auth Types --------------------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// -------------------- Crime Types --------------------
export interface CrimeReport {
  id: string;
  crimeType: CrimeType;
  description: string;
  severity: Severity;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address: string;
  division: string | null;
  district: string | null;
  occurredAt: string;
  isAnonymous: boolean;
  reporterId: string | null;
  createdAt: string;
  updatedAt: string;
  reporter?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  _count?: {
    validations: number;
  };
  confirmations?: number;
  denials?: number;
  media: string[];
}

export interface CreateCrimeRequest {
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
  media?: string[];
}

export interface UpdateCrimeRequest {
  crimeType?: CrimeType;
  description?: string;
  severity?: Severity;
  status?: ReportStatus;
  address?: string;
  division?: string;
  district?: string;
  media?: string[];
}

export interface ValidateCrimeRequest {
  type: ValidationType;
  comment?: string;
}

export interface CrimeFilters {
  // Pagination
  page?: number;
  limit?: number;
  // Filters
  crimeType?: CrimeType;
  severity?: Severity;
  status?: ReportStatus;
  division?: string;
  district?: string;
  // Date range
  startDate?: string;
  endDate?: string;
  // Geospatial - bounding box
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  // Geospatial - radius search
  lat?: number;
  lng?: number;
  radius?: number; // in kilometers
}

export interface HeatmapFilters {
  crimeType?: CrimeType;
  severity?: Severity;
  startDate?: string;
  endDate?: string;
  division?: string;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
}

// -------------------- User Management Types --------------------
export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isBanned?: boolean;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

// -------------------- Area Types --------------------
export interface Area {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  district: string | null;
  division: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAreaRequest {
  name: string;
  latitude: number;
  longitude: number;
  district?: string;
  division?: string;
}

export interface UpdateAreaRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  division?: string;
}

// -------------------- Pagination Types --------------------
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// -------------------- API Error Types --------------------
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

// -------------------- API Success Types --------------------
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
