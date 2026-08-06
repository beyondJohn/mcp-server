import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { GmailService } from "../../../services/gmail/service.js";

export function registerLabelsTool(
  server: McpServer,
  gmailService: GmailService
): void {
  server.registerTool(
    "gmail_labels",
    {
      title: "List Gmail Labels",
      description: "Returns all Gmail labels for the authenticated account.",
      inputSchema: {},
    },
    async () => {
      const labels =
        await gmailService.listLabels();

      return {
        content: [
          {
            type: "text",
            text: labels.join("\n"),
          },
        ],
      };
    }
  );
}