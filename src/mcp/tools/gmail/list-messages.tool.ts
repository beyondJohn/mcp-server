import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { GmailService } from "../../../services/gmail/service.js";

export function registerListMessagesTool(
    server: McpServer,
    gmailService: GmailService
): void {
    server.registerTool(
        "gmail_list_messages",
        {
            title: "List Gmail Messages",
            description:
                "Lists recent inbox messages.",

            inputSchema: {
                maxResults: z
                    .number()
                    .int()
                    .positive()
                    .max(100)
                    .optional(),
            },
        },

        async ({ maxResults }) => {
            const messages =
                await gmailService.listMessages(
                    maxResults ?? 10
                );

            if (messages.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "No messages found.",
                        },
                    ],
                };
            }

            const text = messages
                .map(
                    (message, index) =>
                        `${index + 1}. ${message.subject}
ID: ${message.id}
From: ${message.from}
Date: ${message.date}`
                )
                .join("\n\n");

            return {
                content: [
                    {
                        type: "text",
                        text,
                    },
                ],
            };
        }
    );
}