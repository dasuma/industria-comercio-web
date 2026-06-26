export interface CreateDiscountRequest {
  year: number;
  start_date: string;
  end_date: string;
  percentage: number;
}

export interface UpdateDiscountRequest {
  year?: number;
  start_date?: string;
  end_date?: string;
  percentage?: number;
}
