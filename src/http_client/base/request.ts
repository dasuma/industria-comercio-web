import type { IHttpClient } from './http_client';
import type { ParamsFetch } from './params';
import { env } from '@/config/env';

const isServer = typeof window === 'undefined';
const METHODS_WITH_BODY = ['POST', 'PATCH', 'PUT', 'DELETE'];

const getSessionToken = async (): Promise<string | undefined> => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    return (await cookies()).get('bia_session')?.value;
  }
  const Cookies = (await import('js-cookie')).default;
  return Cookies.get('bia_session');
};

const getActiveLocale = async (defaultLocale = 'es'): Promise<string> => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    return (await cookies()).get('NEXT_LOCALE')?.value ?? defaultLocale;
  }
  const Cookies = (await import('js-cookie')).default;
  return Cookies.get('NEXT_LOCALE') ?? defaultLocale;
};

export const buildHeaders = async (
  endpoint: IHttpClient,
  token?: string
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'x-platform': 'web',
    'x-timezone': isServer ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone,
    'x-web-app-version': env.NEXT_PUBLIC_APP_VERSION ?? '',
    'Accept-Language': await getActiveLocale(),
    ...(process.env.NODE_ENV === 'development' && { 'x-user-id': 'dev-user' })
  };

  const isMultipart = endpoint.headers?.['Content-Type'] === 'multipart/form-data';
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (endpoint.requiresAuthorization) {
    const bearer = token ?? (await getSessionToken());
    if (bearer) headers.Authorization = bearer;
  }

  return { ...headers, ...(endpoint.headers ?? {}) };
};

export const buildBody = (endpoint: IHttpClient, params: unknown): BodyInit | undefined => {
  if (!METHODS_WITH_BODY.includes(endpoint.method)) return undefined;
  const isMultipart = endpoint.headers?.['Content-Type'] === 'multipart/form-data';
  if (isMultipart) return params as BodyInit;
  return JSON.stringify(params ?? {});
};

export const buildUrl = (endpoint: IHttpClient, value?: string, useBaseUrl = true): string => {
  const path = value ? `${endpoint.url}${value}` : endpoint.url;
  if (endpoint.isMocked) return endpoint.urlMock;
  if (!useBaseUrl) return path;
  // En el cliente usamos el proxy de Next.js para evitar CORS en desarrollo.
  // En el servidor (SSR/RSC) llamamos directo al backend con la URL real.
  const base = !isServer ? '/api/proxy' : env.NEXT_PUBLIC_BACKEND_URL;
  return `${base}${path}`;
};

export const buildRequestInit = async <TBody>(args: ParamsFetch<TBody>): Promise<RequestInit> => {
  const headers = await buildHeaders(args.endpoint, args.token);
  if (headers['Content-Type'] === 'multipart/form-data') {
    delete headers['Content-Type'];
  }

  const init: RequestInit = {
    method: args.endpoint.method,
    headers,
    body: buildBody(args.endpoint, args.params)
  };

  if (args.cache) init.cache = args.cache;
  if (args.next) (init as RequestInit & { next?: unknown }).next = args.next;

  return init;
};
