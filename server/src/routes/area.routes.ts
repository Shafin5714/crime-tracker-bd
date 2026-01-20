import { Router } from "express";
import * as areaController from "../controllers/area.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", areaController.list);
router.get("/search", areaController.search);
router.get("/:id", areaController.getById);

// Admin only routes
router.use(requireAuth, requireRole(UserRole.ADMIN));

router.post("/", areaController.create);
router.put("/:id", areaController.update);
router.delete("/:id", areaController.remove);

export default router;
