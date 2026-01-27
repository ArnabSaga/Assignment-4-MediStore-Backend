import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth.middleware";
import { CategoryController } from "./category.controller";

const router = express.Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Admin routes
router.post(
  "/",
  auth({ roles: [UserRole.ADMIN] }),
  CategoryController.createCategory
);

router.put(
  "/:id",
  auth({ roles: [UserRole.ADMIN] }),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth({ roles: [UserRole.ADMIN] }),
  CategoryController.deleteCategory
);

export const CategoryRouter: Router = router;
