import type { TavilyMapRequest } from "../../providers/tavily/map-request.js";
import type { TavilyMapResponse } from "../../providers/tavily/map-response.js";
import type { TavilyProvider } from "../../providers/tavily/tavily.provider.js";
import type { TavilyStorageService } from "../tavily-storage/service.js";

export class TavilyMapService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly tavilyStorageService: TavilyStorageService
    ) { }

    public async map(
        request: TavilyMapRequest
    ): Promise<TavilyMapResponse> {
        const response =
            await this.provider.map(request);

        await this.tavilyStorageService.saveMapCall(
            request,
            response
        );

        return response;
    }
}