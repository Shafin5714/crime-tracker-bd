import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateUserRoleSchema } from "../schemas/user.schema";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, MODERATOR, ADMIN, SUPER_ADMIN]
 *         isVerified:
 *           type: boolean
 *         isBanned:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserWithStats:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             _count:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: integer
 *                 validations:
 *                   type: integer
 *     UpdateRoleInput:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [USER, MODERATOR, ADMIN, SUPER_ADMIN]
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (ADMIN+)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, MODERATOR, ADMIN, SUPER_ADMIN]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email or name
 *       - in: query
 *         name: isBanned
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *     responses:
 *       200:
 *         description: List of users with pagination
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role
 */
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  userController.listUsers
);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics (ADMIN+)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     roleDistribution:
 *                       type: object
 *                     bannedCount:
 *                       type: integer
 *                     verifiedCount:
 *                       type: integer
 *                     unverifiedCount:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role
 */
router.get(
  "/stats",
  requireAuth,
  requireRole("ADMIN"),
  userController.getUserStats
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (ADMIN+)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  userController.getUserById
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role (SUPER_ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleInput'
 *     responses:
 *       200:
 *         description: User role updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires SUPER_ADMIN role or permission denied
 *       404:
 *         description: User not found
 */
router.put(
  "/:id/role",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  validate(updateUserRoleSchema),
  userController.updateUserRole
);

/**
 * @swagger
 * /api/users/{id}/ban:
 *   post:
 *     summary: Ban a user (ADMIN+)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role or permission denied
 *       404:
 *         description: User not found
 */
router.post(
  "/:id/ban",
  requireAuth,
  requireRole("ADMIN"),
  userController.banUser
);

/**
 * @swagger
 * /api/users/{id}/unban:
 *   post:
 *     summary: Unban a user (ADMIN+)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role or permission denied
 *       404:
 *         description: User not found
 */
router.post(
  "/:id/unban",
  requireAuth,
  requireRole("ADMIN"),
  userController.unbanUser
);

export default router;
