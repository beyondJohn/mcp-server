export interface DeleteRowRequest {
  table: string;
  where: Record<string, unknown>;
}