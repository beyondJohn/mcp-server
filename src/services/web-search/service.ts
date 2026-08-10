import type { WebSearchResult } from "../../providers/web-search/web-search-result.js";
import type {
    TavilyProvider,
    TavilySearchOptions,
} from "../../providers/tavily/tavily.provider.js";
import type { PostgreSQLService } from "../postgresql/service.js";
import type { TavilyStorageService } from "../tavily-storage/service.js";

const WEB_SEARCH_RESULTS_TABLE = "web_search_results";

export class WebSearchService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly postgresqlService: PostgreSQLService,
        private readonly tavilyStorageService: TavilyStorageService
    ) { }

    public async search(
        query: string,
        options?: TavilySearchOptions
    ): Promise<WebSearchResult[]> {
        const normalizedOptions =
            {
                maxResults:
                    options?.maxResults ?? 5,
                searchDepth:
                    options?.searchDepth ?? "basic",
            };

        const response = await this.provider.search(
            query,
            normalizedOptions
        );

        await this.tavilyStorageService.saveSearchCall(
            query,
            normalizedOptions,
            response
        );

        const results =
            response.results.map(result => ({
                title: result.title,
                url: result.url,
                content: result.content,
                score: result.score,
            }));

        await this.saveResults(
            query,
            normalizedOptions,
            results
        );

        return results;
    }

    private async saveResults(
        query: string,
        options: Required<TavilySearchOptions>,
        results: WebSearchResult[]
    ): Promise<void> {
        const datetime =
            new Date().toISOString();

        for (const result of results) {
            await this.postgresqlService.insertRow({
                table: WEB_SEARCH_RESULTS_TABLE,
                values: {
                    title: result.title,
                    url: result.url,
                    content: result.content,
                    query,
                    max_results: options.maxResults,
                    search_depth: options.searchDepth,
                    datetime,
                    score: result.score,
                },
            });
        }
    }
}