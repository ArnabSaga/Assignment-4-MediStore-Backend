import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node"; 
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        emailVerified: boolean;
        isBanned: boolean; // Keep track of ban status
      };
    }
  }
}

interface AuthOptions {
  roles?: UserRole[];
  requireVerifiedEmail?: boolean;
}

const auth = (options: AuthOptions = {}) => {
  const { roles = [], requireVerifiedEmail = false } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use fromNodeHeaders for better compatibility
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      // Check if the user is banned immediately
      if (session.user.isBanned) {
        return res.status(403).json({
          success: false,
          message: "Your account is banned. Access denied.",
        });
      }

      const userRole = session.user.role as UserRole;

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole,
        emailVerified: session.user.emailVerified,
        isBanned: session.user.isBanned,
      };

      if (requireVerifiedEmail && !req.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please check your inbox.",
        });
      }

      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
