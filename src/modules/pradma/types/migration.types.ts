export interface MigrationResponse {
  total_records: number;
  success_records: number;
  failed_records: number;
  errors: string[];
}
