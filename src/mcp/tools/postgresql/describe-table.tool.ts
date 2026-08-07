import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerDescribeTableTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_describe_table",
    {
      title: "Describe PostgreSQL Table",

      description:
        "Returns the schema for a PostgreSQL table.",

      inputSchema: {
        table: z.string(),
      },
    },

    async ({ table }) => {
      const columns =
        await postgresqlService.describeTable(
          table
        );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              columns,
              null,
              2
            ),
          },
        ],
      };
    }
  );
}