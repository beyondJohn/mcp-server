import type { TavilyProvider } from "../../providers/tavily/tavily.provider.js";
import type { TavilyResearchSource } from "../../providers/tavily/research-get-response.js";
import type { TavilyResearchGetResponse } from "../../providers/tavily/research-get-response.js";
import type { TavilyResearchRequest } from "../../providers/tavily/research-request.js";
import type { TavilyResearchResponse } from "../../providers/tavily/research-response.js";
import type { TavilyStorageService } from "../tavily-storage/service.js";

const RESEARCH_POLL_INTERVAL_MS = 5000;
const RESEARCH_MAX_POLL_ATTEMPTS = 48;
const TERMINAL_RESEARCH_STATUSES = new Set([
    "completed",
    "failed",
    "cancelled",
    "error",
]);

interface ParsedStreamedResearchResult {
    status: string;
    content?: string;
    sources?: TavilyResearchSource[];
    latestResponsePayload: Record<string, unknown>;
}

export class TavilyResearchService {
    constructor(
        private readonly provider: TavilyProvider,
        private readonly tavilyStorageService: TavilyStorageService
    ) { }

    public async research(
        request: TavilyResearchRequest
    ): Promise<TavilyResearchResponse | string> {
        const response =
            await this.provider.research(request);

        const streamedPayload =
            typeof response === "string"
                ? this.parseStreamedResearch(
                    response
                )
                : undefined;

        await this.tavilyStorageService.saveResearchCreate(
            request,
            response,
            streamedPayload
        );

        if (typeof response !== "string") {
            void this.captureResearchCompletion(
                response.request_id,
                response.status
            );
        }

        return response;
    }

    public async getResearch(
        requestId: string
    ): Promise<TavilyResearchGetResponse> {
        const response =
            await this.provider.getResearch(requestId);

        await this.tavilyStorageService.saveResearchGet(
            requestId,
            response
        );

        return response;
    }

    private async captureResearchCompletion(
        requestId: string,
        initialStatus: string
    ): Promise<void> {
        if (
            TERMINAL_RESEARCH_STATUSES.has(
                initialStatus.toLowerCase()
            )
        ) {
            return;
        }

        for (
            let attempt = 0;
            attempt < RESEARCH_MAX_POLL_ATTEMPTS;
            attempt += 1
        ) {
            await this.delay(
                RESEARCH_POLL_INTERVAL_MS
            );

            try {
                const response =
                    await this.provider.getResearch(
                        requestId
                    );

                await this.tavilyStorageService.saveResearchGet(
                    requestId,
                    response
                );

                if (
                    TERMINAL_RESEARCH_STATUSES.has(
                        response.status.toLowerCase()
                    )
                ) {
                    return;
                }
            } catch {
                return;
            }
        }
    }

    private parseStreamedResearch(
        response: string
    ): ParsedStreamedResearchResult | undefined {
        const lines = response.split(/\r?\n/);
        const contentParts: string[] = [];
        let sources: TavilyResearchSource[] | undefined;
        let sawDone = false;

        for (const line of lines) {
            if (!line.startsWith("data: ")) {
                if (line === "event: done") {
                    sawDone = true;
                }

                continue;
            }

            const payload = line.slice(6).trim();

            if (payload.length === 0) {
                continue;
            }

            let parsed: unknown;

            try {
                parsed = JSON.parse(payload);
            } catch {
                continue;
            }

            if (
                parsed === null ||
                typeof parsed !== "object"
            ) {
                continue;
            }

            const choices =
                Reflect.get(parsed, "choices");

            if (!Array.isArray(choices)) {
                continue;
            }

            for (const choice of choices) {
                if (
                    choice === null ||
                    typeof choice !== "object"
                ) {
                    continue;
                }

                const delta =
                    Reflect.get(choice, "delta");

                if (
                    delta === null ||
                    typeof delta !== "object"
                ) {
                    continue;
                }

                const chunk =
                    Reflect.get(delta, "content");

                if (typeof chunk === "string") {
                    contentParts.push(chunk);
                }

                const chunkSources =
                    Reflect.get(delta, "sources");

                if (Array.isArray(chunkSources)) {
                    sources = chunkSources
                        .filter(source =>
                            source !== null &&
                            typeof source === "object"
                        )
                        .map(source => ({
                            ...(source as TavilyResearchSource),
                        }));
                }
            }
        }

        if (
            contentParts.length === 0 &&
            sources === undefined &&
            !sawDone
        ) {
            return undefined;
        }

        const content =
            contentParts.join("");
        const status =
            sawDone
                ? "completed"
                : "streaming_response";

        return {
            status,
            content:
                content.length > 0
                    ? content
                    : undefined,
            sources,
            latestResponsePayload: {
                status,
                content,
                sources,
                raw_response: response,
            },
        };
    }

    private async delay(
        milliseconds: number
    ): Promise<void> {
        await new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}