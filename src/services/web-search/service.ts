import type { WebSearchResult } from "../../providers/web-search/web-search-result.js";
import type {
    TavilyProvider,
    TavilySearchOptions,
} from "../../providers/tavily/tavily.provider.js";

export class WebSearchService {
    constructor(
        private readonly provider: TavilyProvider
    ) { }

    public async search(
        query: string,
        options?: TavilySearchOptions
    ): Promise<WebSearchResult[]> {
        return this.provider.search(
            query,
            options
        );
    }
}