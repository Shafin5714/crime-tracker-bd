import { z } from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  district: z.string().optional().default("Dhaka"),
  division: z.string().optional().default("Dhaka"),
});

export const updateAreaSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  district: z.string().optional(),
  division: z.string().optional(),
});

export type CreateAreaInput = z.infer<typeof createAreaSchema>;
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
