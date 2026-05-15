---
description: Crea un módulo nuevo con la arquitectura BIA (components, data, hooks, models, etc.). Pregunta interactivamente el nombre y qué carpetas necesita.
---

# /add-module

Vas a crear un módulo nuevo en `src/modules/{nombre}/` siguiendo la arquitectura del template.

## Paso 1 — Recolectar requisitos

Si el usuario no incluyó argumentos, pregunta vía `AskUserQuestion`:

1. **Nombre del módulo** (kebab-case, ej. `sites`, `invoices`, `energy-solutions`).
2. **¿Necesita capa de datos?** (`data/` con endpoints + React Query). Casi siempre sí.
3. **¿Necesita Zustand store?** (estado de UI persistente o cross-component). Solo si lo justifica — no por defecto.
4. **¿Necesita layouts propios?** (rutas con shell distinto). Solo si tiene varias páginas hermanas.

Si el usuario pasó argumentos en `$ARGUMENTS`, úsalos como nombre y pregunta solo lo que falte.

## Paso 2 — Generar la estructura

Crea esta estructura (siempre):

```
src/modules/{nombre}/
├── components/        # Componentes del módulo
├── dictionaries/
│   ├── es.ts          # diccionario base, exporta el tipo
│   ├── en.ts          # implementa el tipo
│   └── index.ts       # función getDict({locale})
├── hooks/             # Hooks específicos
├── models/
│   └── {nombre}.interface.ts   # Interfaces de dominio
├── utils/             # Helpers internos del módulo
└── index.ts           # Barrel exports
```

Agrega condicionalmente:

- Si **necesita data**: `data/endpoints.ts` + `data/index.ts`. Deja un comentario `// TODO: agregar tu primer endpoint con /add-endpoint {nombre} {accion}`.
- Si **necesita store**: `store/{nombre}.store.ts` con plantilla Zustand (`skipHydration: true`, `partialize`, selectores como funciones).
- Si **necesita types específicos** distintos del modelo: `types/{nombre}.types.ts`.
- Si **necesita layouts**: `layouts/` carpeta vacía con README.

## Paso 3 — Plantillas

Usa estas plantillas exactas, reemplazando `{nombre}` y `{Nombre}` (PascalCase):

**`dictionaries/es.ts`**:

```ts
export const {nombre}DictEs = {
  // TODO: agregar strings del módulo
};

export type {Nombre}Dictionary = typeof {nombre}DictEs;
```

**`dictionaries/en.ts`**:

```ts
import type { {Nombre}Dictionary } from './es';

export const {nombre}DictEn: {Nombre}Dictionary = {
  // TODO: agregar strings del módulo
};
```

**`dictionaries/index.ts`**:

```ts
import type { Locale } from '@/i18n/config';
import { {nombre}DictEs, type {Nombre}Dictionary } from './es';
import { {nombre}DictEn } from './en';

const dicts: Record<Locale, {Nombre}Dictionary> = {
  es: {nombre}DictEs,
  en: {nombre}DictEn
};

export const get{Nombre}Dict = (locale: Locale): {Nombre}Dictionary => dicts[locale] ?? dicts.es;
export type { {Nombre}Dictionary };
```

**`models/{nombre}.interface.ts`**:

```ts
export interface {Nombre} {
  id: string;
  // TODO: campos del dominio
}
```

**`index.ts` (barrel)**:

```ts
export { get{Nombre}Dict } from './dictionaries';
export type { {Nombre} } from './models/{nombre}.interface';
```

**`data/endpoints.ts`** (si data):

```ts
import type { IHttpClient } from '@/http_client';

const isMocked = false;

export const endpoints{Nombre}: Record<string, IHttpClient> = {
  // TODO: agregar endpoints. Patrón:
  // list: { url: '/api/{nombre}', method: 'GET', requiresAuthorization: true, isMocked, urlMock: '' }
};
```

**`store/{nombre}.store.ts`** (si store):

```ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface {Nombre}State {
  // TODO: definir estado
  reset: () => void;
}

export const use{Nombre}Store = create<{Nombre}State>()(
  persist(
    set => ({
      reset: () => set({})
    }),
    {
      name: '{nombre}-store',
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({}),
      skipHydration: true
    }
  )
);
```

## Paso 4 — Validar y reportar

1. Corre `npm run type-check` para validar que el módulo compila.
2. Reporta al usuario:
   - Carpetas creadas
   - Archivos generados
   - Próximos pasos sugeridos:
     - `/add-endpoint {modulo} {accion}` para conectar con el backend.
     - `/add-page` si el módulo va a tener una página propia. Si querés que aparezca en el sidebar, durante `/add-page` decí que sí cuando pregunte; si todavía no hay un workspace donde encaje, corré `/add-workspace` primero.
     - Llenar `dictionaries/es.ts` y `en.ts` con los strings reales del módulo.

## Anti-patterns a evitar

- **No** crees `services/` salvo que el usuario lo pida explícitamente — el patrón actual es `data/` con hooks de React Query.
- **No** generes componentes ni endpoints "de ejemplo" automáticamente. Solo la estructura.
- **No** uses `any` en plantillas. Si no sabes el tipo, deja `// TODO` con un comentario.
- **No** dupliques estructura existente — verifica con `ls src/modules/` antes de crear.

## Argumentos

$ARGUMENTS
