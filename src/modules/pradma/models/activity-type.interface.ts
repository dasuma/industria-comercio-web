export interface ActivityType {
  id: number;
  name: string;
  code: string;
  rate: number;
  activityCategoryId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
