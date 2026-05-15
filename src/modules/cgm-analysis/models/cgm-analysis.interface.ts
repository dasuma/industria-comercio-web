export interface Contract {
  id: number;
  name: string;
  sic: string;
  sic_agpe?: string | null;
  starts_at?: string | null;
  billing_ends_at?: string | null;
  consumption_average?: number | null;
}

export type SearchContractField = 'id' | 'name' | 'sic';

export type SearchContractOperation = 'ilike' | 'eq';

export interface SearchContractsPayload {
  filters: Array<{
    field: SearchContractField;
    value: string;
    operation: SearchContractOperation;
    option: 'AND';
  }>;
  paginate: {
    limit: number;
    offset: number;
    sort: string;
  };
}

export interface SearchContractsResponse {
  data: Contract[];
}

export interface RefillPayload {
  contract_ids: number[];
  start_date: string;
  end_date: string;
  delete_only: boolean;
  reason: string;
}

export interface RefillResponse {
  message: string;
}

export interface WidgetTrend {
  value: number;
  value_str: string;
  direction: 'up' | 'down';
  color: 'red' | 'green';
}

export interface TextWidget {
  type: 'text';
  header: string;
  value: number;
  value_str: string;
  kind: string;
  subheader: string;
  note?: string;
  description?: string;
  icon?: string;
  index: number;
  trend?: WidgetTrend;
  grid_columns: number;
}

export interface GraphSeriesItem {
  title: string;
  value: string;
  description?: string;
}

export interface GraphSeries {
  data: number[];
  color: string;
  name: string;
  type: string;
  dropdown_type?: string;
  note?: string;
  tooltip_data?: GraphSeriesItem[];
}

export interface GraphWidget {
  type: 'graph';
  header: string;
  kind: string;
  icon?: string;
  graph?: {
    x_axis?: { data: string[]; name: string };
    y_axis?: { title: string; unit: string };
    call_to_action?: { icon: string; text: string; call_to_action: string };
    kind?: string;
    series?: GraphSeries[];
  };
  grid_columns: number;
}

export type Widget = TextWidget | GraphWidget;
export type WidgetsResponse = Widget[];

export interface WidgetsPayload {
  period: 'monthly';
  date: string;
  contract_ids: number[];
}

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
