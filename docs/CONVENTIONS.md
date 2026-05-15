# Convenciones

Reglas de código, naming y proceso. Para arquitectura ver [ARCHITECTURE.md](./ARCHITECTURE.md). Para recetas ver [RECIPES.md](./RECIPES.md).

## TypeScript

- **Strict mode**: activado. **Nunca** `any` — siempre tipo explícito o `unknown` con narrowing.
- `**type` vs `interface`\*\*: `interface` para entidades de dominio (`User`, `Site`); `type` para uniones, tuplas, mapped types.
- **Imports**: usa path aliases (`@modules/`_, `@/utils/_`). Nunca `../../../`.
- `**// @ts-ignore` y `// @ts-expect-error`\*\* prohibidos sin un comentario justificando el caso y un TODO de resolución.

## Componentes

- **Server Components por defecto.** `'use client'` solo si:
  - Usa `useState`, `useEffect`, `useRef`, otros hooks de React.
  - Usa contexts cliente (Theme, Auth, Query).
  - Tiene event handlers (`onClick`, `onChange`).
  - Usa `next/router` o `next/navigation` hooks.
- **Un componente por carpeta**: `MiComp/index.tsx` + opcional `MiComp.test.tsx`.
- **Nombres**: PascalCase para componentes. Carpeta = nombre del componente.
- **Props**: tipa con `interface`. Si es 1 prop trivial, inline `({ x }: { x: string })` está bien.
- **Children**: `ReactNode`, no `JSX.Element`.

## Estilos

- **Tailwind primero**, SCSS solo cuando justifica (animaciones complejas, mixins compartidos).
- **Combinar clases**: `cn()` de `@/utils/cn`.
- **Tokens del DS**: usa `text-text-strong-950`, `bg-bg-white-0`, `border-stroke-soft-200`, etc. (vienen de `@biaenergy/ui/tokens.css`). **No** uses colores hardcodeados (`text-blue-500`).
- **Dark mode**: clase `.dark` en `<html>` (lo maneja `next-themes`). En componentes usa variantes `dark:` solo si el token no se adapta solo.

> Para decisiones de UI (qué componente, qué jerarquía de botones, qué patrón de form, qué token semántico) la fuente única es [`DESIGN.md`](./DESIGN.md). Las reglas tienen IDs estables (`R1`…`R13`, `AP1`…) — citalos en commits/PRs cuando una elección no sea obvia.

## Estado

- **Server state** → React Query (`useQuery`, `useMutation`).
- **UI state local** → `useState`.
- **UI state global** → Zustand store en `modules/{name}/store/`.
- **Forms** → React Hook Form + Zod resolver.
- **No mezclar**: un dato del backend vive en React Query, no en Zustand. Zustand solo lo que es UI (sidebar abierto, filtros activos, etc.) o sesión derivada.

## Zustand

```ts
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create<State>()(
  persist(
    set => ({
      /* ... */
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user }), // solo persistir lo necesario
      skipHydration: true // SSR safe
    }
  )
);

// Selectores como funciones individuales:
export const selectUser = (s: State) => s.user;

// Uso: useStore(selectUser) — re-render solo cuando user cambia
```

## Naming

| Caso               | Convención                             | Ejemplo                             |
| ------------------ | -------------------------------------- | ----------------------------------- |
| Componentes        | PascalCase                             | `LoginGoogleButton`                 |
| Hooks              | `use{Action}` camelCase                | `useGetSites`, `useLoginWithGoogle` |
| Stores             | `use{Module}Store`                     | `useAuthStore`                      |
| Endpoints (objeto) | `endpoints{Module}`                    | `endpointsSites`                    |
| QueryKeys (enum)   | `MODULE_ACTION` upper snake            | `SITES_LIST`                        |
| Models (interface) | PascalCase singular                    | `Site`, `Invoice`                   |
| DTOs               | `{Action}{Request                      | Response}`                          |
| Dictionaries       | `{module}Dict{Locale}`                 | `sitesDictEs`                       |
| `WorkspaceKey`     | camelCase corto, sin prefijo           | `operaciones`, `growth`, `finanzas` |
| `NavItemKey`       | camelCase corto, sin prefijo           | `cgm`, `bianetwork`, `reportes`     |
| Archivos           | kebab-case (carpetas), camelCase (.ts) | `modules/sites/`, `getSites.ts`     |
| Tests              | `{Component}.test.tsx` co-localizado   | `LoginGoogleButton.test.tsx`        |

> **Nota sobre `WorkspaceKey` / `NavItemKey`**: son uniones literales en `src/modules/shell/models/nav.types.ts` que **deben matchear** los keys de `dictionaries.workspaces` / `dictionaries.items` (validado por `satisfies Record<...>`). Cada key también es la última parte del path en `APP_ROUTES` (ej. `cgm` → `/operaciones/cgm`). No uses `_` ni guiones — solo letras/dígitos. Ver detalle en [ARCHITECTURE.md § Shell](./ARCHITECTURE.md#shell-navegación).

## Tests

- **En inglés**: `describe`, `it`, variables, comments.
- **Patrones de naming**: `returns X when Y`, `handles X correctly`, `throws when X`.
- **Co-localización**: `Component.tsx` + `Component.test.tsx` en la misma carpeta.
- **Mockear el design system** en tests unitarios para evitar problemas de transformación ESM:
  ```ts
  jest.mock('@biaenergy/ui', () => ({
    Button: { Root: ({ children, ...p }: any) => <button {...p}>{children}</button>, Icon: () => null }
  }));
  ```
- **No mockear** lo que estás probando. Mockea solo dependencias externas (red, fs, libs pesadas).
- **Coverage**: 80%+ para código nuevo. No es bloqueo para legacy.

## Commits

- **Conventional Commits** vía `npm run commit` (Commitizen + cz-git).
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scope opcional, en kebab-case y consistente: `feat(sites): list endpoint`, `fix(auth): logout redirect`.
- Cuerpo: explicar el **why**, no el **what** (el diff dice qué cambió).

## Branches

- **Prohibido commitear directo a `main`.**
- Naming: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`.
- **Nunca** `git push --force` a `main`.

## Pre-commit

`husky` + `lint-staged` corren `eslint --fix` y `prettier --write` sobre archivos staged. Si fallan, el commit se cancela.

## Antes de PR

```bash
npm run type-check
npm run lint
npm run build
npm test
npm run test:e2e   # opcional si solo cambiaste UI
```

O usa `/review-architecture` (slash command de Claude) para verificar reglas semánticas además de lint.

## Accesibilidad

- Labels en todos los inputs (`<Label htmlFor>` o `aria-label`).
- Alt text en imágenes (`""` para decorativas).
- Roles ARIA cuando el HTML semántico no alcanza.
- Contraste suficiente (los tokens del DS ya lo garantizan; si te sales del DS, valida con DevTools).

## Performance — Reglas

1. **Sin cascadas async**: `Promise.all` para fetches no dependientes.
2. **Server-first**: minimiza `'use client'`.
3. **Bundle**: `next/dynamic` para componentes pesados (charts, editores).
4. **Re-renders**: selectores Zustand individuales; evita funciones inline en hot paths.
5. **Lazy state init**: `useState(() => costoso())`.
6. `**useCallback`/`useMemo`\*\* con criterio (no por defecto).

## Patrones prohibidos

- `useEffect` para derivar estado → variable computada o `useMemo`.
- `console.log` en código productivo (solo `console.warn`/`console.error`).
- URLs de backend hardcodeadas → `endpoints.ts` o `process.env`.
- URLs de rutas hardcodeadas (`/operaciones/cgm`, `/home`, etc.) → constantes de [`src/config/routes.ts`](../src/config/routes.ts) (`APP_ROUTES.cgm`, `DEFAULT_AUTHED_ROUTE`, `PUBLIC_ROUTES.login`).
- Strings de UI hardcodeados → diccionario.
- `axios` → `doFetch`.
- `var` → `const`/`let`. `==` → `===`.
- Imports cross-module por path interno (`@modules/A/components/X`) → solo barrel (`@modules/A`).
- Lógica de negocio en componentes UI → extrae a hooks o utils.

## Boundaries

Las reglas de esta sección están **enforced por ESLint** (`eslint.config.mjs`). Si rompés una, falla el lint y no podés mergear (gate en CI + pre-commit).

Tres capas de boundaries, en orden de importancia:

### Capa 1 — Cross-module: solo barrel

Desde fuera de un módulo solo se puede importar **el barrel**, nunca un path interno.

```ts
// ✅ Bien
import { LoginGoogleButton, useGoogleSignIn } from '@modules/auth';

// ❌ Mal — bloqueado por ESLint
import { LoginGoogleButton } from '@modules/auth/components/LoginGoogleButton';
import { useGoogleSignIn } from '@modules/auth/hooks/useGoogleSignIn';
```

**Por qué**: cada módulo declara su API pública en su `index.ts`. Si algo no está exportado en el barrel, no es público — podés refactorizarlo sin miedo a romper consumidores externos.

**Dentro del mismo módulo**: usá rutas relativas (`./components/X`, `../hooks/Y`). Nunca uses el alias `@modules/X/...` para referirte al propio módulo (ESLint lo bloquea como si fuera cross-module).

Esto aplica a `src/app/`, otros módulos, tests, e2e — cualquier archivo fuera de `src/modules/X/`.

### Capa 2 — Layers dentro de un módulo

Dentro de un módulo hay una jerarquía. Cada capa solo puede importar las que están **por debajo de ella**:

| Capa            | Puede importar                                  | NO puede importar                            |
| --------------- | ----------------------------------------------- | -------------------------------------------- |
| `models/`       | (nada del módulo — solo libs externas y tipos)  | components, data, hooks, store, dictionaries |
| `dictionaries/` | (nada del módulo)                               | components, data, hooks, store               |
| `data/`         | models, libs externas, `@/http_client`, `@data` | components, hooks, store, dictionaries       |
| `store/`        | models, libs externas                           | components, hooks, data, dictionaries        |
| `hooks/`        | models, data, store, libs externas              | components, dictionaries                     |
| `components/`   | todo lo anterior                                | (sin restricciones intra-módulo)             |

**Lectura en una línea**: la capa de datos no conoce la UI. La UI consume todo. El medio (hooks) es el pegamento entre estado y componentes.

**Ejemplos**:

```ts
// ✅ data/list/getSites.ts
import type { Site } from '../../models/site.interface';
import { doFetch } from '@/http_client';

// ❌ data/list/getSites.ts — bloqueado
import { SitesTable } from '../../components/SitesTable'; // data no toca UI
import { useSitesStore } from '../../store/sites.store'; // data no toca store

// ✅ hooks/useSelectedSite.ts
import { useSitesStore } from '../store/sites.store';
import { useGetSites } from '../data/list/getSites';

// ❌ hooks/useSelectedSite.ts — bloqueado
import { SitesTable } from '../components/SitesTable'; // hooks no tocan UI
```

**Convención de naming para que ESLint funcione**: las carpetas de capas se llaman exactamente `models`, `dictionaries`, `data`, `store`, `hooks`, `components`. Si nombrás distinto (`api/`, `state/`, etc.) las reglas no aplican.

### Capa 3 — Imports prohibidos

| ❌ Prohibido                      | ✅ Usar                         |
| --------------------------------- | ------------------------------- |
| `axios`                           | `doFetch` desde `@/http_client` |
| `cross-fetch`, `isomorphic-fetch` | `doFetch`                       |
| `next/router`                     | `next/navigation` (Next 16)     |

Para agregar más prohibiciones, editá `bannedPaths` en `eslint.config.mjs`.

### Cómo agregar/cambiar boundaries

1. Editá `eslint.config.mjs` (helpers `restrictedImports` + `noLayers`).
2. Actualizá la tabla de Capa 2 acá si agregaste/sacaste capas.
3. Actualizá `CLAUDE.md` (sección "Boundaries (enforced)") en el root para que las herramientas de AI lo vean.
4. Corré `npm run lint` para confirmar que el código actual cumple.
