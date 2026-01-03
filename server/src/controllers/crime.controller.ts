import { Request, Response, NextFunction } from "express";
import {
  createCrimeReport,
  getCrimeReportById,
  listCrimeReports,
  updateCrimeReport,
  deleteCrimeReport,
  validateCrimeReport,
  getHeatmapData,
  getCrimeStats,
} from "../services/crime.service";
import {
  CreateCrimeInput,
  UpdateCrimeInput,
  ValidateCrimeInput,
  listCrimesQuerySchema,
  heatmapQuerySchema,
} from "../schemas/crime.schema";
import { AuthRequest } from "./auth.controller";
import { UnauthorizedError } from "../utils/errors";

// Create a new crime report
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body as CreateCrimeInput;
    const userId = req.user?.userId;

    // Anonymous reports don't require authentication
    if (!data.isAnonymous && !userId) {
      throw new UnauthorizedError("Authentication required for non-anonymous reports");
    }

    const report = await createCrimeReport(data, userId);

    res.status(201).json({
      message: "Crime report submitted successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// Get single crime report
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await getCrimeReportById(id);

    res.json({ data: report });
  } catch (error) {
    next(error);
  }
};

// List crime reports with filters
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listCrimesQuerySchema.parse(req.query);
    const result = await listCrimeReports(query);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Update crime report (MODERATOR+)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateCrimeInput;
    const report = await updateCrimeReport(id, data);

    res.json({
      message: "Crime report updated successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// Delete crime report (ADMIN+)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await deleteCrimeReport(id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Validate (confirm/deny) crime report
export const validate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    const data = req.body as ValidateCrimeInput;
    const result = await validateCrimeReport(id, userId, data);

    res.json({
      message: `Report ${data.type.toLowerCase()}ed successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get heatmap data
export const heatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = heatmapQuerySchema.parse(req.query);
    const data = await getHeatmapData(query);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

// Get crime statistics
export const stats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { division } = req.query;
    const data = await getCrimeStats(division as string | undefined);

    res.json({ data });
  } catch (error) {
    next(error);
  }
};
