---
description: Crea un workspace top-level nuevo en la navegación del shell (como Operaciones, Growth). Pregunta key + labels ES/EN y ayuda a elegir íconos Fill/Line buscando en @biaenergy/ui/icons. Actualiza WorkspaceKey, dictionaries y workspaces.config.ts.
---

# /add-workspace

Vas a agregar un nuevo workspace top-level a la navegación del shell. Un workspace es una sección "raíz" del sidebar (ej. Operaciones, Growth) que tiene sus propios items debajo. El workspace queda creado vacío — los items se agregan después con `/add-page`.

## Paso 1 — Recolectar requisitos

Si el usuario no incluyó argumentos completos, pregunta vía `AskUserQuestion`:

1. **Workspace key** (camelCase corto, ej. `operaciones`, `growth`, `finanzas`, `servicio`). Va a ser literal en `WorkspaceKey` y aparece en URLs como `/{workspaceKey}/{itemKey}`.
2. **Labels** ES y EN para el dropdown del header (ej. ES "Finanzas", EN "Finance").
3. **¿Sobre qué trata el workspace?** (1-3 keywords) — para sugerir íconos.

## Paso 2 — Verificaciones previas

1. Leé `src/modules/shell/models/nav.types.ts`. Si la `WorkspaceKey` ya existe, abortá y avisá.
2. Leé `src/modules/shell/models/workspaces.config.ts` para ver el shape actual y dónde agregar.
3. Leé `src/modules/shell/dictionaries/es.ts` para ver el shape actual del bloque `workspaces`.

## Paso 3 — Sugerir íconos (Fill + Line)

Procedimiento:

1. Por cada keyword del paso 1.3, corré:

   ```bash
   grep -oE 'Ri{Keyword}\w*(Fill|Line)' node_modules/@biaenergy/ui/dist/icons.d.ts | sort -u | head -20
   ```

2. Agrupá los resultados como pares `Fill`/`Line` del mismo nombre base (ej. `RiToolsFill` + `RiToolsLine`). **Solo presentá pares completos** — un workspace necesita ambas variantes:
   - **Fill** se usa en el trigger del `WorkspaceSwitcher` (el icono dentro del cuadrado glass-popup en el header) — representa el estado "activo" (R13).
   - **Line** se usa en los items del dropdown "Cambiar sección".

3. Presentá 3-5 pares al user vía `AskUserQuestion` (cada opción es un par Fill+Line). Marcá una como "(Recommended)" según semántica.

4. Si ninguna le gusta, repetí con keywords más amplias o dejá que el user pase los nombres exactos.

## Paso 4 — Generar cambios

Hay 3 archivos a tocar:

**1. `src/modules/shell/models/nav.types.ts`** — extender la unión `WorkspaceKey`:

```ts
export type WorkspaceKey = 'operaciones' | 'growth' | '{newKey}';
```

**2. `src/modules/shell/dictionaries/es.ts` y `en.ts`** — agregar el label al objeto `workspaces`:

```ts
workspaces: {
  operaciones: 'Operaciones',
  growth: 'Growth',
  {newKey}: '{LabelEs}'   // o '{LabelEn}' en en.ts
} satisfies Record<WorkspaceKey, string>,
```

**3. `src/modules/shell/models/workspaces.config.ts`** — agregar el workspace al array:

```ts
import {
  // ...íconos existentes,
  Ri{NewIconName}Fill,
  Ri{NewIconName}Line
} from '@biaenergy/ui/icons';

export const workspaces: Workspace[] = [
  // ...workspaces existentes,
  {
    id: '{newKey}',
    iconFill: Ri{NewIconName}Fill,
    iconLine: Ri{NewIconName}Line,
    items: []   // arranca vacío — usar /add-page para poblar
  }
];
```

**Importante**: NO agregues entrada a `APP_ROUTES` en `src/config/routes.ts` — eso lo hace `/add-page` cuando el user crea su primer item bajo el workspace.

## Paso 5 — Validar y reportar

1. Corré `npm run type-check`. Si falla en el `satisfies Record<WorkspaceKey, string>` de los dicts, revisá que los 3 archivos (paso 4) coincidan en la nueva key.
2. Reportá:
   - Workspace `{newKey}` registrado, vacío.
   - Próximo paso: `/add-page` para crear el primer item del workspace (eligilo como destino cuando pregunte el workspace).
3. Recordale al user que el workspace **no aparece en el sidebar hasta que tenga al menos un item** — la lógica de `findItemByHref` activa el workspace según el `pathname`, así que sin items no hay rutas que matcheen.

## Anti-patterns a evitar

- **No** crees páginas dentro de este comando — solo registra el workspace. Las pages se crean con `/add-page`.
- **No** agregues a `APP_ROUTES`. Las rutas se agregan ítem por ítem con `/add-page`.
- **No** uses íconos sueltos (solo Fill o solo Line) — siempre pareja. R13: Line es default, Fill solo para estados activos críticos como el trigger del workspace.
- **No** uses íconos que no estén en `@biaenergy/ui/icons` (R2). Si el grep no devuelve algo apropiado, repetí con otras keywords antes de inventar.
- **No** dejes el `items: []` con un comentario `// TODO`. Está bien vacío; cuando se agregue el primer item, el comentario sería ruido.

## Argumentos

$ARGUMENTS
