import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { TimeService } from "../../services/time.service.js";
import { textResponse } from "../../utils/mcp-response.js";

export function registerTimeTool(server: McpServer): void {
  server.registerTool(
    "time.now",
    {
      description: "Returns the current date and time.",
      inputSchema: {
        timezone: z
          .string()
          .optional()
          .describe("An optional IANA timezone such as America/New_York"),
      },
    },
    async ({ timezone }) => {
      const currentTime = TimeService.getCurrentTime(timezone);

      return textResponse(currentTime);
    }
  );
}