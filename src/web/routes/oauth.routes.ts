import type { Express } from "express";

import { Logger } from "../../logger/index.js";
import { GoogleScopes } from "../../providers/google/google-scopes.js";
import type { WebDependencies } from "./web-dependencies.js";

export function registerOAuthRoutes(
  app: Express,
  dependencies: WebDependencies
): void {
  app.get("/oauth/google/login", (_req, res) => {
    const url =
      dependencies.googleAuthProvider.getAuthorizationUrl([
        ...GoogleScopes.PROFILE,
        ...GoogleScopes.GMAIL_READONLY,
        ...GoogleScopes.GMAIL_SEND,
        ...GoogleScopes.SHEETS,
      ]);

    res.redirect(url);
  });

  app.get("/oauth/google/callback", async (req, res) => {
    const { code } = req.query;

    if (typeof code !== "string") {
      return res.status(400).json({
        error: "Missing authorization code.",
      });
    }

    try {
      await dependencies.googleAuthProvider.authenticate(code);

      res.send(`
<h2>Authentication successful.</h2>
<p>You may close this window.</p>
`);
    } catch (error) {
      Logger.error(
        "OAuth",
        `Token exchange failed: ${String(error)}`
      );

      res.status(500).json({
        error: "Authentication failed.",
      });
    }
  });
}