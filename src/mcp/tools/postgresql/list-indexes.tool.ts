import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerListIndexesTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_list_indexes",
    {
      title: "List PostgreSQL Indexes",

      description:
        "Lists PostgreSQL indexes, optionally filtered by table.",

      inputSchema: {
        table: z
          .string()
          .optional()
          .describe(
            "Optional table name to filter indexes."
          ),
      },
    },

    async ({ table }) => {
      const indexes =
        await postgresqlService.listIndexes(table);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              indexes,
              null,
              2
            ),
          },
        ],
      };
    }
  );
}