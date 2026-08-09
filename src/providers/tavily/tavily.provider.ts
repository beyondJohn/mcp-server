import { Logger } from "../../logger/index.js";

import type { TavilyConfig } from "./tavily-config.js";
import type { WebSearchResult } from "../web-search/web-search-result.js";

export interface TavilySearchOptions {
    maxResults?: number;
    searchDepth?: "basic" | "advanced";
}

interface TavilySearchResponse {
  results: {
    title: string;
    url: string;
    content: string;
    score: number;
  }[];
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

    public async search(
        query: string,
        options: TavilySearchOptions = {}
    ): Promise<WebSearchResult[]> {
        const maxResults =
            options.maxResults ?? 5;

        const searchDepth =
            options.searchDepth ?? "basic";

        this.logger.debug(
            "TavilyProvider",
            `Searching Tavily: ${query}`
        );

        const response = await fetch(
            "https://api.tavily.com/search",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    query,
                    max_results: maxResults,
                    search_depth: searchDepth,
                }),
            }
        );

        if (!response.ok) {
            const body = await response.text();

            this.logger.error(
                "TavilyProvider",
                `Tavily search failed: ${response.status} ${response.statusText}`
            );

            throw new Error(
                `Tavily search failed: ${response.status} ${body}`
            );
        }

        const data =
            (await response.json()) as TavilySearchResponse;

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

        return results;
    }
}