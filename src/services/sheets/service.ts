import type { SheetsProvider } from "../../providers/google/sheets/sheets.provider.js";
import type { WriteRangeRequest } from "../../providers/google/sheets/write-range-request.js";
import type { AppendRowsRequest } from "../../providers/google/sheets/append-rows-request.js";
import type { UpdateRowRequest } from "../../providers/google/sheets/update-row-request.js";

export class SheetsService {
    constructor(
        private readonly sheetsProvider: SheetsProvider
    ) { }


    public async readRange(
        spreadsheetId: string,
        range: string
    ): Promise<string[][]> {
        return this.sheetsProvider.readRange(
            spreadsheetId,
            range
        );
    }

    public async writeRange(
        request: WriteRangeRequest
    ): Promise<void> {
        return this.sheetsProvider.writeRange(request);
    }

    public async appendRows(
        request: AppendRowsRequest
    ): Promise<void> {
        return this.sheetsProvider.appendRows(request);
    }

    public async updateRow(
        request: UpdateRowRequest
    ): Promise<void> {
        return this.sheetsProvider.updateRow(request);
    }
}