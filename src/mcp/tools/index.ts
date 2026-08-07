import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Services } from "../../services/index.js";

import { registerHelloTool } from "./hello/hello.tool.js";
import { registerTimeTool } from "./time/time.tool.js";
import { registerSystemInfoTool } from "./system/system-info.tool.js";
import { registerGmailSendTool } from "./gmail/send.tool.js";
import { registerLabelsTool } from "./gmail/labels.tool.js";
import { registerListMessagesTool } from "./gmail/list-messages.tool.js";
import { registerReadMessageTool } from "./gmail/read-message.tool.js";
import { registerReadTool as registerSheetsReadTool } from "./sheets/read.tool.js";
import { registerWriteTool } from "./sheets/write.tool.js";
import { registerAppendTool } from "./sheets/append.tool.js";
import { registerUpdateRowTool } from "./sheets/update-row.tool.js";

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
  registerReadMessageTool(server,services.gmailService);
  registerSheetsReadTool(server,services.sheetsService);
  registerWriteTool(server,services.sheetsService);
  registerAppendTool(server,services.sheetsService);
  registerUpdateRowTool(server, services.sheetsService);
  
}