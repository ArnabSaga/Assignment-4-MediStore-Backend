import { Category } from "../../../generated/prisma";

import { generateSlug } from '../../helpers/generateSlug';

import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Omit<Category, "id" | "createdAt">) => {
  // Validate required fields
  if (!payload.name || !payload.slug) {
    throw new Error("Category name and slug are required");
  }

  // Check for duplicate slug
  const existing = await prisma.category.findUnique({
    where: { slug: payload.slug },
  });

  if (existing) {
    throw new Error("Category with this slug already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    include: {
      medicines: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: { id },
    include: {
      medicines: {
        where: { isActive: true },
      },
    },
  });
  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<Omit<Category, "id" | "createdAt">>
) => {
  if (payload.name && !payload.slug) {
    payload.slug = generateSlug(payload.name);
  }

  if (payload.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: payload.slug },
    });

    if (existing && existing.id !== id) {
      const error = new Error("Category with this slug already exists") as any;
      error.statusCode = 400;
      throw error;
    }
  }

  const cleanData: any = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleanData[key] = value;
    }
  });

  if (Object.keys(cleanData).length === 0) {
    throw new Error("No fields to update");
  }

  const result = await prisma.category.update({
    where: { id },
    data: cleanData,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  // Check if category has medicines
  const medicinesCount = await prisma.medicine.count({
    where: { categoryId: id },
  });

  if (medicinesCount > 0) {
    throw new Error(
      `Cannot delete category with ${medicinesCount} medicine(s). Please delete medicines first or reassign them to another category.`
    );
  }

  await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
