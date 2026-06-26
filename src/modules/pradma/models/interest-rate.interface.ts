export interface InterestRate {
  id: number;
  year: number;
  startDate: string;
  endDate: string;
  rateValue1: number;
  rateValue2: number;
  rateValue3: number;
  percentage: number;
  surchargePercentage: number;
  interestPercentage: number;
  createdAt: string;
  updatedAt: string;
}
