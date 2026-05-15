import { HttpError } from '../base/http_client';
import type { ParamsFetch } from '../base/params';
import { buildRequestInit, buildUrl } from '../base/request';
import { env } from '@/config/env';

const isServer = typeof window === 'undefined';
const DEFAULT_TIMEOUT_MS = 60_000;

const refreshSession = async (): Promise<boolean> => {
  if (isServer) return false;
  const Cookies = (await import('js-cookie')).default;
  const refreshToken = Cookies.get('bia_session_refresh');
  if (!refreshToken) return false;

  const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/bia-auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) return false;
  const data = await response.json();
  if (data?.access_token && data?.refresh_token) {
    Cookies.set('bia_session', data.access_token);
    Cookies.set('bia_session_refresh', data.refresh_token);
    return true;
  }
  return false;
};

const cleanSessionAndRedirect = async () => {
  if (isServer) return;
  if (process.env.NODE_ENV === 'development') return;
  const Cookies = (await import('js-cookie')).default;
  Cookies.remove('bia_session');
  Cookies.remove('bia_session_refresh');
  if (!window.location.pathname.includes('/login')) {
    window.location.replace('/login');
  }
};

export const doFetch = async <TBody = unknown, TResponse = unknown>(
  args: ParamsFetch<TBody> & { _isRetry?: boolean }
): Promise<TResponse> => {
  const url = buildUrl(args.endpoint, args.value, args.baseUrl ?? true);
  const init = await buildRequestInit(args);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      const isUnauthorized = response.status === 401 || response.status === 403;

      if (isUnauthorized && !args._isRetry && !args.endpoint.url.includes('refresh-token')) {
        const refreshed = await refreshSession();
        if (refreshed) {
          return doFetch<TBody, TResponse>({ ...args, _isRetry: true });
        }
        await cleanSessionAndRedirect();
      }

      const errorData = await response.json().catch(() => ({}));
      throw new HttpError({
        message: errorData.message ?? response.statusText ?? 'Request failed',
        status: response.status,
        code: errorData.code,
        details: errorData.details,
        errors: errorData.errors
      });
    }

    if (response.status === 204) return undefined as TResponse;
    return (await response.json()) as TResponse;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof HttpError) throw error;
    if ((error as Error).name === 'AbortError') {
      throw new HttpError({ message: 'Request timed out', status: 408 });
    }
    throw error;
  }
};
