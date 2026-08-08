import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerUpdateRowTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_update_row",
    {
      title: "Update PostgreSQL Row",

      description:
        "Updates one or more rows in a PostgreSQL table using explicit WHERE conditions and returns the updated rows. A WHERE condition is required; updates without a WHERE condition are not permitted.",

      inputSchema: {
        table: z
          .string()
          .describe(
            "The PostgreSQL table name."
          ),

        where: z
          .record(z.string(), z.unknown())
          .describe(
            "Column/value conditions identifying the row or rows to update. At least one condition is required."
          ),

        values: z
          .record(z.string(), z.unknown())
          .describe(
            "Column/value pairs containing the fields to update. At least one value is required."
          ),
      },
    },

    async ({ table, where, values }) => {
      const rows =
        await postgresqlService.updateRow({
          table,
          where,
          values,
        });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              rows,
              null,
              2
            ),
          },
        ],
      };
    }
  );
}