---
name: bia-data-pattern
description: Patrón completo de la capa de datos (doFetch + endpoints + React Query). Usa este skill cuando vayas a hacer una llamada HTTP, definir un endpoint, o crear un hook de query/mutation.
---

# Capa de datos

El template tiene **una sola forma** de hacer fetch: `doFetch<TBody, TResponse>` envuelto en hooks de React Query. Sin axios, sin `fetch` directo en componentes.

## Pieza 1 — `doFetch`

`src/http_client/Bia/http_client.ts` exporta `doFetch`. Características:

- **Generics tipados**: `doFetch<TBody, TResponse>(...)` retorna `TResponse` ya parseado. **No hagas `await response.json()` manual.**
- **Isomorfo**: funciona en Server Components (lee cookies con `cookies()` de `next/headers`) y en Client Components (lee con `js-cookie`).
- **Headers automáticos**: `Authorization` (si `requiresAuthorization`), `Content-Type`, `Accept-Language`, `x-platform`, `x-timezone`, `x-web-app-version`.
- **Refresh token**: en cliente, intenta refresh una vez en 401/403; si falla, redirige a `/`.
- **Errores tipados**: lanza `HttpError { status, code, message, details, errors }`.
- **Soporte Next.js cache**: acepta `cache?: RequestCache` y `next?: { revalidate?, tags? }` para server-side data fetching cacheable.
- **Timeout**: 60s con `AbortController`.

Firma:

```ts
doFetch<TBody, TResponse>(args: {
  endpoint: IHttpClient;
  params?: TBody;
  value?: string;     // path param, ej. /sites/${id}
  token?: string;     // override del token
  baseUrl?: boolean;  // default true (prepend NEXT_PUBLIC_BACKEND_URL)
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}): Promise<TResponse>
```

## Pieza 2 — Endpoints

Cada módulo declara sus endpoints en `data/endpoints.ts`:

```ts
import type { IHttpClient } from '@/http_client';

const isMocked = false;

export const endpointsSites: Record<string, IHttpClient> = {
  list: {
    url: '/ems-api/sites',
    method: 'GET',
    requiresAuthorization: true,
    isMocked,
    urlMock: 'http://localhost:3001/sites'
  },
  detail: {
    url: '/ems-api/sites/', // path param se concatena vía `value`
    method: 'GET',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  }
};
```

**Reglas:**

- El **path** va en `url`. **Nunca** hardcodees el host completo.
- `requiresAuthorization: true` para endpoints autenticados.
- `isMocked` y `urlMock` permiten apuntar a un mock server local sin cambiar código.

## Pieza 3 — Query (lectura)

Un archivo por acción, en `data/{feature}/{action}.ts`:

```ts
// data/list/getSites.ts
import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsSites } from '../endpoints';
import type { Site } from '../../models/site.interface';

const getSites = () => doFetch<void, Site[]>({ endpoint: endpointsSites.list });

export const useGetSites = () =>
  useQuery({
    queryKey: [QueryKeys.SITES_LIST],
    queryFn: getSites
  });
```

## Pieza 4 — Mutation (escritura)

```ts
// data/actions/createSite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsSites } from '../endpoints';
import type { CreateSiteRequest, CreateSiteResponse } from '../../types/sites.types';

const createSite = (params: CreateSiteRequest) =>
  doFetch<CreateSiteRequest, CreateSiteResponse>({
    endpoint: endpointsSites.create,
    params
  });

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.SITES_LIST] })
  });
};
```

## Pieza 5 — Server Component (Next.js cache)

En un page o layout **server component**, llama `doFetch` directo y aprovecha el cache de Next:

```tsx
const SitesPage = async () => {
  const sites = await doFetch<void, Site[]>({
    endpoint: endpointsSites.list,
    next: { revalidate: 60, tags: ['sites'] }
  });
  // ...
};
```

Para invalidar luego desde una mutation server-side: `revalidateTag('sites')`.

## Pieza 6 — QueryKeys centralizados

`src/data/core/QueryKeys.ts` es un enum:

```ts
enum QueryKeys {
  SITES_LIST = 'sites.list',
  SITES_DETAIL = 'sites.detail',
  AUTH_PROFILE = 'auth.profile'
}
```

**Cualquier `useQuery` debe registrar su key aquí.** Esto permite invalidar consistentemente y evita strings mágicos.

## Pieza 7 — Tests del data layer

**Cada archivo de endpoint debe tener su test co-localizado** (`{action}.test.tsx`). El patrón: mockear `doFetch` y verificar que el hook lo llama con el endpoint y los params correctos. El coverage threshold de `data/` lo enforcea (ver [jest.config.js](../../../jest.config.js)).

**Template para Query** (`data/{feature}/{action}.test.tsx`):

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { use{Action} } from './{action}';

jest.mock('@/http_client', () => ({
  doFetch: jest.fn()
}));

const { doFetch } = jest.requireMock('@/http_client') as { doFetch: jest.Mock };

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestQueryClientWrapper';
  return Wrapper;
};

describe('use{Action}', () => {
  beforeEach(() => doFetch.mockReset());

  it('calls doFetch with the configured endpoint and params', async () => {
    doFetch.mockResolvedValueOnce([{ id: 1 }]);

    const { result } = renderHook(() => use{Action}({ /* params */ }), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(doFetch).toHaveBeenCalledWith({
      endpoint: expect.objectContaining({
        url: '{expected-url}',
        method: '{METHOD}'
      }),
      params: { /* expected params */ }
    });
    expect(result.current.data).toEqual([{ id: 1 }]);
  });

  // Si el hook tiene `enabled` condicional, agregar test que verifique
  // que doFetch NO se llama cuando la condición es falsa:
  it('does not fire the query when {condition}', () => {
    renderHook(() => use{Action}({ /* invalid params */ }), { wrapper: createWrapper() });
    expect(doFetch).not.toHaveBeenCalled();
  });
});
```

**Template para Mutation**: igual pero usando `result.current.mutate({...})` y `await waitFor(() => expect(result.current.isSuccess).toBe(true))`.

**Referencia funcionando**: [src/modules/retention/contracts/data/findContractsByIds/findContractsByIds.test.tsx](../../../src/modules/retention/contracts/data/findContractsByIds/findContractsByIds.test.tsx).

Cuando agregues el primer test al `data/` de un módulo nuevo, agregá la entrada al `coverageThreshold` en [jest.config.js](../../../jest.config.js):

```js
'./{ruta-del-modulo}/data/': { statements: 70, branches: 60, functions: 70, lines: 70 }
```

## Anti-patterns

| ❌                                                  | ✅                                                           |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `axios`                                             | `doFetch`                                                    |
| `fetch` directo en componente                       | `doFetch` con hook React Query                               |
| `await response.json()` después de doFetch          | Usa el generic `doFetch<T,R>`                                |
| `useEffect(() => fetch(...).then(setData))`         | `useQuery`                                                   |
| Strings de queryKey inline                          | `QueryKeys` enum                                             |
| `useQuery({ queryKey: ['sites'], queryFn })` ad-hoc | Hook `useGetSites()` reutilizable en `data/list/getSites.ts` |
| URL completa en componente                          | URL en `endpoints.ts`                                        |
| Endpoint sin test                                   | Test co-localizado mockeando `doFetch` (template arriba)     |

## Comando relacionado

Para agregar un endpoint nuevo: `/add-endpoint`. Pregunta módulo, acción, método, tipo (query/mutation) y **genera el test automáticamente** con el template de arriba.
