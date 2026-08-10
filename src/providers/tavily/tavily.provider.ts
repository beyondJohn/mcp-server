import { Logger } from "../../logger/index.js";

import type { TavilyConfig } from "./tavily-config.js";
import type { TavilyCrawlRequest } from "./crawl-request.js";
import type { TavilyCrawlResponse } from "./crawl-response.js";
import type { TavilyExtractRequest } from "./extract-request.js";
import type { TavilyExtractResponse } from "./extract-response.js";
import type { TavilyMapRequest } from "./map-request.js";
import type { TavilyMapResponse } from "./map-response.js";
import type { TavilyResearchGetResponse } from "./research-get-response.js";
import type { TavilyResearchRequest } from "./research-request.js";
import type { TavilyResearchResponse } from "./research-response.js";
import type { WebSearchResult } from "../web-search/web-search-result.js";

export interface TavilySearchOptions {
    maxResults?: number;
    searchDepth?: "basic" | "advanced";
}

export interface TavilySearchResponse {
  results: {
    title: string;
    url: string;
    content: string;
    score: number;
  }[];
    response_time?: number;
    usage?: {
        credits: number;
    };
    request_id?: string;
}

export class TavilyProvider {
    private readonly apiKey: string;

    constructor(
        config: TavilyConfig,
        private readonly logger: typeof Logger
    ) {
        this.apiKey = config.apiKey;

        this.logger.info(
            "TavilyProvider",
            "Tavily provider initialized."
        );
    }

    public async research(
        request: TavilyResearchRequest
    ): Promise<TavilyResearchResponse | string> {
        this.logger.debug(
            "TavilyProvider",
            `Creating Tavily research task: ${request.input}`
        );

        const body = {
            input: request.input,
            model: request.model,
            stream: request.stream,
            output_schema: request.outputSchema,
            citation_format: request.citationFormat,
            include_domains: request.includeDomains,
            exclude_domains: request.excludeDomains,
            output_length: request.outputLength,
            files: request.files,
        };

        if (request.stream === true) {
            return this.postText(
                "/research",
                body,
                "research"
            );
        }

        return this.postJson<TavilyResearchResponse>(
            "/research",
            body,
            "research"
        );
    }

    public async getResearch(
        requestId: string
    ): Promise<TavilyResearchGetResponse> {
        this.logger.debug(
            "TavilyProvider",
            `Getting Tavily research task ${requestId}`
        );

        return this.getJson<TavilyResearchGetResponse>(
            `/research/${requestId}`,
            "research get"
        );
    }

    public async extract(
        request: TavilyExtractRequest
    ): Promise<TavilyExtractResponse> {
        this.logger.debug(
            "TavilyProvider",
            "Extracting content with Tavily."
        );

        return this.postJson<TavilyExtractResponse>(
            "/extract",
            {
                urls: request.urls,
                query: request.query,
                chunks_per_source: request.chunksPerSource,
                extract_depth: request.extractDepth,
                include_images: request.includeImages,
                include_favicon: request.includeFavicon,
                format: request.format,
                timeout: request.timeout,
                include_usage: request.includeUsage,
            },
            "extract"
        );
    }

    public async crawl(
        request: TavilyCrawlRequest
    ): Promise<TavilyCrawlResponse> {
        this.logger.debug(
            "TavilyProvider",
            `Crawling with Tavily from ${request.url}`
        );

        return this.postJson<TavilyCrawlResponse>(
            "/crawl",
            {
                url: request.url,
                instructions: request.instructions,
                chunks_per_source: request.chunksPerSource,
                max_depth: request.maxDepth,
                max_breadth: request.maxBreadth,
                limit: request.limit,
                select_paths: request.selectPaths,
                select_domains: request.selectDomains,
                exclude_paths: request.excludePaths,
                exclude_domains: request.excludeDomains,
                allow_external: request.allowExternal,
                include_images: request.includeImages,
                extract_depth: request.extractDepth,
                format: request.format,
                include_favicon: request.includeFavicon,
                timeout: request.timeout,
                include_usage: request.includeUsage,
            },
            "crawl"
        );
    }

    public async map(
        request: TavilyMapRequest
    ): Promise<TavilyMapResponse> {
        this.logger.debug(
            "TavilyProvider",
            `Mapping with Tavily from ${request.url}`
        );

        return this.postJson<TavilyMapResponse>(
            "/map",
            {
                url: request.url,
                instructions: request.instructions,
                max_depth: request.maxDepth,
                max_breadth: request.maxBreadth,
                limit: request.limit,
                select_paths: request.selectPaths,
                select_domains: request.selectDomains,
                exclude_paths: request.excludePaths,
                exclude_domains: request.excludeDomains,
                allow_external: request.allowExternal,
                timeout: request.timeout,
                include_usage: request.includeUsage,
            },
            "map"
        );
    }

    public async search(
        query: string,
        options: TavilySearchOptions = {}
    ): Promise<TavilySearchResponse> {
        const maxResults =
            options.maxResults ?? 5;

        const searchDepth =
            options.searchDepth ?? "basic";

        this.logger.debug(
            "TavilyProvider",
            `Searching Tavily: ${query}`
        );

        const data = await this.postJson<TavilySearchResponse>(
            "/search",
            {
                query,
                max_results: maxResults,
                search_depth: searchDepth,
            },
            "search"
        );

        const results: WebSearchResult[] =
            data.results.map(result => ({
                title: result.title,
                url: result.url,
                content: result.content,
                score: result.score,
            }));

        this.logger.info(
            "TavilyProvider",
            `Tavily returned ${results.length} result(s).`
        );

        return data;
    }

    private async getJson<TResponse>(
        path: string,
        operation: string
    ): Promise<TResponse> {
        const response = await this.request(
            "GET",
            path,
            operation
        );

        return (await response.json()) as TResponse;
    }

    private async postJson<TResponse>(
        path: string,
        body: Record<string, unknown>,
        operation: string
    ): Promise<TResponse> {
        const response = await this.request(
            "POST",
            path,
            operation,
            body
        );

        return (await response.json()) as TResponse;
    }

    private async postText(
        path: string,
        body: Record<string, unknown>,
        operation: string
    ): Promise<string> {
        const response = await this.request(
            "POST",
            path,
            operation,
            body
        );

        return response.text();
    }

    private async request(
        method: "GET" | "POST",
        path: string,
        operation: string,
        body?: Record<string, unknown>
    ): Promise<Response> {
        const response = await fetch(
            `https://api.tavily.com${path}`,
            {
                method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body:
                    body !== undefined
                        ? JSON.stringify(body)
                        : undefined,
            }
        );

        if (!response.ok) {
            const responseBody = await response.text();

            this.logger.error(
                "TavilyProvider",
                `Tavily ${operation} failed: ${response.status} ${response.statusText}`
            );

            throw new Error(
                `Tavily ${operation} failed: ${response.status} ${responseBody}`
            );
        }

        return response;
    }
}