export interface TavilyResearchSource {
  title?: string;
  url?: string;
  favicon?: string;
  [key: string]: unknown;
}

export interface TavilyResearchGetResponse {
  request_id: string;
  created_at: string;
  status: string;
  content?: unknown;
  sources?: TavilyResearchSource[];
  response_time?: number;
}