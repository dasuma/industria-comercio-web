import type { IHttpClient } from './http_client';
import type { ParamsFetch } from './params';
import { env } from '@/config/env';
import { SESSION_TOKEN_COOKIE, SESSION_USER_ID_COOKIE } from '@/auth/sessionCookies';

const isServer = typeof window === 'undefined';
const METHODS_WITH_BODY = ['POST', 'PATCH', 'PUT', 'DELETE'];
const PROFILE_STORAGE_KEY = 'olibia_session_profile';

// Lee el ID token desde la cookie httpOnly. SOLO en server (RSC/route handlers)
// — el browser NO puede leer cookies httpOnly por diseño. En cliente
// devolvemos undefined a propósito: Authorization se inyecta por el proxy
// `/api/proxy/[...path]/route.ts` server-side cuando la request pasa por
// ahí (que es el caso para todo doFetch desde cliente).
const getSessionToken = async (): Promise<string | undefined> => {
  if (!isServer) return undefined;
  const { cookies } = await import('next/headers');
  return (await cookies()).get(SESSION_TOKEN_COOKIE)?.value;
};

// `x-user-id` viene de localStorage en cliente (perfil persistido por el
// Zustand store con key `olibia_session_profile`). En server (SSR/RSC) cae
// a la cookie httpOnly `olibia_session_userId`, que sí es legible
// server-side via next/headers.
const getProfileUserId = async (): Promise<string | undefined> => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    return (await cookies()).get(SESSION_USER_ID_COOKIE)?.value;
  }
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { state?: { user?: { id?: string } } };
    return parsed?.state?.user?.id;
  } catch {
    return undefined;
  }
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
    'Accept-Language': await getActiveLocale()
  };

  const isMultipart = endpoint.headers?.['Content-Type'] === 'multipart/form-data';
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (endpoint.requiresAuthorization) {
    const bearer = token ?? (await getSessionToken());
    // En cliente bearer será undefined (cookie httpOnly inaccesible) — el
    // proxy de Next se encarga de inyectar Authorization server-side antes
    // de reenviar al backend BIA.
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
  }

  if (endpoint.requiresProfile) {
    const userId = await getProfileUserId();
    if (userId) headers['x-user-id'] = userId;
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
  // En el cliente usamos el proxy de Next.js: evita CORS en desarrollo Y
  // permite que el server inyecte Authorization desde la cookie httpOnly
  // (el JS del cliente no tiene acceso al token). En server (SSR/RSC)
  // llamamos directo al backend con la URL real.
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
