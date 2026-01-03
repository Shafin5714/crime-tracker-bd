import { z } from "zod";

// Schema for updating user role
export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

// Schema for user list query parameters (not used with validate middleware, just for type inference)
export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]).optional(),
  search: z.string().optional(),
  isBanned: z.enum(["true", "false"]).optional().transform((val) => 
    val === "true" ? true : val === "false" ? false : undefined
  ),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;

