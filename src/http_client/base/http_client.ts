export interface IHttpClient {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requiresAuthorization: boolean;
  requiresProfile?: boolean;
  headers?: Record<string, string>;
  isMocked: boolean;
  urlMock: string;
}

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  errors?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
    errors?: unknown;
  }) {
    super(opts.message);
    this.name = 'HttpError';
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
    this.errors = opts.errors;
  }
}
