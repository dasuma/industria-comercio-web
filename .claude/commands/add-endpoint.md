---
description: Agrega un endpoint a un módulo siguiendo el patrón doFetch + React Query. Crea el archivo, el endpoint en endpoints.ts y el barrel.
---

# /add-endpoint

Vas a agregar un endpoint nuevo a un módulo existente. El patrón está documentado en `docs/RECIPES.md` y en el módulo `_global/auth/` no aplica (Firebase only) — usa otros módulos como referencia o sigue las plantillas de abajo.

## Paso 1 — Recolectar requisitos

Si el usuario no incluyó argumentos completos, pregunta vía `AskUserQuestion`:

1. **Módulo destino** (verifica con `find src/modules -maxdepth 3 -type d -name "index.ts"` o `ls -R src/modules/` que exista). El módulo vive en `src/modules/{workspace}/{nombre}/` (plano) o `src/modules/{workspace}/{dominio}/{nombre}/` (anidado). Si no existe, sugiere `/add-module {nombre}` primero. A lo largo del comando, `{ruta-del-modulo}` se refiere a esta ruta completa.
2. **Nombre de la acción** (camelCase, ej. `getSites`, `createInvoice`, `updateProfile`).
3. **Tipo**: `Query` (lectura, cacheable) o `Mutation` (escritura, side effects).
4. **HTTP method**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
5. **URL del endpoint** (path relativo al `NEXT_PUBLIC_BACKEND_URL`, ej. `/ems-api/sites`).
6. **¿Requiere auth?** (default: `true`).
7. **Carpeta dentro de data/** (opcional, default es el nombre de la "feature": `list/`, `detail/`, `actions/`). Si no aplica, déjalo en `data/{action}.ts` directo.

## Paso 2 — Verificaciones previas

1. `cat {ruta-del-modulo}/data/endpoints.ts` — ver endpoints existentes.
2. Si el endpoint ya existe con la misma key, abortar y avisar.
3. `cat src/data/core/QueryKeys.ts` — ver el enum si es Query (vas a agregar key).

## Paso 3 — Generar archivos

### A) Actualizar `data/endpoints.ts`

Agrega la entrada al objeto `endpoints{Modulo}`:

```ts
{action}: {
  url: '{url}',
  method: '{METHOD}',
  requiresAuthorization: {true|false},
  isMocked: false,
  urlMock: ''
}
```

### B) Si es Query — agregar QueryKey

Edita `src/data/core/QueryKeys.ts` y suma:

```ts
{MODULO}_{ACTION} = '{modulo}.{action}'
```

### C) Crear archivo del endpoint

**`{ruta-del-modulo}/data/{feature}/{action}.ts`** (Query):

```ts
import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpoints{Modulo} } from '../endpoints';
import type { {ResponseType} } from '../../models/{modulo}.interface';

const {action} = (params?: {RequestType}) =>
  doFetch<{RequestType}, {ResponseType}>({
    endpoint: endpoints{Modulo}.{action},
    params
  });

export const use{Action} = (params?: {RequestType}) =>
  useQuery({
    queryKey: [QueryKeys.{MODULO}_{ACTION}, params],
    queryFn: () => {action}(params)
  });
```

**`{ruta-del-modulo}/data/{feature}/{action}.ts`** (Mutation):

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpoints{Modulo} } from '../endpoints';
import type { {RequestType}, {ResponseType} } from '../../types/{modulo}.types';

const {action} = (params: {RequestType}) =>
  doFetch<{RequestType}, {ResponseType}>({
    endpoint: endpoints{Modulo}.{action},
    params
  });

export const use{Action} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: {action},
    // TODO: invalidar queries relacionadas
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.{MODULO}_LIST] })
  });
};
```

### D) Actualizar `data/index.ts` (barrel)

Agregar:

```ts
export { use{Action} } from './{feature}/{action}';
```

### E) Crear o actualizar tipos

Si los tipos `{RequestType}` y `{ResponseType}` no existen:

- **Para entidades de dominio**: agregarlos a `models/{modulo}.interface.ts`.
- **Para DTOs request/response**: crear o actualizar `types/{modulo}.types.ts`.

Deja `// TODO` si no sabes los campos exactos — **nunca** uses `any`.

### F) Crear test co-localizado del endpoint

**Siempre** generá el test junto al archivo (`{action}.test.tsx`). El coverage threshold de `data/` lo enforcea en CI.

**Test para Query** (`{ruta-del-modulo}/data/{feature}/{action}.test.tsx`):

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
    doFetch.mockResolvedValueOnce(/* TODO: mock response */);

    const { result } = renderHook(() => use{Action}(/* TODO: params */), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(doFetch).toHaveBeenCalledWith({
      endpoint: expect.objectContaining({
        url: '{url}',
        method: '{METHOD}'
      }),
      params: /* TODO: expected params */
    });
  });
});
```

**Test para Mutation**: igual estructura, pero invocar la mutación con `result.current.mutate({...})` y esperar `isSuccess`.

Referencia funcionando: [src/modules/retention/contracts/data/findContractsByIds/findContractsByIds.test.tsx](../../src/modules/retention/contracts/data/findContractsByIds/findContractsByIds.test.tsx).

### G) Registrar threshold de coverage (solo la primera vez)

Si es el **primer endpoint con test** del módulo (chequear `data/**/*.test.*` con `find {ruta-del-modulo}/data -name "*.test.*"`), agregá la entrada a [jest.config.js](../../jest.config.js) en `coverageThreshold`:

```js
'./{ruta-del-modulo}/data/': {
  statements: 70,
  branches: 60,
  functions: 70,
  lines: 70
}
```

Si ya hay otros tests del módulo (entrada ya existe), no toques nada.

## Paso 4 — Validar

1. `npm run type-check` — sin errores.
2. `npm run lint` — sin warnings nuevos.
3. `npm run test:ci` — el nuevo test pasa y coverage threshold se cumple.

## Paso 5 — Reportar

- Archivos creados/modificados.
- Cómo usar el hook desde un componente o server component.
- Recordar al usuario: completar tipos `{RequestType}` y `{ResponseType}`, completar `onSuccess` con invalidaciones si es mutation.

## Anti-patterns a evitar

- **No** uses `axios`. **No** hagas `await response.json()` manual — usa el generic `doFetch<TBody, TResponse>`.
- **No** mezcles queries y mutations en un mismo archivo.
- **No** hardcodees URLs — siempre vía `endpoints.ts`.
- **No** olvides registrar el QueryKey en el enum central — sin él se rompe el tipado.
- **No** mergees un endpoint sin test — el coverage threshold de `data/` rompe el CI.

## Argumentos

$ARGUMENTS
