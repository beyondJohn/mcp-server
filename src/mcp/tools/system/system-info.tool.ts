import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { SystemInfoService } from "../../../services/system/system-info.service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerSystemInfoTool(server: McpServer,
  systemInfoService: SystemInfoService
): void {
  server.registerTool(
    "system_info",
    {
      description: "Returns information about the host system.",
      inputSchema: {},
    },
    async () => {
      
      const systemInfo = systemInfoService.getSystemInfo();

      return textResponse(systemInfo);
    }
  );
}