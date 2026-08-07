import { ColumnDefinition } from "../../mcp/tools/postgresql/column-definition.js";
import type { PostgreSQLProvider } from "../../providers/postgresql/postgresql.provider.js";

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
}