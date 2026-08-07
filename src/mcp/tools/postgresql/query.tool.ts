import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerQueryTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_query",
    {
      title: "Execute PostgreSQL Query",
      description:
        "Executes a read-only SQL query against PostgreSQL.",

      inputSchema: {
        sql: z
          .string()
          .describe("A read-only SQL SELECT statement."),
      },
    },

    async ({ sql }) => {
      const rows =
        await postgresqlService.query(sql);

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