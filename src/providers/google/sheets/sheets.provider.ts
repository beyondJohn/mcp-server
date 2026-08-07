import { google, sheets_v4 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

import type { WriteRangeRequest } from "./write-range-request.js";
import type { AppendRowsRequest } from "./append-rows-request.js";
import type { UpdateRowRequest } from "./update-row-request.js";

export class SheetsProvider {

    private readonly sheets: sheets_v4.Sheets;

    private get authClient() {
        return this.authProvider.getClient() as never;
    }

    constructor(
        private readonly authProvider: IGoogleAuthProvider,
        private readonly logger: typeof Logger
    ) {
        this.sheets = google.sheets({
            version: "v4",
            auth: this.authClient,
        });

        this.logger.info(
            "SheetsProvider",
            "Google Sheets client initialized."
        );
    }

    public async readRange(
        spreadsheetId: string,
        range: string
    ): Promise<string[][]> {
        this.logger.debug(
            "SheetsProvider",
            `Reading range ${range}.`
        );

        const response =
            await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

        const values =
            response.data.values ?? [];

        this.logger.info(
            "SheetsProvider",
            `Read ${values.length} rows.`
        );

        return values;
    }

    public async writeRange(
        request: WriteRangeRequest
    ): Promise<void> {
        this.logger.debug(
            "SheetsProvider",
            `Writing range ${request.range}.`
        );

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: request.spreadsheetId,
            range: request.range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: request.values,
            },
        });

        this.logger.info(
            "SheetsProvider",
            `Updated range ${request.range}.`
        );
    }

    public async appendRows(
        request: AppendRowsRequest
    ): Promise<void> {
        this.logger.debug(
            "SheetsProvider",
            `Appending rows to sheet ${request.worksheet}.`
        );

        await this.sheets.spreadsheets.values.append({
            spreadsheetId: request.spreadsheetId,
            range: `${request.worksheet}!A:Z`,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: request.values,
            },
        });

        this.logger.info(
            "SheetsProvider",
            `Appended ${request.values.length} row(s) to sheet ${request.worksheet}.`
        );
    }

    public async updateRow(
        request: UpdateRowRequest
    ): Promise<void> {
        this.logger.debug(
            "SheetsProvider",
            `Updating row in worksheet ${request.worksheet}.`
        );

        const range = `${request.worksheet}!A:ZZ`;

        const values = await this.readRange(
            request.spreadsheetId,
            range
        );

        if (values.length === 0) {
            throw new Error("Worksheet is empty.");
        }

        const headers = values[0];

        const matchColumnIndex =
            headers.indexOf(request.matchColumn);

        if (matchColumnIndex === -1) {
            throw new Error(
                `Column '${request.matchColumn}' not found.`
            );
        }

        const rowIndex = values.findIndex(
            (row, index) =>
                index > 0 &&
                row[matchColumnIndex] === request.matchValue
        );

        if (rowIndex === -1) {
            throw new Error(
                `No row found where ${request.matchColumn} = ${request.matchValue}.`
            );
        }

        const row = [...values[rowIndex]];

        for (const [column, value] of Object.entries(
            request.updates
        )) {
            const columnIndex = headers.indexOf(column);

            if (columnIndex === -1) {
                throw new Error(
                    `Column '${column}' not found.`
                );
            }

            row[columnIndex] = value;
        }

        const writeRange =
            `${request.worksheet}!A${rowIndex + 1}:ZZ${rowIndex + 1}`;

        await this.writeRange({
            spreadsheetId: request.spreadsheetId,
            range: writeRange,
            values: [row],
        });

        this.logger.info(
            "SheetsProvider",
            `Updated row ${rowIndex + 1}.`
        );
    }
}