export interface CreateInterestRateRequest {
  year: number;
  start_date: string;
  end_date: string;
  rate_value_1: number;
  rate_value_2: number;
  rate_value_3: number;
  percentage: number;
  surcharge_percentage: number;
  interest_percentage: number;
}

export interface UpdateInterestRateRequest {
  year?: number;
  start_date?: string;
  end_date?: string;
  rate_value_1?: number;
  rate_value_2?: number;
  rate_value_3?: number;
  percentage?: number;
  surcharge_percentage?: number;
  interest_percentage?: number;
}
