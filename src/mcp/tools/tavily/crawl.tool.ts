import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { TavilyCrawlService } from "../../../services/tavily-crawl/service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerTavilyCrawlTool(
  server: McpServer,
  tavilyCrawlService: TavilyCrawlService
): void {
  server.registerTool(
    "tavily_crawl",
    {
      description:
        "Traverse a website and extract page content from discovered URLs using Tavily Crawl.",
      inputSchema: {
        url: z
          .string()
          .min(1)
          .describe("The root URL to begin the crawl from."),
        instructions: z
          .string()
          .min(1)
          .optional()
          .describe("Optional natural language instructions that guide the crawler."),
        chunksPerSource: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe("Maximum number of chunks to return per source when instructions are provided."),
        maxDepth: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional()
          .describe("Maximum crawl depth from the starting URL."),
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
          .describe("Total number of links the crawler processes before stopping."),
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
        includeImages: z
          .boolean()
          .optional()
          .describe("Whether to include extracted image URLs in crawl results."),
        extractDepth: z
          .enum(["basic", "advanced"])
          .optional()
          .describe("Extraction depth for crawled pages."),
        format: z
          .enum(["markdown", "text"])
          .optional()
          .describe("The format for extracted page content."),
        includeFavicon: z
          .boolean()
          .optional()
          .describe("Whether to include favicon URLs in crawl results."),
        timeout: z
          .number()
          .min(10)
          .max(150)
          .optional()
          .describe("Maximum crawl time in seconds."),
        includeUsage: z
          .boolean()
          .optional()
          .describe("Whether to include Tavily credit usage information in the response."),
      },
    },
    async (request) => {
      const result = await tavilyCrawlService.crawl(request);

      return textResponse(result);
    }
  );
}