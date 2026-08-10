export interface TavilyMapRequest {
  url: string;
  instructions?: string;
  maxDepth?: number;
  maxBreadth?: number;
  limit?: number;
  selectPaths?: string[];
  selectDomains?: string[];
  excludePaths?: string[];
  excludeDomains?: string[];
  allowExternal?: boolean;
  timeout?: number;
  includeUsage?: boolean;
}