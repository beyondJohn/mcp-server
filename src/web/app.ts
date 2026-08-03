import express, { type Express } from "express";

import { GoogleScopes } from "../providers/google/google-scopes.js";
import type { GoogleProvider } from "../providers/google/google.provider.js";

export interface WebDependencies {
  googleProvider: GoogleProvider;
}

export function createWebApp(
  dependencies: WebDependencies
): Express {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("MCP Server Running");
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
    });
  });

  app.get("/oauth/google/login", (_req, res) => {
    const url =
      dependencies.googleProvider.getAuthorizationUrl(
        GoogleScopes.BASIC_PROFILE
      );

    res.redirect(url);
  });

  return app;
}