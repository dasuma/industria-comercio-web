---
name: bia-module-pattern
description: Cómo se estructura un módulo en este template (carpetas, responsabilidades, qué va dónde). Usa este skill cuando vayas a crear, modificar o reorganizar archivos dentro de src/modules/.
---

# Estructura de un módulo

Cada feature autocontenida vive en `src/modules/{nombre}/`. La estructura base:

```
src/modules/{nombre}/
├── components/                # Componentes específicos del módulo
│   └── {Componente}/
│       ├── index.tsx
│       └── {Componente}.test.tsx (opcional)
├── data/                      # Capa de red (solo si llama backend)
│   ├── endpoints.ts           # Definiciones de endpoints
│   ├── {feature}/             # Subcarpeta por feature (list, detail, actions)
│   │   └── {action}.ts        # 1 archivo por endpoint: función + hook
│   └── index.ts               # Barrel
├── dictionaries/              # i18n del módulo
│   ├── es.ts                  # Define el tipo
│   ├── en.ts                  # Implementa el tipo
│   └── index.ts               # get{Nombre}Dict(locale)
├── hooks/                     # Hooks específicos del módulo
├── models/
│   └── {nombre}.interface.ts  # Entidades del dominio
├── store/                     # Zustand store (cuando aplica)
│   └── {nombre}.store.ts
├── types/
│   └── {nombre}.types.ts      # DTOs request/response
├── utils/                     # Helpers internos
└── index.ts                   # Barrel exports públicos del módulo
```

## Reglas estrictas (enforced por ESLint)

1. **Lo público se expone vía `index.ts` del módulo.** Un módulo externo solo importa de `@modules/{nombre}` (no de `@modules/{nombre}/components/X`). ESLint bloquea los imports profundos cross-module.
2. **Dentro del módulo, imports relativos.** Usá `./components/X`, `../hooks/Y`. **Nunca** uses `@modules/{propio-módulo}/...` — ESLint lo trata como cross-module y lo bloquea.
3. **Layers (jerarquía estricta)**: cada capa solo importa las que están por debajo.

   | Capa            | Puede importar (intra-módulo) |
   | --------------- | ----------------------------- |
   | `models/`       | nada                          |
   | `dictionaries/` | nada                          |
   | `data/`         | `models/`                     |
   | `store/`        | `models/`                     |
   | `hooks/`        | `models/`, `data/`, `store/`  |
   | `components/`   | todas las anteriores          |

   Regla de oro: **`data/` no conoce la UI**. ESLint enforce esto via `no-restricted-imports` en `eslint.config.mjs`.

4. **Naming exacto**: las carpetas deben llamarse exactamente `models`, `dictionaries`, `data`, `store`, `hooks`, `components`. Si las nombrás distinto (`api/`, `state/`), las reglas no aplican y el módulo queda sin gobernanza.
5. **`models/` vs `types/`**: entidades del dominio en `models/` (lo que es un Site, una Invoice). DTOs de red (request/response del backend) en `types/`.
6. **`store/` solo si lo justifica**: estado UI persistente, cross-component, o no derivable de servidor. Si es estado local de un componente, va en `useState`.
7. **`services/` no se usa por defecto**. El patrón es `data/` con hooks de React Query. Solo crear `services/` si el módulo tiene lógica no-HTTP que sea reutilizable.
8. **`components/` son específicos del módulo**. Los compartidos van en `src/components/` (raíz).

## Ejemplo concreto: módulo `auth`

```
src/modules/auth/
├── components/
│   ├── LoginGoogleButton/
│   └── LogoutButton/
├── dictionaries/{es,en,index}.ts
├── hooks/
│   ├── useGoogleSignIn.ts
│   └── useLogout.ts
├── models/auth.interface.ts   # AuthUser
├── store/auth.store.ts        # Zustand (skipHydration)
└── index.ts                   # exporta {LoginGoogleButton, LogoutButton, useGoogleSignIn, useLogout, useAuthStore, AuthUser}
```

Nota: `auth` no tiene `data/` porque el login es 100% Firebase, no hay backend. Cuando un módulo no llama backend, **no crees `data/` por costumbre**.

## Cuándo NO usar este patrón

- **Páginas (rutas)** van en `src/app/`, no en `modules/`.
- **Componentes verdaderamente compartidos** (Button genéricos, Layouts globales) en `src/components/` y `src/Layouts/`.
- **HTTP client base, providers globales, i18n config** en sus carpetas dedicadas (`src/http_client/`, `src/data/core/`, `src/i18n/`).

## Relación con el shell (navegación)

El módulo `shell` (en `src/modules/shell/`) es especial: contiene el layout global del área autenticada (sidebar + header + tabs). Define dos cosas que cualquier nuevo feature toca cuando aparece en el sidebar:

- **`shell/models/nav.types.ts`** — uniones `WorkspaceKey` (top-level del header dropdown) y `NavItemKey` (cada entrada del sidebar).
- **`shell/models/workspaces.config.ts`** — el array de workspaces con sus íconos Fill/Line y la lista de items que muestran en el sidebar.
- **`shell/dictionaries/{es,en}.ts`** — labels de workspaces e items.
- **`src/config/routes.ts`** — `APP_ROUTES` con la URL canónica de cada item (`/{workspaceId}/{itemKey}`).

Tu módulo de negocio (ej. `cgm/`, `bianetwork/`) es independiente del shell — no toca ninguno de esos archivos. La integración la hace `/add-page` cuando declarás que la page nueva aparece en el sidebar (o `/add-workspace` para una sección top-level nueva). **Un módulo no es un nav item**: podés tener un módulo sin page (lógica reusable) o varias pages del mismo módulo registradas como items distintos.

## Comandos relacionados

- **`/add-module`** — crea el módulo de negocio (carpetas, dictionaries, models, etc.).
- **`/add-page`** — crea la page en App Router; si es protegida y querés que aparezca en el sidebar, registra el item en `shell/` automáticamente.
- **`/add-workspace`** — crea un workspace top-level vacío en el shell. Solo necesario cuando ningún workspace existente encaja con la página nueva.
- **`/add-endpoint`** — agrega un endpoint a un módulo existente.
