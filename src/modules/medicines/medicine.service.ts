// 1. Correct import using your path mapping or alias
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Using Prisma.Decimal ensures compatibility with your generated client
interface CreateMedicinePayload {
  name: string;
  slug: string;
  description?: string | null;
  price: number | Prisma.Decimal;
  stock: number;
  manufacturer: string;
  categoryId: string;
  imageUrl?: string | null;
  sellerId: string;
}

interface UpdateMedicinePayload {
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number | Prisma.Decimal;
  stock?: number;
  manufacturer?: string;
  categoryId?: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

interface GetMedicinesFilter {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
}

const createMedicine = async (payload: CreateMedicinePayload) => {
  const cleanData = {
    ...payload,
    description: payload.description ?? null,
    imageUrl: payload.imageUrl ?? null,
    // Ensure price is handled as a Decimal if it's passed as a number
    price: new Prisma.Decimal(payload.price.toString()),
  };

  const result = await prisma.medicine.create({
    data: cleanData,
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getAllMedicines = async (filters: GetMedicinesFilter) => {
  const where: any = { isActive: true };

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { manufacturer: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.manufacturer) {
    where.manufacturer = {
      contains: filters.manufacturer,
      mode: "insensitive",
    };
  }

  return await prisma.medicine.findMany({
    where,
    include: {
      category: true,
      seller: { select: { id: true, name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getMedicineById = async (id: string) => {
  return await prisma.medicine.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true, phone: true } },
      reviews: {
        include: {
          customer: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
};

const updateMedicine = async (
  id: string,
  payload: UpdateMedicinePayload,
  userId: string,
  role: string
) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });

  if (role !== "ADMIN" && medicine.sellerId !== userId) {
    const error = new Error("Unauthorized to update this medicine") as any;
    error.name = "ForbiddenError";
    error.statusCode = 403;
    throw error;
  }

  const cleanData: any = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "price") {
        cleanData[key] = new Prisma.Decimal(value!.toString());
      } else {
        cleanData[key] = value ?? null;
      }
    }
  });

  return await prisma.medicine.update({
    where: { id },
    data: cleanData,
    include: {
      category: true,
      seller: { select: { id: true, name: true } },
    },
  });
};

const deleteMedicine = async (id: string, userId: string, role: string) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: { id },
  });

  if (role !== "ADMIN" && medicine.sellerId !== userId) {
    const error = new Error("Unauthorized to delete this medicine") as any;
    error.name = "ForbiddenError";
    error.statusCode = 403;
    throw error;
  }

  await prisma.medicine.delete({ where: { id } });
};

const getSellerMedicines = async (sellerId: string) => {
  return await prisma.medicine.findMany({
    where: { sellerId },
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const MedicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getSellerMedicines,
};
