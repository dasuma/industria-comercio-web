# Olibia Web — BIA

Aplicación web de BIA. Hub interno con workspaces por área (Operaciones, Growth) construido sobre la arquitectura modular del template-web.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** strict
- **Tailwind CSS 4** + **`@biaenergy/ui`** (design system propio)
- **TanStack React Query 5** (server state) + **Zustand 5** (client state, con `skipHydration`)
- **`fetch` nativo + wrapper `doFetch`** isomorfo (server + client) con generics tipados, soporte de cache de Next, refresh de sesión y errores tipados
- **Zod 4** + React Hook Form (validación)
- **Firebase Auth** con Google provider
- **i18n por cookie** (`NEXT_LOCALE`), URLs limpias sin `/[lang]`. Default `es`, `en` disponible.
- **Jest + RTL** (unit) y **Playwright** (E2E)
- **GitHub Actions** CI: lint + type-check + test + build

## Setup

### 1. Requisitos

- Node.js `>=20.9.0` (ver `.nvmrc`)
- npm `>=10.0.0`

### 2. Design system `@biaenergy/ui`

El proyecto consume `@biaenergy/ui` desde GitHub Packages (registry privado de la org `biaenergy`). Para que `npm install` funcione necesitas un Personal Access Token con scope `read:packages`:

1. Genera el PAT en [https://github.com/settings/tokens](https://github.com/settings/tokens) (scope `read:packages`).
2. Exporta el token en tu shell (o agrégalo a `~/.npmrc`):

```bash
export NPM_TOKEN=ghp_xxx
```

El `.npmrc` del repo lee `${NPM_TOKEN}` para autenticarse contra `npm.pkg.github.com`. En CI, el mismo token se inyecta vía el secret `NPM_TOKEN` en GitHub Actions.

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Llena las variables de Firebase con las credenciales del proyecto BIA (pídelas a un compañero o sácalas de la consola de Firebase). El arranque valida el `.env` con Zod en [src/config/env.ts](./src/config/env.ts) — si falta una variable, el server no levanta.

### 4. Instalación

```bash
npm install
```

## Comandos

```bash
npm run dev           # Dev server en http://localhost:3000
npm run build         # Build de producción
npm run start         # Sirve el build

npm run lint          # ESLint
npm run type-check    # TypeScript sin emitir
npm run format        # Prettier sobre src/

npm test              # Jest
npm run test:watch    # Jest en watch
npm run test:ci       # Jest en CI con coverage

npm run test:e2e      # Playwright
npm run test:e2e:headed
npm run test:e2e:report

npm run commit        # Commitizen (cz-git) con conventional commits
```

## Arquitectura

### Carpetas

```
src/
├── app/                       # App Router (URLs limpias, sin /[lang])
│   ├── (public)/login         # Rutas no autenticadas
│   └── (app)/                 # Rutas protegidas
│       ├── operaciones/cgm
│       └── growth/bianetwork/users
├── config/                    # routes.ts + env.ts (Zod)
├── core/                      # piezas compartidas que no son módulo
├── http_client/               # fetch wrapper (doFetch)
├── data/core/                 # React Query Provider + QueryKeys
├── i18n/                      # Config + dictionaries globales + getDictionary
├── auth/                      # Firebase Auth + AuthProvider
├── utils/                     # cn, format
├── styles/                    # Tailwind + mixins SCSS
├── modules/
│   ├── shell/                 # Layout autenticado: workspaces, sidebar, tabs, switcher
│   ├── auth/                  # Login con Google (referencia de módulo end-to-end)
│   ├── bianetwork/            # Gestión de usuarios (workspace Growth)
│   └── example/               # Demo de patrón data + form (borrable)
└── proxy.ts                   # Detecta locale + protege rutas (Next 16 renombró middleware → proxy)
```

Estructura interna de cada módulo:

```
src/modules/{name}/
├── components/
├── data/                      # endpoints + queries/mutations (doFetch + React Query)
├── dictionaries/              # i18n del módulo (es, en)
├── hooks/
├── models/
├── store/                     # Zustand
├── types/
└── index.ts                   # barrel — único punto de entrada cross-module
```

### Path aliases

| Alias           | Apunta a           |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@modules/*`    | `src/modules/*`    |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@helpers/*`    | `src/helpers/*`    |
| `@data/*`       | `src/data/*`       |
| `@i18n/*`       | `src/i18n/*`       |
| `@auth/*`       | `src/auth/*`       |
| `@styles/*`     | `src/styles/*`     |

### Shell y workspaces

El layout autenticado vive en [src/modules/shell](./src/modules/shell). Define los **workspaces** del producto (áreas top-level) y la navegación que los conecta:

- Configuración declarativa en [src/modules/shell/models/workspaces.config.ts](./src/modules/shell/models/workspaces.config.ts) — cada workspace tiene íconos (Fill/Line de `@biaenergy/ui/icons`) y un árbol de items o grupos.
- Rutas centralizadas en [src/config/routes.ts](./src/config/routes.ts) (`APP_ROUTES` + `DEFAULT_AUTHED_ROUTE`) — los componentes y la nav consumen estas constantes, **no** hardcodean paths.
- Componentes del shell: `SidebarNav`, `WorkspaceSwitcher`, `TabsStrip`, `HeaderControls`, `UserMenu`, `SearchButton`.
- Workspaces actuales: **Operaciones** (CGM) y **Growth** (BIA Network → Users).

Para agregar un workspace nuevo (Operaciones, Growth, …) usa el slash command `/add-workspace` que pregunta key + labels ES/EN, ayuda a elegir íconos buscando en `@biaenergy/ui/icons`, y actualiza `WorkspaceKey`, dictionaries y `workspaces.config.ts`.

### Patrón de un endpoint

```ts
// data/list/getSites.ts
import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsSites } from '../endpoints';

const getSites = () => doFetch<void, Site[]>({ endpoint: endpointsSites.list });

export const useGetSites = () => useQuery({ queryKey: ['sites'], queryFn: getSites });
```

En **Server Components** se puede llamar `doFetch` directo y aprovechar el cache de Next:

```ts
const sites = await doFetch<void, Site[]>({
  endpoint: endpointsSites.list,
  next: { revalidate: 60, tags: ['sites'] }
});
```

## Convenciones

### Tests

- En **inglés**: `describe`, `it`, variables, comments.
- Patrones: `returns X when Y`, `handles X correctly`, `throws when X`.
- Co-localizados con el componente: `Component.tsx` + `Component.test.tsx`.

### Commits

`npm run commit` lanza Commitizen + cz-git. Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

### Reglas de código

Definidas en `eslint.config.mjs` y `CLAUDE.md`. Los pre-commits corren lint + format con `husky` + `lint-staged`.

## i18n

- Locales soportados en `src/i18n/config.ts`. Default: `es`.
- El locale activo **no aparece en la URL**. Se detecta y guarda en la cookie `NEXT_LOCALE` (proxy → cookie → `Accept-Language` → default).
- Dictionaries globales en `src/i18n/dictionaries/{es,en}.json`.
- Dictionaries por módulo en `src/modules/{name}/dictionaries/{es,en}.ts`.
- En **server components** usa `await getDictionary()` (lee la cookie automáticamente) o `await getDictionary('en')` para forzar uno.
- El header `Accept-Language` se inyecta automáticamente en cada request del `doFetch`.
- Para añadir un idioma: agregar a `locales` en `config.ts`, crear el JSON correspondiente en `dictionaries/`, y los `.ts` por módulo.
- Si más adelante quieres locales visibles en la URL (`/es/...`, `/en/...`), basta con re-introducir un segmento `[lang]` y ajustar el proxy.

## Auth (Google)

`src/auth/` provee `AuthProvider` (estado de Firebase) y `useAuth()` (login/logout). El módulo `modules/auth/` muestra el patrón completo de un módulo: tipos, endpoint, hook de signIn, store y componente de botón.

El proxy en `src/proxy.ts` (anteriormente `middleware.ts` antes de Next 16) protege las rutas en `(app)` validando la cookie `bia_session`.

## Documentación adicional

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — overview de la arquitectura (folder structure, request lifecycle, providers, decisiones).
- [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) — reglas de código, naming, tests, commits, anti-patterns.
- [docs/RECIPES.md](./docs/RECIPES.md) — tutoriales paso-a-paso (crear módulo, endpoint, página, idioma, store, test).
- [CLAUDE.md](./CLAUDE.md) — reglas para Claude Code + lista de slash commands.

## Slash commands de Claude Code

Si el equipo usa Claude Code, hay comandos para mantener la arquitectura:

- `/add-workspace` — crear un workspace top-level nuevo en el shell (sugiere íconos por keyword).
- `/add-module` — scaffold de módulo nuevo (interactivo).
- `/add-endpoint` — agregar endpoint con `doFetch` + React Query.
- `/add-page` — crear página en App Router (opcionalmente la registra en el sidebar).
- `/review-architecture` — revisar código modificado contra las reglas.

Flujo típico para un feature end-to-end: `/add-workspace` (si hace falta) → `/add-page` → `/add-module` → `/add-endpoint`.

Definidos en [.claude/commands/](./.claude/commands/) y skills auto-cargables en [.claude/skills/](./.claude/skills/).
