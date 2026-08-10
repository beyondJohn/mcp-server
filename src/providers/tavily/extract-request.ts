export interface TavilyExtractRequest {
  urls: string | string[];
  query?: string;
  chunksPerSource?: number;
  extractDepth?: "basic" | "advanced";
  includeImages?: boolean;
  includeFavicon?: boolean;
  format?: "markdown" | "text";
  timeout?: number;
  includeUsage?: boolean;
}