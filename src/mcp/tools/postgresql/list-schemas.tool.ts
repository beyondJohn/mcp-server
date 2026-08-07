import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerListSchemasTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_list_schemas",
    {
      title: "List PostgreSQL Schemas",

      description:
        "Lists all schemas in the database.",
    },

    async () => {
      const schemas =
        await postgresqlService.listSchemas();

      return {
        content: [
          {
            type: "text",
            text:
              schemas.length === 0
                ? "No schemas found."
                : schemas.join("\n"),
          },
        ],
      };
    }
  );
}