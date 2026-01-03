import { Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { AuthRequest } from "./auth.controller";
import * as userService from "../services/user.service";
import { UpdateUserRoleInput, UserQueryInput } from "../schemas/user.schema";
import { ForbiddenError } from "../utils/errors";

/**
 * List all users with pagination and filters
 * Requires ADMIN+ role
 */
export const listUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      page,
      limit,
      role,
      search,
      isBanned,
    } = req.query;

    const result = await userService.listUsers({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      role: role as UserRole | undefined,
      search: search as string | undefined,
      isBanned: isBanned === "true" ? true : isBanned === "false" ? false : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * Requires ADMIN+ role
 */
export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 * Requires SUPER_ADMIN role only
 */
export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ForbiddenError("Not authenticated");
    }

    const { id } = req.params;
    const { role: newRole } = req.body as UpdateUserRoleInput;

    const user = await userService.updateUserRole(
      req.user.userId,
      req.user.role as UserRole,
      id,
      newRole
    );

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ban a user
 * Requires ADMIN+ role
 */
export const banUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ForbiddenError("Not authenticated");
    }

    const { id } = req.params;

    const user = await userService.banUser(
      req.user.userId,
      req.user.role as UserRole,
      id
    );

    res.json({
      message: "User banned successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unban a user
 * Requires ADMIN+ role
 */
export const unbanUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ForbiddenError("Not authenticated");
    }

    const { id } = req.params;

    const user = await userService.unbanUser(
      req.user.userId,
      req.user.role as UserRole,
      id
    );

    res.json({
      message: "User unbanned successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user statistics
 * Requires ADMIN+ role
 */
export const getUserStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await userService.getUserStats();

    res.json({ stats });
  } catch (error) {
    next(error);
  }
};
