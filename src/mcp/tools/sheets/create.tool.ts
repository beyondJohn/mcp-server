import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { SheetsService } from "../../../services/sheets/service.js";

export function registerSheetsCreateTool(
    server: McpServer,
    sheetsService: SheetsService
): void {
    server.registerTool(
        "sheets_create",
        {
            title: "Create Google Spreadsheet",

            description:
                "Creates a new Google Spreadsheet with the specified title and returns its spreadsheet ID and URL.",

            inputSchema: {
                title: z
                    .string()
                    .min(1)
                    .describe(
                        "The title for the new Google Spreadsheet."
                    ),
            },
        },

        async ({ title }) => {
            const result =
                await sheetsService.createSpreadsheet(
                    title
                );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            result,
                            null,
                            2
                        ),
                    },
                ],
            };
        }
    );
}