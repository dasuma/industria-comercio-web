export interface SettlementActivityRequest {
  activity_code: string;
  annual_sales: number;
}

export interface CreateSettlementRequest {
  establishment_id: number;
  start_date: string;
  end_date: string;
  presentation_date: string;
  settlement_date: string;
  signs_billboards_tax?: boolean;
  fire_brigade_surcharge?: boolean;
  activities: SettlementActivityRequest[];
}

export interface SettlementActivityResponse {
  activity_code: string;
  activity_name: string;
  annual_sales: number;
  tariff_rate: number;
  tax: number;
  billboard_tax?: number;
  fire_brigade_tax?: number;
}

export interface SettlementRow {
  number: number;
  name: string;
  value: number;
  description: string;
}

export interface SettlementResponse {
  establishment_id: number;
  establishment_name: string;
  address: string;
  start_date: string;
  end_date: string;
  presentation_date: string;
  settlement_date: string;
  settlement_months: number;
  activities: SettlementActivityResponse[];
  rows: SettlementRow[];
}
