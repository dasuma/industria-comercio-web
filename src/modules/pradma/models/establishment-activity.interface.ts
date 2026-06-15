export interface EstablishmentActivity {
  id: number;
  establishmentId: number;
  activityCode: string;
  valor: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
