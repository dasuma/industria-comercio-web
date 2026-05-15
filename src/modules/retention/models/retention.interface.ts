export interface RetentionAdmin {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  country_code: string;
  number_identification: string;
  status: string;
}

export interface RetentionCompany {
  address: string;
  document_number: string;
  document_type: string;
  email: string;
  image_url: string;
  legal_representative: string;
  name: string;
  phone: string;
  referrer_code: string;
  taxpayer_type: string;
}

export interface RetentionContractUser {
  email: string;
  id: string;
  role_id: number;
  billing_email: boolean;
}

export interface RetentionContract {
  id: number;
  name: string;
  name_xm: string;
  address: string;
  address_id: number;
  city: string;
  country: string;
  company_id: number;
  admin: RetentionAdmin;
  company: RetentionCompany;
  users: RetentionContractUser[];
  billing_ends_at: string | null;
  capacity: number;
  consumption_average: number;
  contribution_exempt: boolean;
  created_at: string;
  current: boolean;
  factor_current: number;
  factor_energy: number;
  factor_power: number;
  factor_voltage: number;
  ids: number[];
  iva_exempt: boolean;
  is_commercial: boolean;
  is_urban: boolean;
  last_marketer: string;
  last_marketer_code: string;
  latitude: number;
  lead_id: number;
  longitude: number;
  meter_id: number;
  meter_is_integrated: boolean;
  meter_has_realtime: boolean;
  niu: string;
  provider: string;
  rate_id: number;
  role_id: number;
  sic: string;
  sic_agpe: string;
  sui: string;
  service_cut: boolean;
  smart_monitor: boolean;
  social_stratum: number;
  solar_capacity: number;
  solar_starts_at: string;
  source: string;
  starts_at: string;
  activation_status: string;
  installation_status: string;
  tension_level: number;
  nominal_voltage: number;
  phase_count: number;
  timezone: string;
  updated_at: string;
  with_reactive_charges: boolean;
  has_renewable_energy: boolean;
  internal_bia_code: string;
}

export interface ContractRec {
  id: number;
  contract_id: number;
  rec_value: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
}

export interface FindContractsByIdsPayload {
  ids: number[];
}

export interface FindContractsByIdsResponse {
  contracts: RetentionContract[];
}

export interface GetContractRatesParams {
  contract_id: number;
}

export interface ContractRate {
  id: number;
  contract_id: number;
  kind: string;
  stratum: number;
  level_tension: number;
  level_tension_name: string;
  city: number;
  city_name: string;
  state_name: string;
  market: string;
  market_type: string;
  user_type: string;
  last_provider: string;
  last_operator: string;
  contribution: number;
  contribution_name: string;
  reactive_daily: boolean;
  cashback: number;
  compensation_reactive: boolean;
  discount: number;
  contracted_capacity: number;
  is_urban: boolean;
  sign: boolean;
  sign_date: string;
  pay_tax: boolean;
  pay_lighting: boolean;
  bill_type: string;
  taxpayer_type: string;
  fixed_rate: number;
  is_cot: boolean;
  is_service_fee: boolean;
  group_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
