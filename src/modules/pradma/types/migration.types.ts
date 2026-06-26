export interface MigrationResponse {
  table: string;
  total_records: number;
  inserted: number;
  skipped: number;
  errors: string[];
}
