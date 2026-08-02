import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-server",
    version: "1.0.0",
  });

  registerTools(server);

  return server;
}