import express, { Application, Request, Response } from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth";

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

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
