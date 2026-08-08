import type { SheetsProvider } from "../../providers/google/sheets/sheets.provider.js";
import type { WriteRangeRequest } from "../../providers/google/sheets/write-range-request.js";
import type { AppendRowsRequest } from "../../providers/google/sheets/append-rows-request.js";
import type { UpdateRowRequest } from "../../providers/google/sheets/update-row-request.js";

export class SheetsService {
    constructor(
        private readonly provider: SheetsProvider
    ) { }


    public async readRange(
        spreadsheetId: string,
        range: string
    ): Promise<string[][]> {
        return this.provider.readRange(
            spreadsheetId,
            range
        );
    }

    public async writeRange(
        request: WriteRangeRequest
    ): Promise<void> {
        return this.provider.writeRange(request);
    }

    public async appendRows(
        request: AppendRowsRequest
    ): Promise<void> {
        return this.provider.appendRows(request);
    }

    public async updateRow(
        request: UpdateRowRequest
    ): Promise<void> {
        return this.provider.updateRow(request);
    }

    public async createSpreadsheet(
        title: string
    ): Promise<{
        spreadsheetId: string;
        spreadsheetUrl: string;
    }> {
        return this.provider.createSpreadsheet(
            title
        );
    }
}