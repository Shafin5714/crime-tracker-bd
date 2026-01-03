import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth.service";
import { UnauthorizedError } from "../utils/errors";
import { AuthRequest } from "../controllers/auth.controller";

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
