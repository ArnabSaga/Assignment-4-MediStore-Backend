import { NextFunction, Request, Response } from "express";

import { MedicineService } from "./medicine.service";

import { generateSlug } from "../../helpers/generateSlug";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;
    const { name, price, stock, manufacturer, categoryId, slug, ...rest } =
      req.body;

    if (
      !name ||
      !price ||
      stock === undefined ||
      !manufacturer ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, price, stock, manufacturer, categoryId",
      });
    }

    if (price <= 0 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be positive and stock must be non-negative",
      });
    }

    const result = await MedicineService.createMedicine({
      name,
      price,
      stock,
      manufacturer,
      categoryId,
      slug: slug || generateSlug(name),
      ...rest,
      sellerId: sellerId!,
    });

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, search, minPrice, maxPrice, manufacturer } = req.query;

    const filters: any = {};

    if (categoryId) filters.categoryId = String(categoryId);
    if (search) filters.search = String(search);
    if (manufacturer) filters.manufacturer = String(manufacturer);

    if (minPrice !== undefined) filters.minPrice = parseFloat(String(minPrice));
    if (maxPrice !== undefined) filters.maxPrice = parseFloat(String(maxPrice));

    const result = await MedicineService.getAllMedicines(filters);

    res.status(200).json({
      success: true,
      message: "Medicines fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);

    const result = await MedicineService.getMedicineById(id);

    res.status(200).json({
      success: true,
      message: "Medicine fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { id: userId, role } = req.user!;
    const { name, slug, ...rest } = req.body;

    const result = await MedicineService.updateMedicine(
      id,
      {
        name,
        slug: slug || (name ? generateSlug(name) : undefined),
        ...rest,
      },
      userId!,
      role!
    );

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { id: userId, role } = req.user!;

    await MedicineService.deleteMedicine(id, userId!, role!);

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getSellerMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;

    const result = await MedicineService.getSellerMedicines(sellerId!);

    res.status(200).json({
      success: true,
      message: "Seller medicines fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const MedicineController = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getSellerMedicines,
};
