# Arquitectura

Overview de la arquitectura del template. Para reglas de código, ver [CONVENTIONS.md](./CONVENTIONS.md). Para tutoriales paso-a-paso, ver [RECIPES.md](./RECIPES.md).

## Stack

| Capa            | Herramienta                                                              |
| --------------- | ------------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router) + React 19                                       |
| Lenguaje        | TypeScript 5 strict                                                      |
| UI              | Tailwind 4 + `@biaenergy/ui` (design system propio) + `next-themes`      |
| Estado servidor | TanStack React Query 5                                                   |
| Estado cliente  | Zustand 5 (con `skipHydration`)                                          |
| HTTP            | `fetch` nativo + wrapper `doFetch` (isomorfo, generics, errores tipados) |
| Validación      | Zod 4 + React Hook Form                                                  |
| Auth            | Firebase Auth (Google provider)                                          |
| i18n            | Custom (cookie `NEXT_LOCALE`, sin segmento en URL)                       |
| Tests           | Jest + RTL (unit), Playwright (E2E)                                      |
| CI              | GitHub Actions                                                           |

## Diagrama de carpetas

```
src/
├── app/                              # App Router
│   ├── (public)/                     # Rutas públicas (login)
│   │   ├── layout.tsx
│   │   └── page.tsx                  # → /
│   ├── (app)/                        # Rutas protegidas (gate en proxy)
│   │   └── layout.tsx                # Renderiza <AppShell> (sidebar + header + tabs)
│   ├── api/                          # Route handlers
│   └── layout.tsx                    # Root: providers + body
├── config/
│   ├── env.ts                        # Validación Zod de envs (cliente + server)
│   └── routes.ts                     # APP_ROUTES, PUBLIC_ROUTES, DEFAULT_AUTHED_ROUTE
├── http_client/                      # doFetch (fetch wrapper)
│   ├── base/{http_client,params,request}.ts
│   └── Bia/http_client.ts            # exporta doFetch
├── data/core/                        # React Query Provider + QueryKeys
├── i18n/                             # Config + dictionaries globales
├── auth/                             # Firebase + AuthProvider + useAuth
├── core/theme/                       # ThemeProvider (next-themes)
├── components/                       # Componentes compartidos del proyecto
├── hooks/                            # Hooks compartidos
├── helpers/                          # Helpers compartidos
├── styles/                           # Tailwind + SCSS mixins
├── utils/                            # cn, format
├── modules/                          # Features autocontenidas
│   ├── auth/                         # login Google + logout
│   ├── shell/                        # navegación global (sidebar + header + tabs)
│   └── example/                      # módulo de ejemplo end-to-end
├── proxy.ts                          # locale + auth gate (Next 16: era middleware.ts)
└── types/                            # Tipos globales
```

## Path aliases

| Alias           | Apunta             |
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

## Request lifecycle (cliente)

1. Componente cliente llama `useGetSites()` (hook React Query).
2. El hook ejecuta `getSites()` que llama `doFetch<void, Site[]>({ endpoint: endpointsSites.list })`.
3. `doFetch` arma URL (`NEXT_PUBLIC_BACKEND_URL` + `endpoint.url`), headers (`Authorization` desde cookie `bia_session`, `Accept-Language` desde `NEXT_LOCALE`), body si aplica.
4. `fetch` con `AbortController` (timeout 60s).
5. Si 401/403 → intento de refresh (una vez). Si falla → limpia cookies + redirige a `/`.
6. Si 2xx → parsea JSON y retorna `Site[]`.
7. React Query cachea bajo `[QueryKeys.SITES_LIST]`.

## Request lifecycle (server component)

1. Page server llama `await doFetch<void, Site[]>({ endpoint, next: { revalidate: 60 } })`.
2. `doFetch` lee cookies con `cookies()` de `next/headers` (no `js-cookie`).
3. Next.js cachea la response según `cache`/`next.revalidate`/`next.tags`.
4. Server retorna HTML pre-renderizado.

## Auth flow (Google)

1. Usuario en `/` (login). Click "Continuar con Google".
2. `useGoogleSignIn()` llama Firebase `signInWithPopup(googleProvider)`.
3. Firebase devuelve `User` + `idToken`.
4. `useAuth.loginWithGoogle()` setea cookie `bia_session = idToken`.
5. `useGoogleSignIn` mapea Firebase User → `AuthUser` y guarda en Zustand store.
6. Redirige a `DEFAULT_AUTHED_ROUTE` (`src/config/routes.ts`).
7. Proxy detecta cookie en próximas requests → permite acceso.

**No hay backend**: el `idToken` de Firebase es la sesión. Si querés validar contra tu backend, agregás un `useExchangeToken` mutation tras Firebase.

## Locale flow

1. Primera request del usuario → proxy lee `Accept-Language` → setea cookie `NEXT_LOCALE`.
2. Server components llaman `await getActiveLocale()` → leen la cookie.
3. `doFetch` inyecta `Accept-Language: <locale>` en cada request al backend.
4. Cambio de idioma: setear la cookie a otro valor (ej. server action).

## Proxy (gate)

`src/proxy.ts` corre **antes** de cualquier route handler. Lógica:

| Ruta                             | Sin sesión     | Con sesión                        |
| -------------------------------- | -------------- | --------------------------------- |
| `/` (público)                    | muestra login  | redirige a `DEFAULT_AUTHED_ROUTE` |
| Cualquier otra (protegida)       | redirige a `/` | muestra                           |
| `/api/`\*                        | passthrough    | passthrough                       |
| Static (`/_next`, `*.png`, etc.) | passthrough    | passthrough                       |

Las constantes de ruta (`PUBLIC_ROUTES.login`, `DEFAULT_AUTHED_ROUTE`, `APP_ROUTES`) viven en [`src/config/routes.ts`](../src/config/routes.ts). Tanto el proxy como `useGoogleSignIn` y la config del shell las consumen — no hay URLs hardcodeadas.

## Providers tree

`src/app/layout.tsx` envuelve toda la app:

```
<html>
  <body>
    <ThemeProvider>            # next-themes (clase .dark)
      <DataAccessProvider>     # React Query + Devtools
        <AuthProvider>         # Firebase onAuthStateChanged
          {children}
        </AuthProvider>
      </DataAccessProvider>
    </ThemeProvider>
  </body>
</html>
```

## Shell (navegación)

`src/modules/shell/` contiene el layout global del área autenticada. Lo monta [`src/app/(app)/layout.tsx`](<../src/app/(app)/layout.tsx>) con `<AppShell>` y aplica a todas las pages bajo `(app)/`. Está modelado igual al preview del DS (`https://design.bia.app/preview/navigation/app/`).

### Anatomía visual

```
┌──────────────────────────────────────────────────────────────────────┐
│ Header strip (h-12)                                                  │
│ [Workspace ▾]  [⇄ ◄ ►]  [tab1  tab2  +]                  [✨ AI]   │
├──────────────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [🔍 ⌘K]    │ │  rounded-2xl bg-bg-white-0 ring-1                │ │
│ │            │ │                                                  │ │
│ │ TabMenu    │ │  {children} (page actual)                        │ │
│ │  Vertical  │ │                                                  │ │
│ │            │ │                                                  │ │
│ │ ──────     │ │                                                  │ │
│ │ [GP] User  │ │                                                  │ │
│ └────────────┘ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
   bg-bg-weak-25 (frame, R3)
```

### Modelo de datos

- **`models/nav.types.ts`** — uniones literales `WorkspaceKey` (top-level) y `NavItemKey` (entradas del sidebar). Estas son la fuente de verdad — los dictionaries usan `satisfies Record<WorkspaceKey, string>` y se rompen si se desincronizan.
- **`models/workspaces.config.ts`** — array `workspaces: Workspace[]`. Cada workspace tiene `iconFill` (trigger activo, R13), `iconLine` (dropdown items) y `items: NavSidebarEntry[]`. Cada entry es de kind `item` (link plano con `href` + `icon`) o `group` (accordion con sub-items, `id`, `labelKey`, `icon`).
- **`models/workspaces.config.ts` helpers**: `findItemByHref(pathname)` resuelve workspace+href activo a partir de la URL; `findWorkspaceByHref` y `firstHrefInWorkspace` se usan al cambiar de workspace.
- **`src/config/routes.ts`** — `APP_ROUTES` (URLs canónicas) + `DEFAULT_AUTHED_ROUTE`. Compartido entre proxy, auth (post-login redirect) y shell.

### Stores

Dos Zustand stores en `shell/store/`:

| Store             | Persistencia           | Qué guarda                                              |
| ----------------- | ---------------------- | ------------------------------------------------------- |
| `useTabsStore`    | No (sesión, in-memory) | `tabs[]`, `activeTabId`, acciones add/close/sync        |
| `useShellUiStore` | localStorage (partial) | `sidebarCollapsed` (persistido), `searchOpen` (efímero) |

### Tabs estilo navegador

Las "pestañas" del header son estado UI, no rutas paralelas. Cada tab apunta a una `(workspace, href)`. Comportamiento:

| Acción del usuario             | Efecto en el store                         | Efecto en el router      |
| ------------------------------ | ------------------------------------------ | ------------------------ |
| Click en sidebar item          | `syncActiveRoute(workspace, href)`         | `router.push(href)`      |
| Click en otra tab              | `setActiveTab(id)`                         | `router.push(tab.href)`  |
| Click en "+"                   | `addTab(default)`                          | `router.push(default)`   |
| Click en "X" del tab activo    | `closeTab(id)` → devuelve siguiente tab    | `router.push(next.href)` |
| Cambio de workspace (dropdown) | `syncActiveRoute(newWorkspace, firstHref)` | `router.push(firstHref)` |

`AppShell` (client component) escucha `usePathname()` y mantiene el active tab sincronizado con la URL. Si el user navega por otro medio (ej. back button), el tab activo se actualiza solo.

### Componentes (`shell/components/`)

```
AppShell/             # 'use client' — orquesta layout + Tooltip.Provider + sync tabs/pathname
├── AppHeader/        # h-12: workspace switcher + controls + tabs + actions
│   ├── WorkspaceSwitcher/  # Dropdown con icono Fill activo
│   ├── HeaderControls/     # Sidebar collapse + back/forward (placeholders)
│   ├── TabsStrip/          # Browser tabs scrollables + new tab "+"
│   └── HeaderActions/      # History (placeholder) + AI FancyButton
└── AppSidebar/       # w-60 ↔ w-[52px]
    ├── SearchButton/       # bg-bg-white-0 ring + Kbd "⌘K"
    ├── SidebarNav/         # TabMenuVertical con item|group
    └── UserMenu/           # Avatar + Dropdown (theme toggle, settings, logout)
```

### Reglas de DS aplicadas

- **R3** (dos superficies): `bg-bg-weak-25` (frame) + `bg-bg-white-0` (sidebar/header/main card).
- **R13** (line por default): items y dropdowns usan Line; **solo** el icono del workspace activo en `WorkspaceSwitcher` usa Fill.
- **R8** (dot-access): `Avatar.Root`, `Dropdown.Root`, `TabMenuVertical.Root`, `Tooltip.Provider`, etc.
- **R6** (auto-flip dark mode): tokens semánticos sin `dark:` excepto la excepción documentada de "shell hover translucency" (`hover:bg-neutral-200/70 dark:hover:bg-bg-white-0/60`).

### Comandos para tocar el shell

| Comando          | Cuándo                                                      |
| ---------------- | ----------------------------------------------------------- |
| `/add-page`      | Page nueva, opcionalmente registrada como item del sidebar  |
| `/add-workspace` | Workspace top-level nuevo (vacío, se llena con `/add-page`) |

Lo que toca cada uno está en su markdown ([.claude/commands/add-page.md](../.claude/commands/add-page.md), [.claude/commands/add-workspace.md](../.claude/commands/add-workspace.md)).

## Decisiones clave

- **Server-first**: layouts y pages son server components por defecto. `'use client'` solo donde haya estado/efectos/handlers. **Excepción**: `<AppShell>` es client porque escucha `pathname` y maneja stores de UI.
- **Sin `[lang]` en URL**: el locale vive en cookie. Decisión de simplicidad, reversible si se necesita SEO multi-idioma.
- **Sin axios**: `fetch` nativo se integra mejor con Next 16 (RSC, cache, revalidate).
- **Módulos autocontenidos**: cada feature tiene su data, components, i18n, store. Reduce acoplamiento.
- **QueryKeys centralizados**: invalidaciones consistentes y sin strings mágicos.
- **Tests en inglés**: convención del equipo.
- **Tabs como estado UI** (no rutas paralelas): simplifica el modelo a costa de no preservar el árbol React de pestañas inactivas. Si en el futuro se necesita ese comportamiento (ej. para preservar scroll position), Next 16 soporta parallel routes.
- **Rutas anidadas por workspace** (`/{workspaceId}/{itemKey}`): refleja la jerarquía visual del sidebar y permite usar `Breadcrumb` del DS sin metadata extra.
