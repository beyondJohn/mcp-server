import { google, sheets_v4 } from "googleapis";

import type { IGoogleAuthProvider } from "../../../auth/google-auth.interface.js";
import { Logger } from "../../../logger/index.js";

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
}