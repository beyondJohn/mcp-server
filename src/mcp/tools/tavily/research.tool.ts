import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { TavilyResearchService } from "../../../services/tavily-research/service.js";
import { textResponse } from "../../../utils/mcp-response.js";

export function registerTavilyResearchTool(
  server: McpServer,
  tavilyResearchService: TavilyResearchService
): void {
  server.registerTool(
    "tavily_research",
    {
      description:
        "Create a Tavily research task that performs multi-step web research and returns the queued task details. Use tavily_get_research with the returned request_id to poll for status or final results. If stream is true, the raw SSE payload is returned as text after the request completes.",
      inputSchema: {
        input: z
          .string()
          .min(1)
          .describe("The research task or question to investigate."),
        model: z
          .enum(["mini", "pro", "auto"])
          .optional()
          .describe("Research model selection. mini is targeted, pro is broader, auto lets Tavily choose."),
        stream: z
          .boolean()
          .optional()
          .describe("Whether to request the research endpoint in SSE mode."),
        outputSchema: z
          .object({
            properties: z.record(
              z.string(),
              z.any()
            ),
            required: z.array(z.string()).optional(),
          })
          .passthrough()
          .optional()
          .describe("Optional JSON schema describing the desired response structure."),
        citationFormat: z
          .enum(["numbered", "mla", "apa", "chicago"])
          .optional()
          .describe("Citation format for the final research report."),
        includeDomains: z
          .array(z.string().min(1))
          .max(20)
          .optional()
          .describe("Preferred source domains. Tavily may still use other domains."),
        excludeDomains: z
          .array(z.string().min(1))
          .max(20)
          .optional()
          .describe("Blocked source domains that must not appear in the response."),
        outputLength: z
          .enum(["short", "standard", "long"])
          .optional()
          .describe("Target response length for the research output."),
        files: z
          .array(
            z.object({
              name: z.string().min(1),
              data: z.string().min(1),
              type: z.literal("base64"),
            })
          )
          .max(5)
          .optional()
          .describe("Optional base64-encoded .txt, .md, or .json files to ground the research request."),
      },
    },
    async (request) => {
      const result = await tavilyResearchService.research(request);

      return textResponse(result);
    }
  );
}