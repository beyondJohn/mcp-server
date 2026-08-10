import type { TavilyExtractRequest } from "../../providers/tavily/extract-request.js";
import type { TavilyExtractResponse } from "../../providers/tavily/extract-response.js";
import type { TavilyProvider } from "../../providers/tavily/tavily.provider.js";
import type { TavilyStorageService } from "../tavily-storage/service.js";

export class TavilyExtractService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly tavilyStorageService: TavilyStorageService
    ) { }

    public async extract(
        request: TavilyExtractRequest
    ): Promise<TavilyExtractResponse> {
        const response =
            await this.provider.extract(request);

        await this.tavilyStorageService.saveExtractCall(
            request,
            response
        );

        return response;
    }
}