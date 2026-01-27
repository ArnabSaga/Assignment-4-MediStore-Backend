import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth.middleware";
import { UserController } from "./user.controller";

const router = express.Router();

// Customer and Seller routes
router.get(
  "/me",
  auth({
    roles: [UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN],
    requireVerifiedEmail: true,
  }),
  UserController.getCurrentUser
);

router.put(
  "/profile",
  auth({
    roles: [UserRole.CUSTOMER, UserRole.SELLER],
    requireVerifiedEmail: true,
  }),
  UserController.updateUserProfile
);

// Admin routes
router.get("/", auth({ roles: [UserRole.ADMIN] }), UserController.getAllUsers);

router.get(
  "/:id",
  auth({ roles: [UserRole.ADMIN] }),
  UserController.getUserById
);

router.patch(
  "/:id/status",
  auth({ roles: [UserRole.ADMIN] }),
  UserController.updateUserStatus
);

router.patch(
  "/:id/role",
  auth({ roles: [UserRole.ADMIN] }),
  UserController.changeRole
);

router.delete(
  "/:id",
  auth({ roles: [UserRole.ADMIN] }),
  UserController.deleteUser
);

export const UserRouter: Router = router;
