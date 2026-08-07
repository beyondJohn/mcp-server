import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerListTablesTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_list_tables",
    {
      title: "List PostgreSQL Tables",
      description:
        "Lists all tables in the public schema.",
    },

    async () => {
      const tables =
        await postgresqlService.listTables();

      return {
        content: [
          {
            type: "text",
            text:
              tables.length === 0
                ? "No tables found."
                : tables.join("\n"),
          },
        ],
      };
    }
  );
}