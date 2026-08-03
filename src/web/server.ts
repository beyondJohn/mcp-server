import { createWebApp } from "./app.js";

import type { AppConfig } from "../config/config.js";
import { Logger } from "../logger/index.js";
import http from "node:http";

export function startWebServer(config: AppConfig): void {
  const app = createWebApp();

  const server = http.createServer(app);

  server.listen(config.server.port, () => {
    Logger.info(
      "WebServer",
      `Listening on http://localhost:${config.server.port}`
    );
  });
}