export interface CreateTableColumn {
  name: string;
  dataType: string;
  nullable?: boolean;
}

export interface CreateTableRequest {
  table: string;
  columns: CreateTableColumn[];
  primaryKey?: string[];
}