import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { SheetsService } from "../../../services/sheets/service.js";

export function registerAppendTool(
    server: McpServer,
    sheetsService: SheetsService
): void {
    server.registerTool(
        "sheets_append",
        {
            title: "Append Rows to Google Sheet",
            description:
                "Appends rows to a worksheet. Required inputs are spreadsheetId, worksheet, and values.",

            inputSchema: {
                spreadsheetId: z.string()
                    .describe("Google spreadsheet ID"),
                worksheet: z
                    .string()
                    .describe("Worksheet tab name, e.g. 'Sheet1'"),
                values: z
                    .array(z.array(z.string()))
                    .describe("Rows to append"),
            },
        },

async ({ spreadsheetId, worksheet, values }) => {
    await sheetsService.appendRows({
        spreadsheetId,
        worksheet: worksheet,
        values,
    });

    return {
        content: [
            {
                type: "text",
                text: `Appended ${values.length} row(s) to sheet ${worksheet}.`,
            },
        ],
    };
}
    );
}