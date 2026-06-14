export interface EstablishmentActivity {
  id: number;
  establishmentId: number;
  activityTypeId: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
