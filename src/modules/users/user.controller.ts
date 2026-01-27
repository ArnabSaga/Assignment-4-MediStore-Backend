import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const result = await UserService.getUserById(userId!);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const result = await UserService.updateUserProfile(userId!, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, isBanned } = req.query;

    const result = await UserService.getAllUsers(
      role as string | undefined,
      isBanned === "true"
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    const result = await UserService.getUserById(id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { isBanned } = req.body;

    const result = await UserService.updateUserStatus(id, isBanned);

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;

    const result = await UserService.changeUserRole(id, role);

    res.status(200).json({
      success: true,
      message: "User role changed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const currentUserId = req.user?.id;

    await UserService.deleteUser(id, currentUserId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getCurrentUser,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserStatus,
  changeRole,
  deleteUser,
};
