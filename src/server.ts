import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";
import { config } from "./config/config.js";

export function createServer(): McpServer {
  const server = new McpServer({
  name: config.app.name,
  version: config.app.version,
});

  registerTools(server);

  return server;
}