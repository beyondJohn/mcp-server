import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { TavilyMapService } from "../../../services/tavily-map/service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerTavilyMapTool(
  server: McpServer,
  tavilyMapService: TavilyMapService
): void {
  server.registerTool(
    "tavily_map",
    {
      description:
        "Generate a Tavily site map by discovering URLs reachable from a starting page.",
      inputSchema: {
        url: z
          .string()
          .min(1)
          .describe("The root URL to begin mapping from."),
        instructions: z
          .string()
          .min(1)
          .optional()
          .describe("Optional natural language instructions that guide link discovery."),
        maxDepth: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe("Maximum mapping depth from the starting URL."),
        maxBreadth: z
          .number()
          .int()
          .min(1)
          .max(500)
          .optional()
          .describe("Maximum number of links to follow per page level."),
        limit: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Total number of links the mapper processes before stopping."),
        selectPaths: z
          .array(z.string().min(1))
          .optional()
          .describe("Regex path patterns to include."),
        selectDomains: z
          .array(z.string().min(1))
          .optional()
          .describe("Regex domain patterns to include."),
        excludePaths: z
          .array(z.string().min(1))
          .optional()
          .describe("Regex path patterns to exclude."),
        excludeDomains: z
          .array(z.string().min(1))
          .optional()
          .describe("Regex domain patterns to exclude."),
        allowExternal: z
          .boolean()
          .optional()
          .describe("Whether external-domain links can appear in the results."),
        timeout: z
          .number()
          .min(10)
          .max(150)
          .optional()
          .describe("Maximum map time in seconds."),
        includeUsage: z
          .boolean()
          .optional()
          .describe("Whether to include Tavily credit usage information in the response."),
      },
    },
    async (request) => {
      const result = await tavilyMapService.map(request);

      return textResponse(result);
    }
  );
}