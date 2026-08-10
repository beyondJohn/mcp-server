export interface TavilyResearchOutputSchema {
  properties: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown;
}

export interface TavilyResearchFile {
  name: string;
  data: string;
  type: "base64";
}

export interface TavilyResearchRequest {
  input: string;
  model?: "mini" | "pro" | "auto";
  stream?: boolean;
  outputSchema?: TavilyResearchOutputSchema;
  citationFormat?: "numbered" | "mla" | "apa" | "chicago";
  includeDomains?: string[];
  excludeDomains?: string[];
  outputLength?: "short" | "standard" | "long";
  files?: TavilyResearchFile[];
}