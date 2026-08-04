import express, { type Express } from "express";

import type { WebDependencies } from "./routes/web-dependencies.js";
import { registerRoutes } from "./routes/index.js";

export function createWebApp(
  dependencies: WebDependencies
): Express {
  const app = express();

  app.use(express.json());

  registerRoutes(app, dependencies);

  return app;
}