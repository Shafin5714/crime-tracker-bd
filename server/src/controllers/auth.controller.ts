import { Request, Response, NextFunction } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
} from "../services/auth.service";
import { RegisterInput, LoginInput, RefreshTokenInput } from "../schemas/auth.schema";
import { UnauthorizedError } from "../utils/errors";

// Extended request type with user info
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as RegisterInput;
    const user = await createUser(data);
    const tokens = generateTokens(user.id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginInput;
    const user = await findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.isBanned) {
      throw new UnauthorizedError("Your account has been banned");
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokens = generateTokens(user.id, user.role);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal)
export const logout = async (_req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};

// Refresh access token
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    const payload = verifyRefreshToken(refreshToken);

    const user = await findUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.isBanned) {
      throw new UnauthorizedError("Your account has been banned");
    }

    const tokens = generateTokens(user.id, user.role);

    res.json({
      message: "Token refreshed successfully",
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("Not authenticated");
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
