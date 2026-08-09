import { Pool } from "pg";

import { Logger } from "../../logger/index.js";

import type { PostgreSQLConfig } from "./postgresql-config.js";
import type { ColumnDefinition } from "../../mcp/tools/postgresql/column-definition.js";
import type { ForeignKeyDefinition } from "./foreign-key-definition.js";
import type { InsertRowRequest } from "./insert-row-request.js";
import type { UpdateRowRequest } from "./update-row-request.js";
import type { DeleteRowRequest } from "./delete-row-request.js";
import type { CreateTableRequest } from "./create-table-request.js";

export class PostgreSQLProvider {
    private readonly pool: Pool;

    private validateIdentifier(
        identifier: string
    ): void {
        if (
            !/^[A-Za-z_][A-Za-z0-9_]*$/.test(
                identifier
            )
        ) {
            throw new Error(
                `Invalid PostgreSQL identifier: ${identifier}`
            );
        }
    }

    private validateDataType(
        dataType: string
    ): void {
        if (
            !/^[A-Za-z][A-Za-z0-9_]*(\s+(WITH|WITHOUT)\s+TIME\s+ZONE)?(\(\d+(,\s*\d+)?\))?(\[\])?$/.test(
                dataType.trim()
            )
        ) {
            throw new Error(
                `Invalid PostgreSQL data type: ${dataType}`
            );
        }
    }

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

    public async listIndexes(
        table?: string
    ): Promise<{
        schema: string;
        table: string;
        index: string;
        definition: string;
    }[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            table
                ? `Listing indexes for table ${table}.`
                : "Listing database indexes."
        );

        const result = await this.pool.query(
            `
    SELECT
      schemaname,
      tablename,
      indexname,
      indexdef
    FROM pg_catalog.pg_indexes
    WHERE schemaname = 'public'
  AND ($1::text IS NULL OR tablename = $1)
    ORDER BY schemaname, tablename, indexname;
    `,
            [table ?? null]
        );

        const indexes = result.rows.map(row => ({
            schema: row.schemaname as string,
            table: row.tablename as string,
            index: row.indexname as string,
            definition: row.indexdef as string,
        }));

        this.logger.info(
            "PostgreSQLProvider",
            `Found ${indexes.length} index(es).`
        );

        return indexes;
    }

    public async listForeignKeys(): Promise<ForeignKeyDefinition[]> {
        this.logger.debug(
            "PostgreSQLProvider",
            "Listing foreign keys."
        );

        const result = await this.pool.query(`
    SELECT
      n.nspname AS schema,
      c.relname AS table,
      a.attname AS column,
      rn.nspname AS referenced_schema,
      rc.relname AS referenced_table,
      ra.attname AS referenced_column,
      con.conname AS constraint_name
    FROM pg_constraint con
    JOIN pg_class c
      ON c.oid = con.conrelid
    JOIN pg_namespace n
      ON n.oid = c.relnamespace
    JOIN pg_class rc
      ON rc.oid = con.confrelid
    JOIN pg_namespace rn
      ON rn.oid = rc.relnamespace
    JOIN LATERAL unnest(con.conkey)
      WITH ORDINALITY AS cols(attnum, ord)
      ON true
    JOIN LATERAL unnest(con.confkey)
      WITH ORDINALITY AS refcols(attnum, ord)
      ON refcols.ord = cols.ord
    JOIN pg_attribute a
      ON a.attrelid = c.oid
     AND a.attnum = cols.attnum
    JOIN pg_attribute ra
      ON ra.attrelid = rc.oid
     AND ra.attnum = refcols.attnum
    WHERE con.contype = 'f'
      AND n.nspname = 'public'
    ORDER BY
      c.relname,
      con.conname,
      cols.ord;
  `);

        const foreignKeys =
            result.rows.map(row => ({
                schema: row.schema as string,
                table: row.table as string,
                column: row.column as string,
                referencedSchema:
                    row.referenced_schema as string,
                referencedTable:
                    row.referenced_table as string,
                referencedColumn:
                    row.referenced_column as string,
                constraintName:
                    row.constraint_name as string,
            }));

        this.logger.info(
            "PostgreSQLProvider",
            `Found ${foreignKeys.length} foreign key column(s).`
        );

        return foreignKeys;
    }

    public async insertRow(
        request: InsertRowRequest
    ): Promise<Record<string, unknown>> {
        const columns =
            Object.keys(request.values);

        if (columns.length === 0) {
            throw new Error(
                "At least one value is required."
            );
        }

        this.validateIdentifier(
            request.table
        );

        columns.forEach(column =>
            this.validateIdentifier(column)
        );

        const values =
            Object.values(request.values);

        const placeholders =
            values.map(
                (_, index) => `$${index + 1}`
            );

        const columnList =
            columns
                .map(column => `"${column}"`)
                .join(", ");

        const result =
            await this.pool.query(
                `
      INSERT INTO "${request.table}"
        (${columnList})
      VALUES
        (${placeholders.join(", ")})
      RETURNING *;
      `,
                values
            );

        this.logger.info(
            "PostgreSQLProvider",
            `Inserted ${result.rowCount ?? 0} row(s) into ${request.table}.`
        );

        return result.rows[0];
    }

    public async updateRow(
        request: UpdateRowRequest
    ): Promise<Record<string, unknown>[]> {
        const columns =
            Object.keys(request.values);

        const whereColumns =
            Object.keys(request.where);

        if (columns.length === 0) {
            throw new Error(
                "At least one value is required."
            );
        }

        if (whereColumns.length === 0) {
            throw new Error(
                "At least one WHERE condition is required."
            );
        }

        this.validateIdentifier(
            request.table
        );

        columns.forEach(column =>
            this.validateIdentifier(column)
        );

        whereColumns.forEach(column =>
            this.validateIdentifier(column)
        );

        const values =
            Object.values(request.values);

        const whereValues =
            Object.values(request.where);

        const updateAssignments =
            columns.map(
                (column, index) =>
                    `"${column}" = $${index + 1}`
            );

        const whereConditions =
            whereColumns.map(
                (column, index) =>
                    `"${column}" = $${values.length + index + 1
                    }`
            );

        const result =
            await this.pool.query(
                `
      UPDATE "${request.table}"
      SET ${updateAssignments.join(", ")}
      WHERE ${whereConditions.join(" AND ")}
      RETURNING *;
      `,
                [...values, ...whereValues]
            );

        this.logger.info(
            "PostgreSQLProvider",
            `Updated ${result.rowCount ?? 0} row(s) in ${request.table}.`
        );

        return result.rows;
    }

    public async deleteRow(
        request: DeleteRowRequest
    ): Promise<Record<string, unknown>[]> {
        const whereColumns =
            Object.keys(request.where);

        if (whereColumns.length === 0) {
            throw new Error(
                "At least one WHERE condition is required."
            );
        }

        this.validateIdentifier(
            request.table
        );

        whereColumns.forEach(column =>
            this.validateIdentifier(column)
        );

        const whereValues =
            Object.values(request.where);

        const whereConditions =
            whereColumns.map(
                (column, index) =>
                    `"${column}" = $${index + 1}`
            );

        const result =
            await this.pool.query(
                `
      DELETE FROM "${request.table}"
      WHERE ${whereConditions.join(" AND ")}
      RETURNING *;
      `,
                whereValues
            );

        this.logger.info(
            "PostgreSQLProvider",
            `Deleted ${result.rowCount ?? 0} row(s) from ${request.table}.`
        );

        return result.rows;
    }

    public async createTable(
        request: CreateTableRequest
    ): Promise<void> {
        if (request.columns.length === 0) {
            throw new Error(
                "At least one column is required."
            );
        }

        this.validateIdentifier(
            request.table
        );

        request.columns.forEach(column => {
            this.validateIdentifier(
                column.name
            );

            this.validateDataType(
                column.dataType
            );
            
        });

        const columnNames =
            new Set<string>();

        request.columns.forEach(column => {
            const normalized =
                column.name.toLowerCase();

            if (columnNames.has(normalized)) {
                throw new Error(
                    `Duplicate column name: ${column.name}`
                );
            }

            columnNames.add(normalized);
        });

        const primaryKey =
            request.primaryKey ?? [];

        primaryKey.forEach(column =>
            this.validateIdentifier(column)
        );

        for (const column of primaryKey) {
            if (!columnNames.has(column.toLowerCase())) {
                throw new Error(
                    `Primary key column does not exist: ${column}`
                );
            }
        }

        const definitions =
            request.columns.map(column => {
                const nullable =
                    column.nullable === false
                        ? " NOT NULL"
                        : "";

                return `"${column.name}" ${column.dataType}${nullable}`;
            });

        if (primaryKey.length > 0) {
            const primaryKeyColumns =
                primaryKey
                    .map(column => `"${column}"`)
                    .join(", ");

            definitions.push(
                `PRIMARY KEY (${primaryKeyColumns})`
            );
        }

        const sql = `
    CREATE TABLE "${request.table}" (
      ${definitions.join(",\n      ")}
    );
  `;

        this.logger.debug(
            "PostgreSQLProvider",
            `Creating table ${request.table}.`
        );

        await this.pool.query(sql);

        this.logger.info(
            "PostgreSQLProvider",
            `Created table ${request.table}.`
        );
    }
}