import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerInsertRowTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_insert_row",
    {
      title: "Insert PostgreSQL Row",
      description:
        "Inserts one row into a PostgreSQL table. The values object must explicitly map each provided value to the correct column name. Do not infer or invent column mappings when the user's requested values do not clearly correspond to the table schema. Ask the user for clarification when a value cannot be confidently mapped to a column.",
      inputSchema: {
        table: z
          .string()
          .describe("The table to insert into."),
        values: z
          .record(z.string(), z.unknown())
          .describe("Column/value pairs to insert."),
      },
    },

    async ({ table, values }) => {
      const row =
        await postgresqlService.insertRow({
          table,
          values,
        });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              row,
              null,
              2
            ),
          },
        ],
      };
    }
  );
}