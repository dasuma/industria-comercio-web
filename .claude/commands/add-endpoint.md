---
description: Agrega un endpoint a un módulo siguiendo el patrón doFetch + React Query. Crea el archivo, el endpoint en endpoints.ts y el barrel.
---

# /add-endpoint

Vas a agregar un endpoint nuevo a un módulo existente. El patrón está documentado en `docs/RECIPES.md` y en el módulo `auth/` no aplica (Firebase only) — usa otros módulos como referencia o sigue las plantillas de abajo.

## Paso 1 — Recolectar requisitos

Si el usuario no incluyó argumentos completos, pregunta vía `AskUserQuestion`:

1. **Módulo destino** (verifica con `ls src/modules/` que exista). Si no existe, sugiere `/add-module {nombre}` primero.
2. **Nombre de la acción** (camelCase, ej. `getSites`, `createInvoice`, `updateProfile`).
3. **Tipo**: `Query` (lectura, cacheable) o `Mutation` (escritura, side effects).
4. **HTTP method**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
5. **URL del endpoint** (path relativo al `NEXT_PUBLIC_BACKEND_URL`, ej. `/ems-api/sites`).
6. **¿Requiere auth?** (default: `true`).
7. **Carpeta dentro de data/** (opcional, default es el nombre de la "feature": `list/`, `detail/`, `actions/`). Si no aplica, déjalo en `data/{action}.ts` directo.

## Paso 2 — Verificaciones previas

1. `cat src/modules/{modulo}/data/endpoints.ts` — ver endpoints existentes.
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

**`src/modules/{modulo}/data/{feature}/{action}.ts`** (Query):
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

**`src/modules/{modulo}/data/{feature}/{action}.ts`** (Mutation):
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

## Paso 4 — Validar

1. `npm run type-check` — sin errores.
2. `npm run lint` — sin warnings nuevos.

## Paso 5 — Reportar

- Archivos creados/modificados.
- Cómo usar el hook desde un componente o server component.
- Recordar al usuario: completar tipos `{RequestType}` y `{ResponseType}`, completar `onSuccess` con invalidaciones si es mutation.

## Anti-patterns a evitar

- **No** uses `axios`. **No** hagas `await response.json()` manual — usa el generic `doFetch<TBody, TResponse>`.
- **No** mezcles queries y mutations en un mismo archivo.
- **No** hardcodees URLs — siempre vía `endpoints.ts`.
- **No** olvides registrar el QueryKey en el enum central — sin él se rompe el tipado.

## Argumentos
$ARGUMENTS
