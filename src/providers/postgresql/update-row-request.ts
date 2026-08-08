export interface UpdateRowRequest {
  table: string;
  where: Record<string, unknown>;
  values: Record<string, unknown>;
}