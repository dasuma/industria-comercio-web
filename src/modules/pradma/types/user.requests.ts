export interface CreatePradmaUserRequest {
  id: string;
  email: string;
  role: string;
}

export type UpdatePradmaUserRequest = CreatePradmaUserRequest;
