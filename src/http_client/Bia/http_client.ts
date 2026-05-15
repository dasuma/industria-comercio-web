import { HttpError } from '../base/http_client';
import type { ParamsFetch } from '../base/params';
import { buildRequestInit, buildUrl } from '../base/request';

const isServer = typeof window === 'undefined';
const DEFAULT_TIMEOUT_MS = 60_000;

// 401/403 → la cookie/token quedó inválida. Limpiamos sesión y mandamos al
// login. El refresh proactivo lo hace SessionProvider cada 50min con
// `getIdToken(true)`, así que cuando llegamos acá realmente la sesión
// expiró o fue invalidada server-side. En desarrollo no redirigimos para
// no romper el flow de debug.
const cleanSessionAndRedirect = async () => {
  if (isServer) return;
  if (process.env.NODE_ENV === 'development') return;
  const { destroySession } = await import('@/auth/sessionCookies');
  await destroySession();
  if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
    window.location.replace('/');
  }
};

export const doFetch = async <TBody = unknown, TResponse = unknown>(
  args: ParamsFetch<TBody>
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
      if (isUnauthorized) {
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
