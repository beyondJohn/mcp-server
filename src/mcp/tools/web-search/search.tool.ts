import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { textResponse } from "../../../utils/mcp-response.js";
import type { WebSearchService } from "../../../services/web-search/service.js";

export function registerWebSearchTool(
  server: McpServer,
  webSearchService: WebSearchService
): void {
  server.registerTool(
    "web_search",
    {
      description:
        "Search the web for information using the configured web search provider.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe("The web search query."),
        maxResults: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe("Maximum number of search results to return."),
        searchDepth: z
          .enum(["basic", "advanced"])
          .optional()
          .describe(
            "Search depth. Use basic for efficient discovery and advanced for deeper research."
          ),
      },
    },
    async ({ query, maxResults, searchDepth }) => {
      const results = await webSearchService.search(query, {
        maxResults,
        searchDepth,
      });

      return textResponse(results);
    }
  );
}