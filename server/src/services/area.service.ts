import { prisma } from "../utils/prisma";
import { CreateAreaInput, UpdateAreaInput } from "../schemas/area.schema";
import { NotFoundError } from "../utils/errors";

export const getAllAreas = async () => {
  return prisma.area.findMany({
    orderBy: { name: "asc" },
  });
};

export const getAreaById = async (id: string) => {
  const area = await prisma.area.findUnique({
    where: { id },
  });

  if (!area) {
    throw new NotFoundError("Area not found");
  }

  return area;
};

export const createArea = async (data: CreateAreaInput) => {
  return prisma.area.create({
    data,
  });
};

export const updateArea = async (id: string, data: UpdateAreaInput) => {
  const existing = await prisma.area.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Area not found");
  }

  return prisma.area.update({
    where: { id },
    data,
  });
};

export const deleteArea = async (id: string) => {
  const existing = await prisma.area.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Area not found");
  }

  await prisma.area.delete({ where: { id } });
  return { message: "Area deleted successfully" };
};

export const findAreaByName = async (name: string) => {
  return prisma.area.findFirst({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });
};
