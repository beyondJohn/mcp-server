import type { WebSearchResult } from "../../providers/web-search/web-search-result.js";
import type {
    TavilyProvider,
    TavilySearchOptions,
} from "../../providers/tavily/tavily.provider.js";
import type { PostgreSQLService } from "../postgresql/service.js";

const WEB_SEARCH_RESULTS_TABLE = "web_search_results";

export class WebSearchService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly postgresqlService: PostgreSQLService
    ) { }

    public async search(
        query: string,
        options?: TavilySearchOptions
    ): Promise<WebSearchResult[]> {
        const normalizedOptions =
            options ?? {};

        const results = await this.provider.search(
            query,
            normalizedOptions
        );

        await this.saveResults(
            query,
            normalizedOptions,
            results
        );

        return results;
    }

    private async saveResults(
        query: string,
        options: TavilySearchOptions,
        results: WebSearchResult[]
    ): Promise<void> {
        const datetime =
            new Date().toISOString();

        const maxResults =
            options.maxResults ?? 5;

        const searchDepth =
            options.searchDepth ?? "basic";

        for (const result of results) {
            await this.postgresqlService.insertRow({
                table: WEB_SEARCH_RESULTS_TABLE,
                values: {
                    title: result.title,
                    url: result.url,
                    content: result.content,
                    query,
                    max_results: maxResults,
                    search_depth: searchDepth,
                    datetime,
                },
            });
        }
    }
}