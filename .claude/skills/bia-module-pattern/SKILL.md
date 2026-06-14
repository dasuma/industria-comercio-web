---
name: bia-module-pattern
description: Cómo se estructura un módulo en este template (carpetas, responsabilidades, qué va dónde). Usa este skill cuando vayas a crear, modificar o reorganizar archivos dentro de src/modules/.
---

# Estructura de un módulo

Cada feature autocontenida vive bajo un workspace en `src/modules/{workspace}/{nombre}/` (plano) o `src/modules/{workspace}/{dominio}/{nombre}/` (anidado cuando hay 2+ submódulos del mismo dominio). Más sobre dónde lo ponés en la siguiente sección. La estructura interna del módulo es la misma en ambos casos:

```
{ruta-del-modulo}/
├── components/                # Componentes específicos del módulo
│   └── {Componente}/
│       ├── index.tsx
│       └── {Componente}.test.tsx (opcional — para lógica interna)
├── data/                      # Capa de red (solo si llama backend)
│   ├── endpoints.ts           # Definiciones de endpoints
│   ├── {feature}/             # Subcarpeta por feature (list, detail, actions)
│   │   ├── {action}.ts        # 1 archivo por endpoint: función + hook
│   │   └── {action}.test.tsx  # Test del endpoint (mock doFetch) — recomendado
│   └── index.ts               # Barrel
├── dictionaries/              # i18n del módulo (sin tests — son strings)
│   ├── es.ts                  # Define el tipo
│   ├── en.ts                  # Implementa el tipo
│   └── index.ts               # get{Nombre}Dict(locale)
├── hooks/                     # Hooks específicos del módulo
│   ├── {hookName}.ts
│   └── {hookName}.test.ts     # Test del hook (si tiene lógica)
├── models/                    # Sin tests — son interfaces/tipos
│   └── {nombre}.interface.ts
├── store/                     # Zustand store (cuando aplica)
│   ├── {nombre}.store.ts
│   └── {nombre}.store.test.ts # Test de acciones/selectores con lógica
├── types/                     # Sin tests — DTOs request/response
│   └── {nombre}.types.ts
├── utils/                     # Helpers internos
│   ├── {helper}.ts
│   └── {helper}.test.ts       # Test de funciones puras — alto ROI
└── index.ts                   # Barrel exports públicos del módulo
```

## Organización por workspace

Todo módulo vive bajo un workspace. La estructura tiene dos formas:

```
src/modules/
├── _global/                      ← módulos sin workspace (auth, shell, ...)
│   └── {modulo}/
│       └── index.ts              ← barrel: @modules/_global/{modulo}
│
└── {workspace}/                  ← carpeta del workspace (NO es módulo)
    ├── {modulo}/                 ← módulo plano
    │   ├── components/  data/  ...
    │   └── index.ts              ← barrel: @modules/{workspace}/{modulo}
    │
    └── {dominio}/                ← carpeta de dominio (NO es módulo)
        ├── {submodulo-a}/        ← submódulo
        │   ├── components/  data/  ...
        │   └── index.ts          ← barrel: @modules/{workspace}/{dominio}/{submodulo-a}
        └── {submodulo-b}/
            └── index.ts
```

Import siempre vía barrel del módulo o submódulo:

```ts
import { Thing } from '@modules/_global/{modulo}'; // ✅ módulo global
import { Thing } from '@modules/{workspace}/{modulo}'; // ✅ módulo plano en workspace
import { Thing } from '@modules/{workspace}/{dominio}/{submodulo-a}'; // ✅ submódulo anidado
import { Thing } from '@modules/{workspace}'; // ❌ workspace no es módulo
import { Thing } from '@modules/{workspace}/{dominio}'; // ❌ dominio no es módulo
```

**Reglas**:

- **Workspace siempre presente**: coincide con `WorkspaceKey` en `_global/shell/models/nav.types.ts`. Módulos sin workspace (auth, shell, layouts compartidos) viven bajo `_global/`.
- **Cuándo anidar bajo un dominio**: cuando hay 2+ submódulos del mismo dominio dentro del workspace, cada uno con su propia `data/` y/o `store/`. Si solo cambia la vista sobre los mismos datos, dejá módulo plano con `subTabs[]` en `workspaces.config.ts`.
- Las carpetas `{workspace}/` y `{dominio}/` **no son módulos**: no tienen `index.ts`, ni `components/`, ni código. Solo agrupan.
- Para código compartido entre hermanos del mismo dominio: módulo plano hermano (`{workspace}/{dominio}-shared/`).
- Las reglas de capa (`data/`, `store/`, etc.) aplican igual a las dos formas — ESLint las enforce con globs `src/modules/*/*/{layer}/**` (flat) y `src/modules/*/*/*/{layer}/**` (anidado).

## Reglas estrictas (enforced por ESLint)

1. **Lo público se expone vía `index.ts` del módulo.** Un módulo externo solo importa de `@modules/{nombre}` para módulos planos, o de `@modules/{padre}/{nombre}` para submódulos anidados. Nunca `@modules/X/components/Y`. ESLint bloquea los imports profundos cross-module.
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

## Testing por capa

Cada capa tiene una política de tests distinta. Detalle en [docs/CONVENTIONS.md § Tests](../../../docs/CONVENTIONS.md#tests).

| Capa            | ¿Testear con Jest? | Cómo / por qué                                                                                       |
| --------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| `models/`       | No                 | Tipos puros. Excluidos de coverage.                                                                  |
| `dictionaries/` | No                 | Strings i18n. Excluidos de coverage.                                                                 |
| `types/`        | No                 | DTOs. Excluidos de coverage.                                                                         |
| `data/`         | **Sí**             | Mockear `doFetch` y verificar endpoint + params + response. Template: `findContractsByIds.test.tsx`. |
| `store/`        | **Sí**             | Acciones y selectores con lógica. Resetear estado entre tests.                                       |
| `hooks/`        | Sí si tiene lógica | Si solo wrappea React Query directo, opcional.                                                       |
| `utils/`        | **Sí (alto ROI)**  | Funciones puras. Apuntar a 80%+.                                                                     |
| `components/`   | Opcional           | Solo si tiene lógica interna. UI pura → la cubre Playwright (`e2e/`).                                |

**Coverage**: enforced por carpeta en [jest.config.js](../../../jest.config.js). Al escribir tests para una capa de un módulo nuevo, agregá la entrada al `coverageThreshold`:

```js
'./src/modules/{ws}/{modulo}/data/': { statements: 70, branches: 60, functions: 70, lines: 70 }
```

**Importante**: si vas a crear `data/`, `store/`, `hooks/` o `utils/` en un módulo, escribí los tests **junto** al código (mismo PR). El template ya excluye `models/`, `dictionaries/`, `types/` del coverage, así que no necesitan tests.

## Ejemplo concreto: módulo `_global/auth`

```
src/modules/_global/auth/
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

Nota: `auth` no tiene `data/` porque el login es 100% Firebase, no hay backend. Cuando un módulo no llama backend, **no crees `data/` por costumbre**. Vive en `_global/` porque es pre-auth — no pertenece a ningún workspace.

## Cuándo NO usar este patrón

- **Páginas (rutas)** van en `src/app/`, no en `modules/`.
- **Componentes verdaderamente compartidos** (Button genéricos, Layouts globales) en `src/components/` y `src/Layouts/`.
- **HTTP client base, providers globales, i18n config** en sus carpetas dedicadas (`src/http_client/`, `src/data/core/`, `src/i18n/`).

## Relación con el shell (navegación)

El módulo `_global/shell` es especial: contiene el layout global del área autenticada (sidebar + header + tabs). Define dos cosas que cualquier nuevo feature toca cuando aparece en el sidebar:

- **`_global/shell/models/nav.types.ts`** — uniones `WorkspaceKey` (top-level del header dropdown) y `NavItemKey` (cada entrada del sidebar). **Los workspaces declarados acá son los mismos que las carpetas bajo `src/modules/`** (operations, growth, retention, etc.).
- **`_global/shell/models/workspaces.config.ts`** — el array de workspaces con sus íconos Fill/Line y la lista de items que muestran en el sidebar.
- **`_global/shell/dictionaries/{es,en}.ts`** — labels de workspaces e items.
- **`src/config/routes.ts`** — `APP_ROUTES` con la URL canónica de cada item.

Tu módulo de negocio (ej. `operations/cgm/report`, `growth/bianetwork`) es independiente del shell — no toca ninguno de esos archivos. La integración la hace `/add-page` cuando declarás que la page nueva aparece en el sidebar (o `/add-workspace` para una sección top-level nueva). **Un módulo no es un nav item**: podés tener un módulo sin page (lógica reusable) o varias pages del mismo módulo registradas como items distintos.

## Comandos relacionados

- **`/add-module`** — crea el módulo de negocio (carpetas, dictionaries, models, etc.).
- **`/add-page`** — crea la page en App Router; si es protegida y querés que aparezca en el sidebar, registra el item en `shell/` automáticamente.
- **`/add-workspace`** — crea un workspace top-level vacío en el shell. Solo necesario cuando ningún workspace existente encaja con la página nueva.
- **`/add-endpoint`** — agrega un endpoint a un módulo existente.
