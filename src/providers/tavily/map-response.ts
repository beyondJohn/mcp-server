export interface TavilyMapResponse {
  base_url: string;
  results: string[];
  response_time: number;
  usage?: {
    credits: number;
  };
  request_id: string;
}