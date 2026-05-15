export const REPORT_TYPES = ['DAILY', 'MONTHLY'] as const;
export const REPORT_KINDS = [
  'DEFAULT',
  'COMMERCIALIZATION',
  'COMMERCIALIZATION_BACKUP',
  'AGPE',
  'AGPE_BACKUP'
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportKind = (typeof REPORT_KINDS)[number];

export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NOTIFIED';

export interface CgmReport {
  id: number;
  xm_id: string;
  user_id: string;
  message: string;
  type: ReportType;
  status: ReportStatus;
  count_contract: number;
  kind: ReportKind;
  url: string;
  report_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportPayload {
  contractIds: number[];
  kind: ReportKind;
  type: ReportType;
  date?: string;
}

export interface CreateReportResponse {
  message: string;
  date: string;
  kind: string;
}

export interface PaginationMeta {
  total: number;
  previous: string | null;
  next: string | null;
  current_limit: number;
  current_offset: number;
  current_sort: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
