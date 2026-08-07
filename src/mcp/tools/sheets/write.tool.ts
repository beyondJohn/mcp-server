import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { SheetsService } from "../../../services/sheets/service.js";

export function registerWriteTool(
    server: McpServer,
    sheetsService: SheetsService
): void {
    server.registerTool(
        "sheets_write",
        {
            title: "Write Google Sheet Range",
            description:
                "Writes values into a range in a Google Sheet.",

            inputSchema: {
                spreadsheetId: z.string(),
                range: z.string(),
                values: z.array(
                    z.array(z.string())
                ),
            },
        },

        async ({ spreadsheetId, range, values }) => {

            await sheetsService.writeRange({
                spreadsheetId,
                range,
                values: values,
            });

            return {
                content: [
                    {
                        type: "text",
                        text: `Updated ${range}.`,
                    },
                ],
            };
        }
    );
}