import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { SheetsService } from "../../../services/sheets/service.js";

export function registerUpdateRowTool(
  server: McpServer,
  sheetsService: SheetsService
): void {
  server.registerTool(
    "sheets_update_row",
    {
      title: "Update Row in Google Sheet",
      description:
        "Updates the first row in a worksheet where a specified column matches a value.",

      inputSchema: {
        spreadsheetId: z
          .string()
          .describe("Google spreadsheet ID"),

        worksheet: z
          .string()
          .describe("Worksheet tab name"),

        matchColumn: z
          .string()
          .describe("Column name to search"),

        matchValue: z
          .string()
          .describe("Value to match"),

        updates: z
          .record(z.string(), z.string())
          .describe(
            "Column/value pairs to update"
          ),
      },
    },

    async ({
      spreadsheetId,
      worksheet,
      matchColumn,
      matchValue,
      updates,
    }) => {
      await sheetsService.updateRow({
        spreadsheetId,
        worksheet,
        matchColumn,
        matchValue,
        updates,
      });

      return {
        content: [
          {
            type: "text",
            text:
              `Updated row where ` +
              `${matchColumn} = ${matchValue}.`,
          },
        ],
      };
    }
  );
}