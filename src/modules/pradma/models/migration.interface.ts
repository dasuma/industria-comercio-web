export interface MigrationResult {
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  errors: string[];
}
