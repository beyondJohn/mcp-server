import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createServices } from "../services/index.js";
import { registerTools } from "./tools/index.js";
import { config } from "../config/config.js";

export function createServer(): McpServer {
  const server = new McpServer({
  name: config.app.name,
  version: config.app.version,
});

const services = createServices();

  registerTools(server, services);

  return server;
}