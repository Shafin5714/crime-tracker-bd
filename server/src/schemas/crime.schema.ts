import { z } from "zod";
import { CrimeType, Severity, ReportStatus, ValidationType } from "@prisma/client";

// Create crime report schema
export const createCrimeSchema = z.object({
  crimeType: z.nativeEnum(CrimeType, {
    errorMap: () => ({ message: "Invalid crime type" }),
  }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  severity: z.nativeEnum(Severity, {
    errorMap: () => ({ message: "Invalid severity level" }),
  }),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  division: z.string().optional(),
  district: z.string().optional(),
  occurredAt: z.string().datetime({ message: "Invalid datetime format" }),
  isAnonymous: z.boolean().optional().default(false),
});

export type CreateCrimeInput = z.infer<typeof createCrimeSchema>;

// Update crime report schema
export const updateCrimeSchema = z.object({
  crimeType: z.nativeEnum(CrimeType).optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters")
    .optional(),
  severity: z.nativeEnum(Severity).optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  address: z.string().min(5).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
});

export type UpdateCrimeInput = z.infer<typeof updateCrimeSchema>;

// Validate crime report schema (confirm/deny)
export const validateCrimeSchema = z.object({
  type: z.nativeEnum(ValidationType, {
    errorMap: () => ({ message: "Type must be CONFIRM or DENY" }),
  }),
  comment: z.string().max(500).optional(),
});

export type ValidateCrimeInput = z.infer<typeof validateCrimeSchema>;

// Query params schema for listing crimes
export const listCrimesQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  
  // Filters
  crimeType: z.nativeEnum(CrimeType).optional(),
  severity: z.nativeEnum(Severity).optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  
  // Date range
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  
  // Geospatial - bounding box
  minLat: z.coerce.number().min(-90).max(90).optional(),
  maxLat: z.coerce.number().min(-90).max(90).optional(),
  minLng: z.coerce.number().min(-180).max(180).optional(),
  maxLng: z.coerce.number().min(-180).max(180).optional(),
  
  // Geospatial - radius search
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().optional(), // in kilometers
});

export type ListCrimesQuery = z.infer<typeof listCrimesQuerySchema>;

// Heatmap query schema
export const heatmapQuerySchema = z.object({
  crimeType: z.nativeEnum(CrimeType).optional(),
  severity: z.nativeEnum(Severity).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  division: z.string().optional(),
});

export type HeatmapQuery = z.infer<typeof heatmapQuerySchema>;
