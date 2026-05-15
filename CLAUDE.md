# CLAUDE.md — Reglas para Claude

> Documentación completa en [docs/](./docs/): [ARCHITECTURE](./docs/ARCHITECTURE.md), [CONVENTIONS](./docs/CONVENTIONS.md), [RECIPES](./docs/RECIPES.md).

## Stack rápido

Next.js 16 (App Router) + React 19 + TS 5 strict · Tailwind 4 + `@biaenergy/ui` · React Query 5 + Zustand 5 · `fetch` + `doFetch` · Zod 4 + RHF · Firebase Auth (Google) · i18n por cookie · Jest + RTL + Playwright.

## Referencia canónica funcionando

Antes de inventar un patrón, leé estos archivos — son la fuente de verdad ejecutable:

- **Módulo de ejemplo end-to-end**: [`src/modules/example/`](./src/modules/example/) y la página [`/examples`](<./src/app/(app)/examples/page.tsx>). Cubre data layer (query + mutation), form (RHF + Zod + toast), i18n, estados de UI (loading/empty/error/success), y barrel. Borrable cuando arranquen los módulos reales.
- **Auth real**: [`src/modules/auth/`](./src/modules/auth/) — Firebase + Zustand store + i18n.

## Slash commands disponibles

| Comando                | Para qué sirve                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `/add-module`          | Scaffold de un módulo nuevo (interactivo)                                                              |
| `/add-endpoint`        | Agregar endpoint con `doFetch` + React Query a un módulo existente                                     |
| `/add-page`            | Crear página en App Router. Para pages protegidas, opcionalmente la registra en el sidebar del shell   |
| `/add-workspace`       | Crear un workspace top-level nuevo en el shell (Operations, Growth, etc.) — sugiere íconos por keyword |
| `/add-component`       | Scaffold de un componente dentro de `components/` de un módulo (Server por defecto, con test)          |
| `/add-store`           | Crear un Zustand store en `store/` de un módulo (skipHydration, partialize, selectores individuales)   |
| `/add-hook`            | Crear un hook personalizado en `hooks/` de un módulo                                                   |
| `/review-architecture` | Revisar el código modificado contra las reglas del template                                            |

**Flujo típico** para un feature nuevo end-to-end:

1. `/add-workspace` (solo si no hay workspace donde encaje)
2. `/add-page` — la registra en el sidebar
3. `/add-module {nombre}` — lógica de negocio del feature
4. `/add-endpoint {modulo} {accion}` — conectar con backend

## Skills auto-cargables

Claude usa automáticamente estos skills cuando son relevantes:

- `bia-module-pattern` — estructura interna de un módulo (carpetas, responsabilidades).
- `bia-data-pattern` — patrón completo de la capa de datos (`doFetch`, endpoints, queries, mutations, server-side cache).
- `bia-i18n-pattern` — i18n por cookie, dictionaries globales y de módulo.

Si necesitas aplicar estos patrones manualmente, consulta los archivos en [.claude/skills/](./.claude/skills/).

## Reglas estrictas (resumen)

### Código

- Nunca `any`, `console.log`, código comentado, imports/variables sin usar, URLs hardcodeadas.
- Siempre `===`, `const`/`let`, tipos explícitos.
- `// @ts-ignore` y `// @ts-expect-error` prohibidos sin justificación.
- **Env vars**: usá `import { env } from '@/config/env'`. **Nunca** `process.env.X` directo (perderías la validación Zod del arranque).

### Componentes

- **Server Components por defecto.** `'use client'` solo si hay estado/efectos/handlers.
- Un componente por carpeta: `MiComp/index.tsx` + opcional `MiComp.test.tsx`.
- Clases con `cn()` de `@/utils/cn`.
- Tokens del DS (`text-text-strong-950`, etc.). **No** colores hardcodeados (`text-blue-500`).

### Data layer

- **Una sola forma de fetch**: `doFetch<TBody, TResponse>` envuelto en hooks de React Query. Sin axios, sin `fetch` directo.
- Endpoints en `data/endpoints.ts` por módulo, **nunca** URLs en componentes.
- QueryKeys en el enum central `src/data/core/QueryKeys.ts`. Sin strings mágicos.
- En **Server Components** llama `doFetch` directo y usa `next: { revalidate, tags }` para cachear.

### Estado

- **Server state** → React Query.
- **UI state global** → Zustand con `skipHydration: true`, `partialize` (solo lo necesario), selectores como funciones individuales.
- **Forms** → React Hook Form + Zod resolver.

### i18n

- Locale en cookie `NEXT_LOCALE`, **no en URL**.
- Server: `await getActiveLocale()` y `await getDictionary()`.
- Client: recibe `locale` por prop desde el server padre.
- Dictionaries por módulo en `modules/{name}/dictionaries/{es,en}.ts`.
- **Nunca** hardcodees strings de UI.

### Tests

- En **inglés** (describe, it, variables, comments).
- Patrones: `returns X when Y`, `handles X correctly`, `throws when X`.
- Co-localizados con el componente.
- Mockear `@biaenergy/ui` en tests unitarios (problema de transformación ESM).

### Git

- **Prohibido commitear directo en `main`.**
- Ramas: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`.
- **Commits**: conventional commits con type prefix obligatorio (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, etc.). Las reglas cosméticas (header length, period final, etc.) están desactivadas para que herramientas de AI (Cursor, Claude Code) puedan generar mensajes libremente — pero el `type:` es **obligatorio**, sin él commitlint rompe el commit. Detalle en [.cursor/rules/commits.mdc](./.cursor/rules/commits.mdc).
- `npm run commit` (Commitizen) si querés flujo guiado interactivo.
- Antes de PR: `npm run type-check && npm run lint && npm run build && npm test`.
- Al abrir PR, completar el [template](./.github/pull_request_template.md) — el checklist refleja estas reglas y el reviewer las verifica.

## QA — Antes de cada commit

```bash
npm run type-check
npm run lint
npm run build
npm test
```

O usa `/review-architecture` para chequeos semánticos además de lint.

## Performance — Reglas Vercel (codificadas en el template)

1. **Sin cascadas async**: `Promise.all` para fetches no dependientes.
2. **Server-first**: minimiza `'use client'`.
3. **Bundle**: `next/dynamic` para componentes pesados.
4. **Re-renders**: selectores Zustand individuales; sin funciones inline en hot paths.
5. **Lazy state init**: `useState(() => costoso())`.
6. **`useCallback`/`useMemo`** con criterio.

## Boundaries (enforced por ESLint)

Tres capas de reglas que ESLint bloquea automáticamente. Doc completa en [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) (sección Boundaries). **Antes de escribir un import, verificá estas reglas.**

### Capa 1 — Cross-module: solo barrel

Desde fuera de un módulo, solo se importa el `index.ts` (barrel).

```ts
// ✅ import { useGoogleSignIn } from '@modules/auth';
// ❌ import { useGoogleSignIn } from '@modules/auth/hooks/useGoogleSignIn';
```

Dentro del mismo módulo: rutas **relativas** (`./`, `../`). Nunca uses `@modules/X/...` para referirte al propio módulo.

### Capa 2 — Layers dentro de un módulo

Cada capa solo importa las que están más abajo en la jerarquía:

| Capa            | Puede importar                              |
| --------------- | ------------------------------------------- |
| `models/`       | nada del módulo                             |
| `dictionaries/` | nada del módulo                             |
| `data/`         | `models/` + `@/http_client` + libs externas |
| `store/`        | `models/` + libs externas                   |
| `hooks/`        | `models/`, `data/`, `store/`                |
| `components/`   | todas las anteriores                        |

Regla de oro: **`data/` no conoce la UI**. Si tenés tentación de importar un componente desde `data/`, o un store desde `data/`, estás violando la capa.

Las carpetas DEBEN llamarse exactamente así (`models`, `dictionaries`, `data`, `store`, `hooks`, `components`) — si nombrás distinto (`api/`, `state/`), ESLint no aplica las reglas y el módulo queda sin gobernanza.

### Capa 3 — Imports prohibidos

- `axios`, `cross-fetch`, `isomorphic-fetch` → `doFetch` desde `@/http_client`.
- `next/router` (deprecado en Next 16) → `next/navigation`.
- `console.log` → `console.warn` / `console.error`.

## Patrones prohibidos

- `useEffect` para derivar estado → variable computada o `useMemo`.
- Lógica de negocio en componentes UI → extrae a hooks o utils.
- Crear `services/` por costumbre → usar `data/` con React Query.
- Mezclar server state y UI state en el mismo store.

## Respuestas a usuarios

- Responder en español por defecto.
- Ser directo y conciso.
- Mostrar resumen breve al terminar.
- Para cambios grandes, proponer plan antes de ejecutar.
