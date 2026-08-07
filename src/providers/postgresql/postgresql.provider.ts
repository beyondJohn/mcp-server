import { Client } from "pg";

import { Logger } from "../../logger/index.js";

import type { PostgreSQLConfig } from "./postgresql-config.js";

export class PostgreSQLProvider {
    private readonly client: Client;

    constructor(
        config: PostgreSQLConfig,
        private readonly logger: typeof Logger
    ) {
        this.client = new Client({
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

    public async connect(): Promise<void> {
        this.logger.debug(
            "PostgreSQLProvider",
            "Connecting to PostgreSQL."
        );

        await this.client.connect();

        this.logger.info(
            "PostgreSQLProvider",
            "Connected to PostgreSQL."
        );
    }

    public async disconnect(): Promise<void> {
        this.logger.debug(
            "PostgreSQLProvider",
            "Disconnecting from PostgreSQL."
        );

        await this.client.end();

        this.logger.info(
            "PostgreSQLProvider",
            "Disconnected from PostgreSQL."
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
            await this.client.query(sql);

        this.logger.info(
            "PostgreSQLProvider",
            `Returned ${result.rows.length} row(s).`
        );

        return result.rows;
    }
}