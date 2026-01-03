import { Router } from "express";
import * as crimeController from "../controllers/crime.controller";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCrimeSchema, updateCrimeSchema, validateCrimeSchema } from "../schemas/crime.schema";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CrimeReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         crimeType:
 *           type: string
 *           enum: [ROBBERY, HIJACKING, HARASSMENT, THEFT, ASSAULT, VANDALISM, MURDER, KIDNAPPING, FRAUD, OTHER]
 *         description:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         address:
 *           type: string
 *         division:
 *           type: string
 *         district:
 *           type: string
 *         occurredAt:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [UNVERIFIED, VERIFIED, DISPUTED, HIDDEN, REMOVED]
 *         verificationCount:
 *           type: integer
 *         denialCount:
 *           type: integer
 *         isAnonymous:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateCrimeInput:
 *       type: object
 *       required:
 *         - crimeType
 *         - description
 *         - severity
 *         - latitude
 *         - longitude
 *         - address
 *         - occurredAt
 *       properties:
 *         crimeType:
 *           type: string
 *           enum: [ROBBERY, HIJACKING, HARASSMENT, THEFT, ASSAULT, VANDALISM, MURDER, KIDNAPPING, FRAUD, OTHER]
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *         severity:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         latitude:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         longitude:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         address:
 *           type: string
 *         division:
 *           type: string
 *         district:
 *           type: string
 *         occurredAt:
 *           type: string
 *           format: date-time
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *     ValidateCrimeInput:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [CONFIRM, DENY]
 *         comment:
 *           type: string
 *           maxLength: 500
 */

/**
 * @swagger
 * /api/crimes:
 *   post:
 *     summary: Submit a new crime report
 *     tags: [Crimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCrimeInput'
 *     responses:
 *       201:
 *         description: Crime report created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (for non-anonymous reports)
 */
router.post("/", optionalAuth, validate(createCrimeSchema), crimeController.create);

/**
 * @swagger
 * /api/crimes:
 *   get:
 *     summary: List crime reports with filters
 *     tags: [Crimes]
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
 *         name: crimeType
 *         schema:
 *           type: string
 *           enum: [ROBBERY, HIJACKING, HARASSMENT, THEFT, ASSAULT, VANDALISM, MURDER, KIDNAPPING, FRAUD, OTHER]
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [UNVERIFIED, VERIFIED, DISPUTED, HIDDEN, REMOVED]
 *       - in: query
 *         name: division
 *         schema:
 *           type: string
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: minLat
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxLat
 *         schema:
 *           type: number
 *       - in: query
 *         name: minLng
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxLng
 *         schema:
 *           type: number
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Center latitude for radius search
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Center longitude for radius search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Radius in kilometers
 *     responses:
 *       200:
 *         description: List of crime reports with pagination
 */
router.get("/", crimeController.list);

/**
 * @swagger
 * /api/crimes/heatmap:
 *   get:
 *     summary: Get heatmap data for crime visualization
 *     tags: [Crimes]
 *     parameters:
 *       - in: query
 *         name: crimeType
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: division
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Heatmap data points with intensity values
 */
router.get("/heatmap", crimeController.heatmap);

/**
 * @swagger
 * /api/crimes/stats:
 *   get:
 *     summary: Get crime statistics
 *     tags: [Crimes]
 *     parameters:
 *       - in: query
 *         name: division
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crime statistics by type, severity, and status
 */
router.get("/stats", crimeController.stats);

/**
 * @swagger
 * /api/crimes/{id}:
 *   get:
 *     summary: Get a crime report by ID
 *     tags: [Crimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crime report details
 *       404:
 *         description: Crime report not found
 */
router.get("/:id", crimeController.getById);

/**
 * @swagger
 * /api/crimes/{id}:
 *   put:
 *     summary: Update a crime report (MODERATOR+)
 *     tags: [Crimes]
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
 *             type: object
 *             properties:
 *               crimeType:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crime report updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires MODERATOR role
 *       404:
 *         description: Crime report not found
 */
router.put(
  "/:id",
  requireAuth,
  requireRole("MODERATOR"),
  validate(updateCrimeSchema),
  crimeController.update
);

/**
 * @swagger
 * /api/crimes/{id}:
 *   delete:
 *     summary: Delete a crime report (ADMIN+)
 *     tags: [Crimes]
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
 *         description: Crime report deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires ADMIN role
 *       404:
 *         description: Crime report not found
 */
router.delete("/:id", requireAuth, requireRole("ADMIN"), crimeController.remove);

/**
 * @swagger
 * /api/crimes/{id}/validate:
 *   post:
 *     summary: Confirm or deny a crime report
 *     tags: [Crimes]
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
 *             $ref: '#/components/schemas/ValidateCrimeInput'
 *     responses:
 *       200:
 *         description: Validation recorded
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Cannot validate own report
 *       404:
 *         description: Crime report not found
 *       409:
 *         description: Already validated this report
 */
router.post(
  "/:id/validate",
  requireAuth,
  validate(validateCrimeSchema),
  crimeController.validate
);

export default router;
