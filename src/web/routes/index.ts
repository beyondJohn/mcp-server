import type { Express } from "express";

import type { WebDependencies } from "./web-dependencies.js";
import { registerHealthRoutes } from "./health.routes.js";
import { registerOAuthRoutes } from "./oauth.routes.js";
import { registerRootRoutes } from "./root.routes.js";

export function registerRoutes(
  app: Express,
  dependencies: WebDependencies
): void {
  registerRootRoutes(app);
  registerHealthRoutes(app);
  registerOAuthRoutes(app, dependencies);
}