import type { SheetsProvider } from "../../providers/google/sheets/sheets.provider.js";

export class SheetsService {
  constructor(
    private readonly sheetsProvider: SheetsProvider
  ) {}

  public async readRange(
    spreadsheetId: string,
    range: string
  ): Promise<string[][]> {
    return this.sheetsProvider.readRange(
      spreadsheetId,
      range
    );
  }
}