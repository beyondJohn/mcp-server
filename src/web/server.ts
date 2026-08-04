import http, { type Server as HttpServer } from "node:http";

import type { AppConfig } from "../config/config.js";
import { Logger } from "../logger/index.js";
import { createWebApp } from "./app.js";
import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";

export function startWebServer(config: AppConfig, googleProvider: IGoogleAuthProvider): HttpServer {

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