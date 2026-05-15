import type { IHttpClient } from './http_client';

export interface ParamsFetch<TBody = unknown> {
  endpoint: IHttpClient;
  params?: TBody;
  value?: string;
  token?: string;
  baseUrl?: boolean;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}
