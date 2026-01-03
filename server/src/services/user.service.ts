import { UserRole } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { ForbiddenError, NotFoundError } from "../utils/errors";

// Role hierarchy - higher number = more permissions
export const roleHierarchy: Record<UserRole, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

/**
 * Check if a user has permission to perform an action on another user
 * based on role hierarchy
 */
export const hasPermission = (actorRole: UserRole, targetRole: UserRole): boolean => {
  return roleHierarchy[actorRole] > roleHierarchy[targetRole];
};

interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isBanned?: boolean;
}

/**
 * List users with pagination and filtering
 */
export const listUsers = async (params: ListUsersParams) => {
  const { page = 1, limit = 20, role, search, isBanned } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(role && { role }),
    ...(isBanned !== undefined && { isBanned }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: "insensitive" as const } },
        { name: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reports: true,
            validations: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID with detailed information
 */
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          reports: true,
          validations: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

/**
 * Update user role - SUPER_ADMIN only
 * Cannot change own role or promote above own level
 */
export const updateUserRole = async (
  actorId: string,
  actorRole: UserRole,
  targetUserId: string,
  newRole: UserRole
) => {
  // Prevent changing own role
  if (actorId === targetUserId) {
    throw new ForbiddenError("Cannot change your own role");
  }

  // Only SUPER_ADMIN can change roles
  if (actorRole !== UserRole.SUPER_ADMIN) {
    throw new ForbiddenError("Only SUPER_ADMIN can change user roles");
  }

  // Get target user
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // Cannot modify another SUPER_ADMIN
  if (targetUser.role === UserRole.SUPER_ADMIN) {
    throw new ForbiddenError("Cannot modify another SUPER_ADMIN");
  }

  // Update the role
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

/**
 * Ban a user - ADMIN+ only
 * Cannot ban users of equal or higher role
 */
export const banUser = async (
  actorId: string,
  actorRole: UserRole,
  targetUserId: string
) => {
  // Prevent banning self
  if (actorId === targetUserId) {
    throw new ForbiddenError("Cannot ban yourself");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // Check permission hierarchy
  if (!hasPermission(actorRole, targetUser.role)) {
    throw new ForbiddenError("Cannot ban a user with equal or higher role");
  }

  if (targetUser.isBanned) {
    throw new ForbiddenError("User is already banned");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { isBanned: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

/**
 * Unban a user - ADMIN+ only
 */
export const unbanUser = async (
  actorId: string,
  actorRole: UserRole,
  targetUserId: string
) => {
  // Prevent unbanning self (shouldn't be possible anyway)
  if (actorId === targetUserId) {
    throw new ForbiddenError("Cannot unban yourself");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // Check permission hierarchy
  if (!hasPermission(actorRole, targetUser.role)) {
    throw new ForbiddenError("Cannot unban a user with equal or higher role");
  }

  if (!targetUser.isBanned) {
    throw new ForbiddenError("User is not banned");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { isBanned: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

/**
 * Get user statistics for admin dashboard
 */
export const getUserStats = async () => {
  const [totalUsers, roleDistribution, bannedCount, verifiedCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.user.count({ where: { isVerified: true } }),
  ]);

  return {
    totalUsers,
    roleDistribution: roleDistribution.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {} as Record<UserRole, number>),
    bannedCount,
    verifiedCount,
    unverifiedCount: totalUsers - verifiedCount,
  };
};
