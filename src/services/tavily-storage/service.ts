import { randomUUID } from "node:crypto";

import type { CreateTableRequest } from "../../providers/postgresql/create-table-request.js";
import type { TavilyCrawlRequest } from "../../providers/tavily/crawl-request.js";
import type { TavilyCrawlResponse } from "../../providers/tavily/crawl-response.js";
import type { TavilyExtractRequest } from "../../providers/tavily/extract-request.js";
import type { TavilyExtractResponse } from "../../providers/tavily/extract-response.js";
import type { TavilyMapRequest } from "../../providers/tavily/map-request.js";
import type { TavilyMapResponse } from "../../providers/tavily/map-response.js";
import type { TavilyResearchGetResponse } from "../../providers/tavily/research-get-response.js";
import type { TavilyResearchRequest } from "../../providers/tavily/research-request.js";
import type { TavilyResearchResponse } from "../../providers/tavily/research-response.js";
import type {
    TavilySearchOptions,
    TavilySearchResponse,
} from "../../providers/tavily/tavily.provider.js";
import type { PostgreSQLService } from "../postgresql/service.js";

const TAVILY_SEARCH_CALLS_TABLE = "tavily_search_calls";
const TAVILY_RESEARCH_CALLS_TABLE = "tavily_research_calls";
const TAVILY_EXTRACT_CALLS_TABLE = "tavily_extract_calls";
const TAVILY_CRAWL_CALLS_TABLE = "tavily_crawl_calls";
const TAVILY_MAP_CALLS_TABLE = "tavily_map_calls";

interface StreamedResearchPayload {
    status: string;
    content?: unknown;
    sources?: unknown;
    responseTime?: number | null;
    tavilyCreatedAt?: string | null;
    latestResponsePayload: unknown;
}

export class TavilyStorageService {
    private initializationPromise?: Promise<void>;

    constructor(
        private readonly postgresqlService: PostgreSQLService
    ) { }

    public async ensureTables(): Promise<void> {
        this.initializationPromise ??=
            this.initializeTables();

        return this.initializationPromise;
    }

    public async saveSearchCall(
        query: string,
        options: Required<TavilySearchOptions>,
        response: TavilySearchResponse
    ): Promise<string> {
        await this.ensureTables();

        const requestId =
            response.request_id ?? randomUUID();

        await this.postgresqlService.insertRow({
            table: TAVILY_SEARCH_CALLS_TABLE,
            values: {
                request_id: requestId,
                query,
                max_results: options.maxResults,
                search_depth: options.searchDepth,
                result_count: response.results.length,
                request_payload: this.serialize({
                    query,
                    max_results: options.maxResults,
                    search_depth: options.searchDepth,
                }),
                response_payload: this.serialize(response),
                response_time: response.response_time ?? null,
                usage_credits:
                    response.usage?.credits ?? null,
                logged_at: this.now(),
            },
        });

        return requestId;
    }

    public async saveResearchCreate(
        request: TavilyResearchRequest,
        response: TavilyResearchResponse | string,
        streamedPayload?: StreamedResearchPayload
    ): Promise<string> {
        await this.ensureTables();

        const requestId =
            typeof response === "string"
                ? randomUUID()
                : response.request_id;

        await this.postgresqlService.insertRow({
            table: TAVILY_RESEARCH_CALLS_TABLE,
            values: {
                request_id: requestId,
                input: request.input,
                model: request.model ?? "auto",
                stream: request.stream ?? false,
                citation_format:
                    request.citationFormat ?? "numbered",
                output_length:
                    request.outputLength ?? "standard",
                include_domains:
                    request.includeDomains !== undefined
                        ? this.serialize(
                            request.includeDomains
                        )
                        : null,
                exclude_domains:
                    request.excludeDomains !== undefined
                        ? this.serialize(
                            request.excludeDomains
                        )
                        : null,
                files_payload:
                    request.files !== undefined
                        ? this.serialize(request.files)
                        : null,
                request_payload: this.serialize({
                    input: request.input,
                    model: request.model ?? "auto",
                    stream: request.stream ?? false,
                    output_schema:
                        request.outputSchema,
                    citation_format:
                        request.citationFormat ??
                        "numbered",
                    include_domains:
                        request.includeDomains,
                    exclude_domains:
                        request.excludeDomains,
                    output_length:
                        request.outputLength ??
                        "standard",
                    files: request.files,
                }),
                create_response_payload:
                    this.serialize(response),
                latest_response_payload:
                    this.serialize(
                        streamedPayload?.latestResponsePayload ??
                        response
                    ),
                status:
                    streamedPayload?.status ??
                    (typeof response === "string"
                        ? "streaming_response"
                        : response.status),
                tavily_created_at:
                    streamedPayload?.tavilyCreatedAt ??
                    (typeof response === "string"
                        ? null
                        : response.created_at),
                response_time:
                    streamedPayload?.responseTime ??
                    (typeof response === "string"
                        ? null
                        : response.response_time),
                content_payload:
                    streamedPayload?.content !== undefined
                        ? this.serialize(
                            streamedPayload.content
                        )
                        : typeof response === "string"
                            ? this.serialize(response)
                            : null,
                sources_payload:
                    streamedPayload?.sources !== undefined
                        ? this.serialize(
                            streamedPayload.sources
                        )
                        : null,
                logged_at: this.now(),
                last_checked_at:
                    streamedPayload !== undefined
                        ? this.now()
                        : null,
            },
        });

        return requestId;
    }

    public async saveResearchGet(
        requestId: string,
        response: TavilyResearchGetResponse
    ): Promise<void> {
        await this.ensureTables();

        const updatedRows =
            await this.postgresqlService.updateRow({
                table: TAVILY_RESEARCH_CALLS_TABLE,
                values: {
                    latest_response_payload:
                        this.serialize(response),
                    status: response.status,
                    tavily_created_at:
                        response.created_at,
                    response_time:
                        response.response_time ?? null,
                    content_payload:
                        response.content !== undefined
                            ? this.serialize(
                                response.content
                            )
                            : null,
                    sources_payload:
                        response.sources !== undefined
                            ? this.serialize(
                                response.sources
                            )
                            : null,
                    last_checked_at: this.now(),
                },
                where: {
                    request_id: requestId,
                },
            });

        if (updatedRows.length > 0) {
            return;
        }

        await this.postgresqlService.insertRow({
            table: TAVILY_RESEARCH_CALLS_TABLE,
            values: {
                request_id: requestId,
                input: null,
                model: null,
                stream: false,
                citation_format: null,
                output_length: null,
                include_domains: null,
                exclude_domains: null,
                files_payload: null,
                request_payload: null,
                create_response_payload: null,
                latest_response_payload:
                    this.serialize(response),
                status: response.status,
                tavily_created_at: response.created_at,
                response_time:
                    response.response_time ?? null,
                content_payload:
                    response.content !== undefined
                        ? this.serialize(
                            response.content
                        )
                        : null,
                sources_payload:
                    response.sources !== undefined
                        ? this.serialize(
                            response.sources
                        )
                        : null,
                logged_at: this.now(),
                last_checked_at: this.now(),
            },
        });
    }

    public async saveExtractCall(
        request: TavilyExtractRequest,
        response: TavilyExtractResponse
    ): Promise<string> {
        await this.ensureTables();

        const requestId =
            response.request_id ?? randomUUID();

        await this.postgresqlService.insertRow({
            table: TAVILY_EXTRACT_CALLS_TABLE,
            values: {
                request_id: requestId,
                urls: this.serialize(request.urls),
                query: request.query ?? null,
                chunks_per_source:
                    request.chunksPerSource ?? null,
                extract_depth:
                    request.extractDepth ?? "basic",
                include_images:
                    request.includeImages ?? false,
                include_favicon:
                    request.includeFavicon ?? false,
                format: request.format ?? "markdown",
                timeout_seconds:
                    request.timeout ?? null,
                request_payload: this.serialize({
                    urls: request.urls,
                    query: request.query,
                    chunks_per_source:
                        request.chunksPerSource,
                    extract_depth:
                        request.extractDepth ??
                        "basic",
                    include_images:
                        request.includeImages ?? false,
                    include_favicon:
                        request.includeFavicon ?? false,
                    format:
                        request.format ?? "markdown",
                    timeout: request.timeout,
                    include_usage:
                        request.includeUsage ?? false,
                }),
                response_payload:
                    this.serialize(response),
                result_count: response.results.length,
                failed_result_count:
                    response.failed_results.length,
                usage_credits:
                    response.usage?.credits ?? null,
                response_time:
                    response.response_time ?? null,
                logged_at: this.now(),
            },
        });

        return requestId;
    }

    public async saveCrawlCall(
        request: TavilyCrawlRequest,
        response: TavilyCrawlResponse
    ): Promise<string> {
        await this.ensureTables();

        const requestId =
            response.request_id ?? randomUUID();

        await this.postgresqlService.insertRow({
            table: TAVILY_CRAWL_CALLS_TABLE,
            values: {
                request_id: requestId,
                url: request.url,
                instructions:
                    request.instructions ?? null,
                chunks_per_source:
                    request.chunksPerSource ?? null,
                max_depth: request.maxDepth ?? 1,
                max_breadth:
                    request.maxBreadth ?? 20,
                limit_value: request.limit ?? 50,
                select_paths:
                    request.selectPaths !== undefined
                        ? this.serialize(
                            request.selectPaths
                        )
                        : null,
                select_domains:
                    request.selectDomains !== undefined
                        ? this.serialize(
                            request.selectDomains
                        )
                        : null,
                exclude_paths:
                    request.excludePaths !== undefined
                        ? this.serialize(
                            request.excludePaths
                        )
                        : null,
                exclude_domains:
                    request.excludeDomains !== undefined
                        ? this.serialize(
                            request.excludeDomains
                        )
                        : null,
                allow_external:
                    request.allowExternal ?? true,
                include_images:
                    request.includeImages ?? false,
                extract_depth:
                    request.extractDepth ?? "basic",
                format: request.format ?? "markdown",
                include_favicon:
                    request.includeFavicon ?? false,
                timeout_seconds:
                    request.timeout ?? 150,
                request_payload: this.serialize({
                    url: request.url,
                    instructions:
                        request.instructions,
                    chunks_per_source:
                        request.chunksPerSource,
                    max_depth:
                        request.maxDepth ?? 1,
                    max_breadth:
                        request.maxBreadth ?? 20,
                    limit: request.limit ?? 50,
                    select_paths:
                        request.selectPaths,
                    select_domains:
                        request.selectDomains,
                    exclude_paths:
                        request.excludePaths,
                    exclude_domains:
                        request.excludeDomains,
                    allow_external:
                        request.allowExternal ?? true,
                    include_images:
                        request.includeImages ?? false,
                    extract_depth:
                        request.extractDepth ??
                        "basic",
                    format:
                        request.format ?? "markdown",
                    include_favicon:
                        request.includeFavicon ?? false,
                    timeout:
                        request.timeout ?? 150,
                    include_usage:
                        request.includeUsage ?? false,
                }),
                response_payload:
                    this.serialize(response),
                result_count: response.results.length,
                usage_credits:
                    response.usage?.credits ?? null,
                response_time:
                    response.response_time ?? null,
                logged_at: this.now(),
            },
        });

        return requestId;
    }

    public async saveMapCall(
        request: TavilyMapRequest,
        response: TavilyMapResponse
    ): Promise<string> {
        await this.ensureTables();

        const requestId =
            response.request_id ?? randomUUID();

        await this.postgresqlService.insertRow({
            table: TAVILY_MAP_CALLS_TABLE,
            values: {
                request_id: requestId,
                url: request.url,
                instructions:
                    request.instructions ?? null,
                max_depth: request.maxDepth ?? 1,
                max_breadth:
                    request.maxBreadth ?? 20,
                limit_value: request.limit ?? 50,
                select_paths:
                    request.selectPaths !== undefined
                        ? this.serialize(
                            request.selectPaths
                        )
                        : null,
                select_domains:
                    request.selectDomains !== undefined
                        ? this.serialize(
                            request.selectDomains
                        )
                        : null,
                exclude_paths:
                    request.excludePaths !== undefined
                        ? this.serialize(
                            request.excludePaths
                        )
                        : null,
                exclude_domains:
                    request.excludeDomains !== undefined
                        ? this.serialize(
                            request.excludeDomains
                        )
                        : null,
                allow_external:
                    request.allowExternal ?? true,
                timeout_seconds:
                    request.timeout ?? 150,
                request_payload: this.serialize({
                    url: request.url,
                    instructions:
                        request.instructions,
                    max_depth:
                        request.maxDepth ?? 1,
                    max_breadth:
                        request.maxBreadth ?? 20,
                    limit: request.limit ?? 50,
                    select_paths:
                        request.selectPaths,
                    select_domains:
                        request.selectDomains,
                    exclude_paths:
                        request.excludePaths,
                    exclude_domains:
                        request.excludeDomains,
                    allow_external:
                        request.allowExternal ?? true,
                    timeout:
                        request.timeout ?? 150,
                    include_usage:
                        request.includeUsage ?? false,
                }),
                response_payload:
                    this.serialize(response),
                result_count: response.results.length,
                usage_credits:
                    response.usage?.credits ?? null,
                response_time:
                    response.response_time ?? null,
                logged_at: this.now(),
            },
        });

        return requestId;
    }

    private async initializeTables(): Promise<void> {
        const existingTables =
            new Set(
                await this.postgresqlService.listTables()
            );

        for (const table of this.tableDefinitions()) {
            if (existingTables.has(table.table)) {
                continue;
            }

            await this.postgresqlService.createTable(
                table
            );
        }
    }

    private tableDefinitions(): CreateTableRequest[] {
        return [
            {
                table: TAVILY_SEARCH_CALLS_TABLE,
                primaryKey: ["request_id"],
                columns: [
                    this.column("request_id", "TEXT", false),
                    this.column("query", "TEXT", false),
                    this.column("max_results", "INTEGER", false),
                    this.column("search_depth", "TEXT", false),
                    this.column("result_count", "INTEGER", false),
                    this.column("request_payload", "TEXT", false),
                    this.column("response_payload", "TEXT", false),
                    this.column("response_time", "REAL"),
                    this.column("usage_credits", "INTEGER"),
                    this.column("logged_at", "TIMESTAMP WITH TIME ZONE", false),
                ],
            },
            {
                table: TAVILY_RESEARCH_CALLS_TABLE,
                primaryKey: ["request_id"],
                columns: [
                    this.column("request_id", "TEXT", false),
                    this.column("input", "TEXT"),
                    this.column("model", "TEXT"),
                    this.column("stream", "BOOLEAN", false),
                    this.column("citation_format", "TEXT"),
                    this.column("output_length", "TEXT"),
                    this.column("include_domains", "TEXT"),
                    this.column("exclude_domains", "TEXT"),
                    this.column("files_payload", "TEXT"),
                    this.column("request_payload", "TEXT"),
                    this.column("create_response_payload", "TEXT"),
                    this.column("latest_response_payload", "TEXT"),
                    this.column("status", "TEXT", false),
                    this.column("tavily_created_at", "TIMESTAMP WITH TIME ZONE"),
                    this.column("response_time", "REAL"),
                    this.column("content_payload", "TEXT"),
                    this.column("sources_payload", "TEXT"),
                    this.column("logged_at", "TIMESTAMP WITH TIME ZONE", false),
                    this.column("last_checked_at", "TIMESTAMP WITH TIME ZONE"),
                ],
            },
            {
                table: TAVILY_EXTRACT_CALLS_TABLE,
                primaryKey: ["request_id"],
                columns: [
                    this.column("request_id", "TEXT", false),
                    this.column("urls", "TEXT", false),
                    this.column("query", "TEXT"),
                    this.column("chunks_per_source", "INTEGER"),
                    this.column("extract_depth", "TEXT", false),
                    this.column("include_images", "BOOLEAN", false),
                    this.column("include_favicon", "BOOLEAN", false),
                    this.column("format", "TEXT", false),
                    this.column("timeout_seconds", "REAL"),
                    this.column("request_payload", "TEXT", false),
                    this.column("response_payload", "TEXT", false),
                    this.column("result_count", "INTEGER", false),
                    this.column("failed_result_count", "INTEGER", false),
                    this.column("usage_credits", "INTEGER"),
                    this.column("response_time", "REAL"),
                    this.column("logged_at", "TIMESTAMP WITH TIME ZONE", false),
                ],
            },
            {
                table: TAVILY_CRAWL_CALLS_TABLE,
                primaryKey: ["request_id"],
                columns: [
                    this.column("request_id", "TEXT", false),
                    this.column("url", "TEXT", false),
                    this.column("instructions", "TEXT"),
                    this.column("chunks_per_source", "INTEGER"),
                    this.column("max_depth", "INTEGER"),
                    this.column("max_breadth", "INTEGER"),
                    this.column("limit_value", "INTEGER"),
                    this.column("select_paths", "TEXT"),
                    this.column("select_domains", "TEXT"),
                    this.column("exclude_paths", "TEXT"),
                    this.column("exclude_domains", "TEXT"),
                    this.column("allow_external", "BOOLEAN"),
                    this.column("include_images", "BOOLEAN"),
                    this.column("extract_depth", "TEXT"),
                    this.column("format", "TEXT"),
                    this.column("include_favicon", "BOOLEAN"),
                    this.column("timeout_seconds", "REAL"),
                    this.column("request_payload", "TEXT", false),
                    this.column("response_payload", "TEXT", false),
                    this.column("result_count", "INTEGER", false),
                    this.column("usage_credits", "INTEGER"),
                    this.column("response_time", "REAL"),
                    this.column("logged_at", "TIMESTAMP WITH TIME ZONE", false),
                ],
            },
            {
                table: TAVILY_MAP_CALLS_TABLE,
                primaryKey: ["request_id"],
                columns: [
                    this.column("request_id", "TEXT", false),
                    this.column("url", "TEXT", false),
                    this.column("instructions", "TEXT"),
                    this.column("max_depth", "INTEGER"),
                    this.column("max_breadth", "INTEGER"),
                    this.column("limit_value", "INTEGER"),
                    this.column("select_paths", "TEXT"),
                    this.column("select_domains", "TEXT"),
                    this.column("exclude_paths", "TEXT"),
                    this.column("exclude_domains", "TEXT"),
                    this.column("allow_external", "BOOLEAN"),
                    this.column("timeout_seconds", "REAL"),
                    this.column("request_payload", "TEXT", false),
                    this.column("response_payload", "TEXT", false),
                    this.column("result_count", "INTEGER", false),
                    this.column("usage_credits", "INTEGER"),
                    this.column("response_time", "REAL"),
                    this.column("logged_at", "TIMESTAMP WITH TIME ZONE", false),
                ],
            },
        ];
    }

    private column(
        name: string,
        dataType: string,
        nullable = true
    ) {
        return {
            name,
            dataType,
            nullable,
        };
    }

    private now(): string {
        return new Date().toISOString();
    }

    private serialize(
        value: unknown
    ): string {
        return JSON.stringify(value);
    }
}