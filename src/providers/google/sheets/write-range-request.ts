export interface WriteRangeRequest {
  spreadsheetId: string;
  range: string;
  values: string[][];
}