export interface CreatePradmaUserRequest {
  name: string;
  email: string;
  role: string;
}

export type UpdatePradmaUserRequest = CreatePradmaUserRequest;
