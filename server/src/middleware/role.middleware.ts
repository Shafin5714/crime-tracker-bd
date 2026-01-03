import { Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { ForbiddenError } from "../utils/errors";
import { AuthRequest } from "../controllers/auth.controller";

// Role hierarchy - higher number = more permissions
const roleHierarchy: Record<UserRole, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export const requireRole = (minRole: UserRole) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenError("Not authenticated");
      }

      const userRoleLevel = roleHierarchy[req.user.role as UserRole];
      const requiredRoleLevel = roleHierarchy[minRole];

      if (userRoleLevel < requiredRoleLevel) {
        throw new ForbiddenError(`Requires ${minRole} role or higher`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
