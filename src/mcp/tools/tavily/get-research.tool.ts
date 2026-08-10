import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { TavilyResearchService } from "../../../services/tavily-research/service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerTavilyGetResearchTool(
  server: McpServer,
  tavilyResearchService: TavilyResearchService
): void {
  server.registerTool(
    "tavily_get_research",
    {
      description:
        "Retrieve the status or final results of a Tavily research task by request ID.",
      inputSchema: {
        requestId: z
          .string()
          .min(1)
          .describe("The Tavily research request ID to retrieve."),
      },
    },
    async ({ requestId }) => {
      const result =
        await tavilyResearchService.getResearch(
          requestId
        );

      return textResponse(result);
    }
  );
}