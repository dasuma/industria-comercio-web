import type { UserRole } from './shared';

export interface PradmaUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
