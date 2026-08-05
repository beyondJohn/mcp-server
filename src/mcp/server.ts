import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createServices } from "../services/index.js";
import { registerTools } from "./tools/index.js";
import { config } from "../config/config.js";

import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";

export function createServer(
  googleAuthProvider: IGoogleAuthProvider
): McpServer {
  const server = new McpServer({
    name: config.app.name,
    version: config.app.version,
  });

  const services = createServices(
    googleAuthProvider
  );

  registerTools(server, services);

  return server;
}