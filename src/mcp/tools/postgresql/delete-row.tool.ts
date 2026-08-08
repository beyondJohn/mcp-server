import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerDeleteRowTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_delete_row",
    {
      title: "Delete PostgreSQL Row",

      description:
        "Deletes rows from a PostgreSQL table using explicit WHERE conditions and returns the deleted rows. A WHERE condition is required; deletes without a WHERE condition are not permitted.",

      inputSchema: {
        table: z
          .string()
          .describe(
            "The PostgreSQL table name."
          ),

        where: z
          .record(z.string(), z.unknown())
          .describe(
            "Column/value conditions identifying the row or rows to delete. At least one condition is required."
          ),
      },
    },

    async ({ table, where }) => {
      const rows =
        await postgresqlService.deleteRow({
          table,
          where,
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