import { Request, Response, NextFunction } from "express";
import * as areaService from "../services/area.service";
import { createAreaSchema, updateAreaSchema } from "../schemas/area.schema";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const areas = await areaService.getAllAreas();
    res.json({ data: areas });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const area = await areaService.getAreaById(id);
    res.json({ data: area });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createAreaSchema.parse(req.body);
    const area = await areaService.createArea(data);
    res.status(201).json({
      message: "Area created successfully",
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateAreaSchema.parse(req.body);
    const area = await areaService.updateArea(id, data);
    res.json({
      message: "Area updated successfully",
      data: area,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await areaService.deleteArea(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ data: null });
    }
    const area = await areaService.findAreaByName(q as string);
    res.json({ data: area });
  } catch (error) {
    next(error);
  }
};
