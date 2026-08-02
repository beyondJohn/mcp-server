import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerHelloTool } from "./hello/hello.tool.js";
import { registerTimeTool } from "./time/time.tool.js";
import { registerSystemInfoTool } from "./system/system-info.tool.js";

import { Logger } from "../logger/index.js";

export function registerTools(server: McpServer): void {
  Logger.debug("Tools", "Registering hello tool...");
  registerHelloTool(server);
  Logger.debug("Tools", "Registering time.now tool...");
  registerTimeTool(server);
  Logger.debug("Tools", "Registering system.info tool...");
  registerSystemInfoTool(server);
}