import type { TavilyCrawlRequest } from "../../providers/tavily/crawl-request.js";
import type { TavilyCrawlResponse } from "../../providers/tavily/crawl-response.js";
import type { TavilyProvider } from "../../providers/tavily/tavily.provider.js";
import type { TavilyStorageService } from "../tavily-storage/service.js";

export class TavilyCrawlService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly tavilyStorageService: TavilyStorageService
    ) { }

    public async crawl(
        request: TavilyCrawlRequest
    ): Promise<TavilyCrawlResponse> {
        const response =
            await this.provider.crawl(request);

        await this.tavilyStorageService.saveCrawlCall(
            request,
            response
        );

        return response;
    }
}