export interface CreateSanctionRequest {
  year: number;
  percentage: number;
  min_sanction: number;
  min_sanction_alt: number;
}

export interface UpdateSanctionRequest {
  year?: number;
  percentage?: number;
  min_sanction?: number;
  min_sanction_alt?: number;
}
