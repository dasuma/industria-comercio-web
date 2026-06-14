import type { UserRole } from './shared';

export interface PradmaUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
