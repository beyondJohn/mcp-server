import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerHelloTool(server: McpServer): void {
  server.registerTool(
    "hello",
    {
      description: "Say hello to someone",
      inputSchema: {
        name: z.string().describe("The name of the person to greet"),
      },
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${name}!`,
          },
        ],
      };
    }
  );
}