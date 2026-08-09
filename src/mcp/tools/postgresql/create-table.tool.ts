import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { PostgreSQLService } from "../../../services/postgresql/service.js";

export function registerCreateTableTool(
  server: McpServer,
  postgresqlService: PostgreSQLService
): void {
  server.registerTool(
    "postgresql_create_table",
    {
      title: "Create PostgreSQL Table",

      description:
        "Creates a PostgreSQL table using explicit column definitions. Column names and data types are validated. A primary key may optionally be specified.",

      inputSchema: {
        table: z
          .string()
          .describe(
            "The PostgreSQL table name."
          ),

        columns: z
          .array(
            z.object({
              name: z
                .string()
                .describe(
                  "The column name."
                ),

              dataType: z
                .string()
                .describe(
                  "The PostgreSQL data type, such as INTEGER, TEXT, BOOLEAN, or VARCHAR(255)."
                ),

              nullable: z
                .boolean()
                .optional()
                .describe(
                  "Whether the column permits NULL. Defaults to true."
                ),
            })
          )
          .min(1)
          .describe(
            "The columns to create."
          ),

        primaryKey: z
          .array(z.string())
          .optional()
          .describe(
            "Optional column names forming the primary key."
          ),
      },
    },

    async ({
      table,
      columns,
      primaryKey,
    }) => {
      await postgresqlService.createTable({
        table,
        columns,
        primaryKey,
      });

      return {
        content: [
          {
            type: "text",
            text: `Created PostgreSQL table ${table}.`,
          },
        ],
      };
    }
  );
}