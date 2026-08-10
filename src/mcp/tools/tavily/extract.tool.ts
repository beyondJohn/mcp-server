import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { TavilyExtractService } from "../../../services/tavily-extract/service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerTavilyExtractTool(
  server: McpServer,
  tavilyExtractService: TavilyExtractService
): void {
  server.registerTool(
    "tavily_extract",
    {
      description:
        "Extract structured page content from one or more URLs using Tavily Extract.",
      inputSchema: {
        urls: z
          .union([
            z.string().min(1),
            z.array(z.string().min(1)).min(1),
          ])
          .describe("One URL or a list of URLs to extract content from."),
        query: z
          .string()
          .min(1)
          .optional()
          .describe("Optional intent used to rerank returned content chunks."),
        chunksPerSource: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe("Maximum number of relevant content chunks to return per source when query is provided."),
        extractDepth: z
          .enum(["basic", "advanced"])
          .optional()
          .describe("Extraction depth. advanced may return richer content with higher latency and credit cost."),
        includeImages: z
          .boolean()
          .optional()
          .describe("Whether to include extracted image URLs in each result."),
        includeFavicon: z
          .boolean()
          .optional()
          .describe("Whether to include the favicon URL for each result."),
        format: z
          .enum(["markdown", "text"])
          .optional()
          .describe("The format for extracted page content."),
        timeout: z
          .number()
          .min(1)
          .max(60)
          .optional()
          .describe("Maximum extraction time in seconds per request."),
        includeUsage: z
          .boolean()
          .optional()
          .describe("Whether to include Tavily credit usage information in the response."),
      },
    },
    async (request) => {
      const result = await tavilyExtractService.extract(request);

      return textResponse(result);
    }
  );
}