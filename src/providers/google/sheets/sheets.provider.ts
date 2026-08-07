import { google, sheets_v4 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

import type { WriteRangeRequest } from "./write-range-request.js";

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
}