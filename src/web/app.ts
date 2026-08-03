import express, { type Express } from "express";

import { GoogleScopes } from "../providers/google/google-scopes.js";
import { GoogleAuthProvider } from "../providers/google/google-auth.provider.js";

export interface WebDependencies {
  googleProvider: GoogleAuthProvider;
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

  app.get("/oauth/google/callback", async (req, res) => {
    const code = req.query.code;

    if (typeof code !== "string") {
      return res.status(400).json({
        error: "Missing authorization code.",
      });
    }

    try {
      const tokens =
        await dependencies.googleProvider.exchangeCodeForTokens(code);

      res.json(tokens);
    } catch (error) {
      res.status(500).json({
        error: "Failed to exchange authorization code.",
      });
    }
  });

  return app;
}