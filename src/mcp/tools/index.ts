import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Services } from "../../services/index.js";

import { registerHelloTool } from "./hello/hello.tool.js";
import { registerTimeTool } from "./time/time.tool.js";
import { registerSystemInfoTool } from "./system/system-info.tool.js";

export function registerTools(
  server: McpServer,
  services: Services
): void {
  registerHelloTool(server);

  registerTimeTool(server, services.timeService);

  registerSystemInfoTool(server, services.systemInfoService);
}