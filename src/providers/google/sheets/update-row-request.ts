export interface UpdateRowRequest {
  spreadsheetId: string;
  worksheet: string;
  matchColumn: string;
  matchValue: string;
  updates: Record<string, string>;
}