import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerHelloTool } from "./tools/hello/hello.tool.js";
import { registerTimeTool } from "./tools/time/time.tool.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-server",
    version: "1.0.0",
  });

  registerHelloTool(server);
  
  registerTimeTool(server);

  return server;
}