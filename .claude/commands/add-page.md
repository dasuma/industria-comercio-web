---
description: Crea una página en el App Router (server-first por defecto). Pregunta ruta, si es pública o protegida, y si necesita layout propio. Para pages protegidas pregunta si registrarla en el sidebar (shell) y, si sí, agrega la entrada al workspace, dictionaries y APP_ROUTES automáticamente.
---

# /add-page

Vas a crear una página nueva en el App Router siguiendo la convención server-first del template. Si la página es protegida, ofrecé además registrarla en la navegación del shell para que aparezca en el sidebar.

## Paso 1 — Recolectar requisitos

Si el usuario no incluyó argumentos completos, pregunta vía `AskUserQuestion`:

1. **¿Pública o protegida?**
   - **Pública**: va en `src/app/(public)/{ruta}/page.tsx`. Sin auth gate.
   - **Protegida**: va en `src/app/(app)/{ruta}/page.tsx`. Pasa por el guard del proxy.
2. **(solo si protegida) ¿Aparece en el sidebar?** Sí / No.
3. **(solo si NO aparece en sidebar, o es pública) Ruta** (sin barra inicial, ej. `sites`, `sites/[id]`, `dashboard/reports`).
4. **(solo si aparece en sidebar) Workspace destino**: leé `src/modules/_global/shell/models/workspaces.config.ts` para listar los workspaces disponibles. Mostralos como opciones; agrega una opción extra "Crear nuevo workspace" que termina la conversación con la sugerencia de correr `/add-workspace` primero.
5. **(solo si aparece en sidebar) Item key** (camelCase corto, ej. `cgm`, `bianetwork`, `dashboard`). Va a ser literal en `NavItemKey`.
6. **(solo si aparece en sidebar) Labels** ES / EN para el sidebar.
7. **(solo si aparece en sidebar) Icon** del item: pregunta sobre qué trata la sección y grepeá íconos relevantes de `@biaenergy/ui/icons` (ver paso 3 para el procedimiento). Sugerí 3-5 opciones Line.
8. **¿Necesita layout propio?** Solo si va a tener páginas hijas con shell distinto. La mayoría no.

**Constraint**: si registrás en el sidebar, la ruta DEBE ser `/{workspaceId}/{itemKey}`. No preguntes ruta libre en ese caso — derivala de workspace + key.

## Paso 2 — Verificaciones previas

1. Verificar que la ruta no existe (`ls src/app/(public)/{ruta}` o `ls src/app/(app)/{ruta}`).
2. Si tiene parámetros dinámicos (`[id]`), avisar que `params` es `Promise<{...}>` en Next 16. Las pages dinámicas NO se pueden registrar en el sidebar (porque el item necesita un href estático).
3. (Si registrás en nav) Verificar que el `NavItemKey` propuesto no exista en `src/modules/_global/shell/models/nav.types.ts`. Si existe, abortá y avisá que ya hay un item con esa key.

## Paso 3 — Sugerir íconos (solo si registrás en nav)

Procedimiento:

1. Pedile al user 1-3 keywords sobre la sección (ej. "facturas, dinero" → busca `Money`, `Bill`, `Wallet`).
2. Para cada keyword, corré:
   ```bash
   grep -oE 'Ri{Keyword}\w*Line' node_modules/@biaenergy/ui/dist/icons.d.ts | sort -u | head -10
   ```
3. Presentá 3-5 opciones Line al user vía `AskUserQuestion`. Marcá una como "(Recommended)" según semántica.
4. Una vez elegido el icon Line, NO pidas el Fill — los items del sidebar usan solo Line por R13. (Solo los workspaces necesitan Fill para el estado activo del trigger.)

## Paso 4 — Generar archivos

### A) Page file

#### Plantilla — Server Component básico (con dict del módulo si registrás en nav)

```tsx
import { getActiveLocale } from '@/i18n/getDictionary';
import { getShellDict } from '@modules/_global/shell';

const {Nombre}Page = async () => {
  const locale = await getActiveLocale();
  const dict = getShellDict(locale);

  return (
    <section className="space-y-2">
      <h1 className="text-title-h5 text-text-strong-950">{dict.items.{itemKey}}</h1>
      <p className="text-paragraph-sm text-text-sub-600">
        {dict.workspaces.{workspaceId}} · {dict.items.{itemKey}}
      </p>
    </section>
  );
};

export default {Nombre}Page;
```

#### Plantilla — Server Component (sin nav, dict global)

```tsx
import { getDictionary } from '@/i18n/getDictionary';

const {Nombre}Page = async () => {
  const dict = await getDictionary();

  return (
    <section className="space-y-4">
      <h1 className="text-title-h5 text-text-strong-950">{/* TODO: titulo */}</h1>
      {/* TODO: contenido */}
    </section>
  );
};

export default {Nombre}Page;
```

#### Plantilla — Con params dinámicos

```tsx
interface {Nombre}PageProps {
  params: Promise<{ id: string }>;
}

const {Nombre}Page = async ({ params }: {Nombre}PageProps) => {
  const { id } = await params;
  // ...
};
```

#### Plantilla — Con fetch en server (aprovechando cache de Next)

```tsx
import { doFetch } from '@/http_client';
import { endpoints{Modulo} } from '@modules/{modulo}/data/endpoints';

const {Nombre}Page = async () => {
  const data = await doFetch<void, {Tipo}[]>({
    endpoint: endpoints{Modulo}.list,
    next: { revalidate: 60, tags: ['{tag}'] }
  });

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
```

### B) Si registrás en nav, hay que tocar 4 archivos adicionales

**1. `src/config/routes.ts`** — agregar al objeto `APP_ROUTES`:

```ts
export const APP_ROUTES = {
  cgm: '/operaciones/cgm',
  bianetwork: '/growth/bianetwork',
  {itemKey}: '/{workspaceId}/{itemKey}'  // ← nuevo
} as const;
```

**2. `src/modules/_global/shell/models/nav.types.ts`** — extender la unión `NavItemKey`:

```ts
export type NavItemKey = 'cgm' | 'bianetwork' | '{itemKey}';
```

**3. `src/modules/_global/shell/dictionaries/es.ts` y `en.ts`** — agregar el label al objeto `items`:

```ts
items: {
  cgm: 'CGM',
  bianetwork: 'Bianetwork',
  {itemKey}: '{LabelEs}'   // o '{LabelEn}' en en.ts
} satisfies Record<NavItemKey, string>,
```

**4. `src/modules/_global/shell/models/workspaces.config.ts`** — agregar el item al workspace correspondiente:

```ts
import {
  // ...íconos existentes,
  {NewIconLine}                          // ← nuevo import
} from '@biaenergy/ui/icons';

export const workspaces: Workspace[] = [
  {
    id: '{workspaceId}',
    iconFill: ...,
    iconLine: ...,
    items: [
      // ...items existentes,
      { kind: 'item', key: '{itemKey}', href: APP_ROUTES.{itemKey}, icon: {NewIconLine} }  // ← nuevo
    ]
  },
  // ...otros workspaces
];
```

## Paso 5 — Layout opcional

Solo si el usuario lo pidió. Plantilla:

```tsx
import type { ReactNode } from 'react';

const {Nombre}Layout = ({ children }: { children: ReactNode }) => (
  <div className="...">{children}</div>
);

export default {Nombre}Layout;
```

## Paso 6 — Validar y reportar

1. Corré `npm run type-check`. Si falla por algún `satisfies Record<NavItemKey, string>` que no incluyó la nueva key, revisá los pasos B.2 y B.3.
2. Reportá:
   - Ruta creada y URL accesible.
   - (Si registró nav) Sidebar actualizado: workspace `{workspaceId}` ahora tiene `{itemKey}` con label "{LabelEs}".
   - Sugerencias de siguiente paso:
     - `/add-module {nombre}` si la página va a tener lógica de negocio significativa.
     - `/add-endpoint` si va a llamar al backend.
     - Para hacer la página realmente funcional, llenar el contenido del page file.

## Anti-patterns a evitar

- **No** marques el page como `'use client'` por defecto. Solo si tiene estado/efectos/handlers que lo justifican.
- **No** hardcodees strings. Usa `getDictionary()` o `getShellDict()` (si forma parte del shell) y agregá claves correspondientes.
- **No** uses `useEffect` para fetch si la data es server-side disponible — usá `doFetch` en el server component.
- **No** registres en nav una page con params dinámicos (`[id]`) — los items del sidebar son rutas estáticas.
- **No** agregues a `APP_ROUTES` algo que no sea kebab/camel y matchee con la `href`. La key del objeto debe coincidir con `NavItemKey`.
- **No** dupliques layouts — un page hereda automáticamente del layout más cercano hacia arriba.

## Argumentos

$ARGUMENTS
