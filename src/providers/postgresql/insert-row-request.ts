export interface InsertRowRequest {
  table: string;
  values: Record<string, unknown>;
}