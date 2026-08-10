export interface TavilyCrawlResult {
  url: string;
  raw_content: string;
  images?: string[];
  favicon?: string;
}

export interface TavilyCrawlResponse {
  base_url: string;
  results: TavilyCrawlResult[];
  response_time: number;
  usage?: {
    credits: number;
  };
  request_id: string;
}