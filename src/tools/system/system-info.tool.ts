import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { SystemInfoService } from "../../services/system.service.js";
import { textResponse } from "../../utils/mcp-response.js";

export function registerSystemInfoTool(server: McpServer): void {
  server.registerTool(
    "system.info",
    {
      description: "Returns information about the host system.",
      inputSchema: {},
    },
    async () => {
      const systemInfo = SystemInfoService.getSystemInfo();

      return textResponse(systemInfo);
    }
  );
}