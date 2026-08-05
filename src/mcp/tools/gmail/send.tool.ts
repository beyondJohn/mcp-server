import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { textResponse } from "../../../utils/mcp-response.js";

import type { GmailService } from "../../../services/gmail/gmail.service.js";

export function registerGmailSendTool(
  server: McpServer,
  gmailService: GmailService
): void {
  server.registerTool(
    "gmail_send",
    {
      description: "Send an email using the authenticated Gmail account.",
      inputSchema: {
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
      },
    },
    async ({ to, subject, body }) => {
      const result = await gmailService.sendEmail({
        to,
        subject,
        body,
      });

      return textResponse(
        `Email sent successfully. Message ID: ${result.messageId}`
      );
    }
  );
}