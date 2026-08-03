import http, { type Server as HttpServer } from "node:http";

import type { AppConfig } from "../config/config.js";
import { Logger } from "../logger/index.js";
import { createWebApp } from "./app.js";
import type { GoogleAuthProvider } from "../providers/google/google-auth.provider.js";

export function startWebServer(config: AppConfig, googleProvider: GoogleAuthProvider): HttpServer {

  const app = createWebApp({googleAuthProvider: googleProvider});

  const server = http.createServer(app);

  server.listen(config.server.port, () => {
    Logger.info(
      "WebServer",
      `Listening on http://localhost:${config.server.port}`
    );
  });

  return server;
}