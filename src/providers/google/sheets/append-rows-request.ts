export interface AppendRowsRequest {
  spreadsheetId: string;
  worksheet: string;
  values: string[][];
}