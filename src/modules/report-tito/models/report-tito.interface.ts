export const REPORT_PERIODS = ['15m', 'daily', 'weekly', 'monthly'] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

export interface ReportPayload {
  contract_id: number;
  start_date: string;
  end_date: string;
  period: ReportPeriod;
}

export interface ReportResponse {
  response: string;
  pdf_url: string;
}
