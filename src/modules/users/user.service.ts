import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma";

interface UpdateUserProfilePayload {
  name?: string | undefined;
  phone?: string | undefined;
  image?: string | undefined;
}

const getUserById = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      phone: true,
      image: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  });
  return result;
};

const updateUserProfile = async (
  id: string,
  payload: UpdateUserProfilePayload
) => {
  // Clean up undefined values
  const cleanData: any = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  });

  if (Object.keys(cleanData).length === 0) {
    throw Object.assign(new Error("No fields to update"), { statusCode: 400 });
  }

  const result = await prisma.user.update({
    where: { id },
    data: cleanData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
  return result;
};

const getAllUsers = async (
  role?: string | undefined,
  isBanned?: boolean | undefined
) => {
  const where: any = {};

  if (role) {
    const validRoles = ["CUSTOMER", "SELLER", "ADMIN"];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }
    where.role = role;
  }

  if (isBanned !== undefined) {
    where.isBanned = isBanned;
  }

  const result = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
    },
  });
  return result;
};

const changeUserRole = async (id: string, role: string) => {
  const validRoles = ["CUSTOMER", "SELLER", "ADMIN"];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  const result = await prisma.user.update({
    where: { id },
    data: { role: role as Role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return result;
};

const deleteUser = async (id: string, currentUserId?: string) => {
  if (currentUserId && id === currentUserId) {
    throw Object.assign(new Error("Cannot delete your own account"), {
      statusCode: 403,
    });
  }

  await prisma.user.delete({
    where: { id },
  });
};

export const UserService = {
  getUserById,
  updateUserProfile,
  getAllUsers,
  updateUserStatus,
  changeUserRole,
  deleteUser,
};
