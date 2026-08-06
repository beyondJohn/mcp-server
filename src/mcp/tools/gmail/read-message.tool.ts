import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { GmailService } from "../../../services/gmail/service.js";

export function registerReadMessageTool(
  server: McpServer,
  gmailService: GmailService
): void {
  server.registerTool(
    "gmail_read_message",
    {
      title: "Read Gmail Message",
      description: "Reads a Gmail message by its ID.",

      inputSchema: {
        id: z.string(),
      },
    },

    async ({ id }) => {
      const message =
        await gmailService.getMessage(id);

      return {
        content: [
          {
            type: "text",
            text:
`Subject: ${message.subject}

From: ${message.from}

To: ${message.to}

Date: ${message.date}

Body

${message.body}`,
          },
        ],
      };
    }
  );
}