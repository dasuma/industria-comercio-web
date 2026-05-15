export interface CreateExampleRequest {
  title: string;
  body: string;
  userId: number;
}

export type CreateExampleResponse = {
  id: number;
} & CreateExampleRequest;
