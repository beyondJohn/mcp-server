import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Services } from "../../services/index.js";

import { registerHelloTool } from "./hello/hello.tool.js";
import { registerTimeTool } from "./time/time.tool.js";
import { registerSystemInfoTool } from "./system/system-info.tool.js";
import { registerGmailSendTool } from "./gmail/send.tool.js";
import { registerLabelsTool } from "./gmail/labels.tool.js";
import { registerListMessagesTool } from "./gmail/list-messages.tool.js";

export function registerTools(
  server: McpServer,
  services: Services
): void {
  registerHelloTool(server);

  registerTimeTool(server, services.timeService);

  registerSystemInfoTool(server, services.systemInfoService);
  registerGmailSendTool(server, services.gmailService);
  registerLabelsTool(server,services.gmailService);
  registerListMessagesTool(server,services.gmailService);
}