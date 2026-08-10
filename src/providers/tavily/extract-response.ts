export interface TavilyExtractResult {
  url: string;
  raw_content: string;
  images?: string[];
  favicon?: string;
}

export interface TavilyExtractFailedResult {
  url: string;
  error?: string;
}

export interface TavilyExtractResponse {
  results: TavilyExtractResult[];
  failed_results: TavilyExtractFailedResult[];
  response_time: number;
  usage?: {
    credits: number;
  };
  request_id: string;
}