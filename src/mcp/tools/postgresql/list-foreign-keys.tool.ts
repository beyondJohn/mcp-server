import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerListForeignKeysTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_list_foreign_keys",
    {
      title: "List PostgreSQL Foreign Keys",

      description:
        "Lists foreign key relationships between tables in the public schema.",
    },

    async () => {
      const foreignKeys =
        await postgresqlService.listForeignKeys();

      return {
        content: [
          {
            type: "text",
            text:
              foreignKeys.length === 0
                ? "No foreign keys found."
                : JSON.stringify(
                    foreignKeys,
                    null,
                    2
                  ),
          },
        ],
      };
    }
  );
}