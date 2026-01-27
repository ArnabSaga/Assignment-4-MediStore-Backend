import express, { Application, Request, Response } from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth";

// Route imports
import { UserRouter } from "./modules/users/user.route";
import { CategoryRouter } from "./modules/categories/category.route";

import { notFound } from "./middleware/NotFound";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

// Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// API Routes
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/categories", CategoryRouter);

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World To Medi Store");
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
