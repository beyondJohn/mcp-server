import { ColumnDefinition } from "../../mcp/tools/postgresql/column-definition.js";
import { ForeignKeyDefinition } from "../../providers/postgresql/foreign-key-definition.js";
import type { PostgreSQLProvider } from "../../providers/postgresql/postgresql.provider.js";
import type { InsertRowRequest } from "../../providers/postgresql/insert-row-request.js";
import type { UpdateRowRequest } from "../../providers/postgresql/update-row-request.js";
import type { DeleteRowRequest } from "../../providers/postgresql/delete-row-request.js";
import type { CreateTableRequest } from "../../providers/postgresql/create-table-request.js";

export class PostgreSQLService {
    constructor(
        private readonly provider: PostgreSQLProvider
    ) { }

    public async query(
        sql: string
    ): Promise<Record<string, unknown>[]> {
        const normalized =
            sql.trim().toUpperCase();

        if (
            !normalized.startsWith("SELECT") &&
            !normalized.startsWith("WITH")
        ) {
            throw new Error(
                "Only read-only SQL queries are permitted."
            );
        }

        return this.provider.query(sql);
    }

    public async listTables(): Promise<string[]> {
        return this.provider.listTables();
    }

    public async describeTable(
        table: string
    ): Promise<ColumnDefinition[]> {
        return this.provider.describeTable(
            table
        );
    }

    public async listSchemas(): Promise<string[]> {
        return this.provider.listSchemas();
    }

    public async listIndexes(
        table?: string
    ) {
        return this.provider.listIndexes(table);
    }

    public async listForeignKeys(): Promise<ForeignKeyDefinition[]> {
        return this.provider.listForeignKeys();
    }

    public async insertRow(
        request: InsertRowRequest
    ): Promise<Record<string, unknown>> {
        return this.provider.insertRow(request);
    }

    public async updateRow(
        request: UpdateRowRequest
    ): Promise<Record<string, unknown>[]> {
        return this.provider.updateRow(request);
    }

    public async deleteRow(
        request: DeleteRowRequest
    ): Promise<Record<string, unknown>[]> {
        return this.provider.deleteRow(request);
    }

    public async createTable(
        request: CreateTableRequest
    ): Promise<void> {
        return this.provider.createTable(
            request
        );
    }
}