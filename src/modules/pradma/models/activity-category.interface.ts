export interface ActivityCategory {
  id: number;
  activityTypeCode: string;
  activityTypeName: string;
  yearInitial: number;
  yearEnd: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
