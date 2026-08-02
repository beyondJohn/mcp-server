import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerHelloTool } from "./hello/hello.tool.js";
import { registerTimeTool } from "./time/time.tool.js";
import { registerSystemInfoTool } from "./system/system-info.tool.js";

export function registerTools(server: McpServer): void {
  registerHelloTool(server);
  registerTimeTool(server);
  registerSystemInfoTool(server);
}