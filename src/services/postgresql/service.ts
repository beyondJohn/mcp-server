import type { PostgreSQLProvider } from "../../providers/postgresql/postgresql.provider.js";

export class PostgreSQLService {
    constructor(
        private readonly provider: PostgreSQLProvider
    ) { }

    public async query(
        sql: string
    ): Promise<Record<string, unknown>[]> {
        await this.provider.connect();

        try {
            return await this.provider.query(sql);
        } finally {
            await this.provider.disconnect();
        }
    }
}