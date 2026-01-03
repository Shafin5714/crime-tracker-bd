import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import { AuthRequest } from "../controllers/auth.controller";

/**
 * Required authentication middleware - fails if no valid token is present.
 * Use this for routes that absolutely require authentication.
 */
export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware - parses token if present but doesn't fail.
 * Use this for routes that support both authenticated and anonymous users.
 * If a token is provided, req.user will be populated. Otherwise, req.user is undefined.
 */
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // If no auth header, just continue without setting user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        role: payload.role,
      };
    } catch {
      // Token is invalid or expired, but we don't fail - just continue without user
      // This allows anonymous access even with an invalid token
    }

    next();
  } catch (error) {
    next(error);
  }
};
