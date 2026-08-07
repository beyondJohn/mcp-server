import { Pool } from "pg";

import { Logger } from "../../logger/index.js";

import type { PostgreSQLConfig } from "./postgresql-config.js";
import type { ColumnDefinition } from "../../mcp/tools/postgresql/column-definition.js";

export class PostgreSQLProvider {
    private readonly pool: Pool;

    constructor(
        config: PostgreSQLConfig,
        private readonly logger: typeof Logger
    ) {
        this.pool = new Pool({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
        });

        this.logger.info(
            "PostgreSQLProvider",
            "PostgreSQL client created."
        );
    }

    public async query(
        sql: string
    ): Promise<Record<string, unknown>[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            `Executing query: ${sql}`
        );

        const result =
            await this.pool.query(sql);

        this.logger.info(
            "PostgreSQLProvider",
            `Returned ${result.rows.length} row(s).`
        );

        return result.rows;
    }

    public async listTables(): Promise<string[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            "Listing database tables."
        );

        const result =
            await this.pool.query(
                `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
      `
            );

        const tables =
            result.rows.map(
                row => row.table_name as string
            );

        this.logger.info(
            "PostgreSQLProvider",
            `Found ${tables.length} table(s).`
        );

        return tables;
    }

    public async describeTable(
        table: string
    ): Promise<ColumnDefinition[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            `Describing table ${table}.`
        );

        const result =
            await this.pool.query(
                `
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position;
      `,
                [table]
            );

        const columns =
            result.rows.map(row => ({
                name: row.column_name,
                type: row.data_type,
                nullable:
                    row.is_nullable === "YES",
                defaultValue:
                    row.column_default,
            }));

        this.logger.info(
            "PostgreSQLProvider",
            `Found ${columns.length} column(s).`
        );

        return columns;
    }

    public async listSchemas(): Promise<string[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            "Listing database schemas."
        );

        const result =
            await this.pool.query(
                `
      SELECT schema_name
      FROM information_schema.schemata
      ORDER BY schema_name;
      `
            );

        const schemas =
            result.rows.map(
                row => row.schema_name as string
            );

        this.logger.info(
            "PostgreSQLProvider",
            `Found ${schemas.length} schema(s).`
        );

        return schemas;
    }

    public async dispose(): Promise<void> {
        this.logger.info(
            "PostgreSQLProvider",
            "Closing PostgreSQL connection pool."
        );

        await this.pool.end();
    }
}