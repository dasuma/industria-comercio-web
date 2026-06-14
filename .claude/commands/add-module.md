---
description: Crea un módulo nuevo con la arquitectura BIA (components, data, hooks, models, etc.). Pregunta interactivamente el nombre y qué carpetas necesita.
---

# /add-module

Vas a crear un módulo nuevo en `src/modules/{workspace}/{nombre}/` siguiendo la arquitectura del template. Todo módulo vive bajo un workspace; módulos sin workspace específico van en `_global/`.

## Paso 1 — Recolectar requisitos

Antes de preguntar, corré `ls src/modules/` para ver los workspaces existentes (carpetas como `_global/`, `operations/`, `growth/`, `retention/`, etc.).

Pregunta vía `AskUserQuestion`:

1. **Nombre del módulo** (kebab-case, ej. `sites`, `invoices`, `energy-solutions`).
2. **¿A qué workspace pertenece?** Ofrecé los workspaces que ya existen como carpetas en `src/modules/`. Opciones:
   - Cada workspace existente (`_global`, `operations`, `growth`, ...).
   - "Workspace nuevo" → pedir nombre. Antes de aceptar, decile al usuario que también necesita correr `/add-workspace` para registrarlo en la nav config.
   - "Sin workspace (global)" → va a `_global/`. Solo justificado para piezas pre-auth (auth) o cross-workspace (shell, layouts compartidos).
3. **¿Es submódulo de un dominio existente dentro del workspace?** Mostrá los subdirectorios del workspace elegido. Opciones:
   - "No, es plano" (default) → ruta `src/modules/{workspace}/{nombre}/`.
   - Si hay una carpeta de dominio candidata (existe como dominio y tiene 0-1 submódulos), ofrecer "Sí, bajo `{dominio}/`" → ruta `src/modules/{workspace}/{dominio}/{nombre}/`.
   - "Sí, crear dominio nuevo" → pedir el nombre del dominio (kebab-case). Solo aceptar si el usuario va a crear de inmediato un segundo submódulo hermano. Un dominio **solo se justifica con 2+ submódulos**.
4. **¿Necesita capa de datos?** (`data/` con endpoints + React Query). Casi siempre sí.
5. **¿Necesita Zustand store?** (estado de UI persistente o cross-component). Solo si lo justifica — no por defecto.
6. **¿Necesita layouts propios?** (rutas con shell distinto). Solo si tiene varias páginas hermanas.

Si el usuario pasó argumentos en `$ARGUMENTS`, úsalos como nombre y pregunta solo lo que falte.

**Reglas de agrupación**:

- La carpeta del **workspace** (`{workspace}/`) NO es un módulo — no tiene `index.ts`, ni `components/`. Solo agrupa.
- La carpeta del **dominio** (`{dominio}/`) tampoco — mismas reglas.
- Para código compartido entre hermanos del mismo dominio, módulo plano hermano (`{workspace}/{dominio}-shared/`).

## Paso 2 — Generar la estructura

La ruta base es:

- Módulo plano en workspace: `src/modules/{workspace}/{nombre}/`
- Submódulo anidado: `src/modules/{workspace}/{dominio}/{nombre}/` (si el dominio no existe, créalo como carpeta vacía — sin `index.ts`).

A partir de la ruta base, crea siempre esta estructura:

```
{ruta-base}/
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

1. Corre `npm run type-check` y `npm run lint` para validar que el módulo compila y respeta boundaries (los globs `src/modules/*/*/{layer}/**` y `src/modules/*/*/*/{layer}/**` cubren ambos formatos).
2. Reporta al usuario:
   - Ruta donde se creó el módulo (workspace plano o anidado bajo dominio).
   - Carpetas creadas.
   - Archivos generados.
   - Path del import público (`@modules/{workspace}/{nombre}` para flat, `@modules/{workspace}/{dominio}/{nombre}` para anidado).
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
