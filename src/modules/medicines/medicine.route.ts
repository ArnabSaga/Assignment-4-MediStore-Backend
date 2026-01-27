import express, { Router } from "express";

import auth, { UserRole } from "../../middleware/auth.middleware";
import { MedicineController } from "./medicine.controller";

const router = express.Router();

// Public routes
router.get("/", MedicineController.getAllMedicines);
router.get("/:id", MedicineController.getMedicineById);

// Seller routes
router.post(
  "/",
  auth({ roles: [UserRole.SELLER], requireVerifiedEmail: true }),
  MedicineController.createMedicine
);

router.get(
  "/seller/medicines",
  auth({ roles: [UserRole.SELLER] }),
  MedicineController.getSellerMedicines
);

router.put(
  "/:id",
  auth({ roles: [UserRole.SELLER, UserRole.ADMIN] }),
  MedicineController.updateMedicine
);

router.delete(
  "/:id",
  auth({ roles: [UserRole.SELLER, UserRole.ADMIN] }),
  MedicineController.deleteMedicine
);

export const MedicineRouter: Router = router;
