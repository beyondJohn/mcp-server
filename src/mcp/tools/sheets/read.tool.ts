import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { SheetsService } from "../../../services/sheets/service.js";

export function registerReadTool(
  server: McpServer,
  sheetsService: SheetsService
): void {
  server.registerTool(
    "sheets_read",
    {
      title: "Read Google Sheet Range",
      description:
        "Reads a range of cells from a Google Sheet.",

      inputSchema: {
        spreadsheetId: z.string(),
        range: z.string(),
      },
    },

    async ({ spreadsheetId, range }) => {
      const values =
        await sheetsService.readRange(
          spreadsheetId,
          range
        );

      const text = values
        .map(row => row.join("\t"))
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text:
              text || "No data found.",
          },
        ],
      };
    }
  );
}