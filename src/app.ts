import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth";

//* Route imports
import { UserRouter, AdminUserRouter } from "./modules/users/user.route";
import { CategoryRouter } from "./modules/categories/category.route";
import {
  AdminMedicineRouter,
  MedicineRouter,
  SellerMedicineRouter,
} from "./modules/medicines/medicine.route";
import {
  OrderRouter,
  SellerOrderRouter,
  AdminOrderRouter,
} from "./modules/orders/order.route";
import { ReviewRouter } from "./modules/reviews/review.route";

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

//* Auth routes (better-auth)
app.all("/api/auth/*splat", toNodeHandler(auth));

//* API Routes
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/reviews", ReviewRouter);

//* Medicine
app.use("/api/v1/medicines", MedicineRouter);
app.use("/api/v1/seller/medicines", SellerMedicineRouter);
app.use("/api/v1/admin/medicines", AdminMedicineRouter);

//* Orders
app.use("/api/v1/orders", OrderRouter); //* Customer
app.use("/api/v1/seller/orders", SellerOrderRouter); //* Seller
app.use("/api/v1/admin/orders", AdminOrderRouter); //* Admin

//* Admin routes
app.use("/api/v1/admin/users", AdminUserRouter);

//* Home route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World To Medi Store");
});

//* 404 handler
app.use(notFound);

//* Global error handler
app.use(globalErrorHandler);

export default app;
