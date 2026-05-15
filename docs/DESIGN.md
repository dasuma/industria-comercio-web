# BIA Design System — Reglas para diseñar con `@biaenergy/ui`

> [!NOTE]
> **Espejo del [`design.md` del repo del DS](https://github.com/biaenergy/design-system/blob/main/design.md).** Para sincronizar con la última versión: `cp ../design-system/design.md docs/DESIGN.md` y restaurar este bloque. Las referencias internas a `CLAUDE.md` y `packages/ui/...` que aparecen abajo apuntan al **repo del DS** (contribuir al DS, archivos fuente de componentes), **no a este repo** — en olibia-web los componentes se consumen vía `@biaenergy/ui`, nunca se editan.

> **Para agentes que generan o modifican UI consumiendo `@biaenergy/ui` (Claude Code, Cursor, Codex, GPT, etc.).** Este archivo es la fuente única de las **reglas de diseño** del DS — qué componente usar, qué token, qué jerarquía, qué patrones, qué evitar.
>
> Su contraparte hermana [`CLAUDE.md`](CLAUDE.md) cubre el lado del **contribuidor** del DS: cómo está estructurado el repo, los comandos para agregar o actualizar componentes (`/add-component`, `/update-component`), instalación de los componentes en el monorepo, flujo de release y CI/CD. **Si vas a tocar el código del DS mismo (en lugar de consumirlo desde otra app), empieza por ahí** — y vuelve aquí cuando tengas que decidir qué tokens son válidos, qué jerarquía respetar, o documentar una nueva variante.
>
> **Los componentes y los tokens se usan tal como vienen.** No edites archivos de [`packages/ui/src/components/`](packages/ui/src/components/), no inventes colores, no reescribas variantes. Si algo no se ve como quieres, lo más probable es que estés usando el componente equivocado o el token incorrecto — lee este archivo antes de improvisar.

---

## §0 · Cómo usar este archivo

Este documento está pensado para que un agente lea estas reglas **antes** de generar JSX, y las cite **dentro** del JSX cuando una elección no sea obvia.

**Cómo leerlo:**

1. **Las reglas (§1) ganan sobre los ejemplos.** Si un snippet en otro lado de la docs contradice una regla aquí, la regla manda — el snippet probablemente está desactualizado.
2. **Cada regla, anti-patrón y ambigüedad tiene un ID estable** (`R1`, `R2`, ..., `AP1`, ..., `Q1`, ...). Cuando tomes una decisión no obvia (ej. usar `FancyButton` en lugar de `Button.Root variant="primary"`), referencia el ID en un comentario inline o en el commit message — vuelve auditable lo que hiciste.
3. **El archivo es prescriptivo, no exhaustivo.** Para detalles (props completas, variantes secundarias, ejemplos visuales), sigue el link `**docs:**` de cada componente. Para ver variantes en vivo: [Storybook](https://biaenergy.github.io/design-system/storybook/).
4. **El idioma es deliberado.** Prosa en español (mantiene el voice opinionado del DS). Keys estructurales (`when:`, `avoid:`, `api:`, `pair:`, `docs:`) en inglés para que el parsing sea consistente.
5. **Si una regla y un código existente del proyecto del usuario conflictúan**, no asumas que la regla está mal — pregunta al usuario antes de cambiar el código existente. El DS evoluciona; las pantallas viejas pueden estar legítimamente fuera de fecha.

**Cómo NO usarlo:**

- No copies snippets enteros sin entender qué regla los justifica. Un snippet con `bg-bg-white-0` es válido **porque** R3 lo permite — no porque "el ejemplo lo decía".
- No agregues abstracciones (wrappers, hooks custom, theme providers extra) sobre los componentes del DS. La API namespace (`Component.Root`, `Component.Icon`) es la abstracción.
- No reescribas un componente "para que se vea más BIA". Si el look está mal, los tokens están mal — abre un issue en el repo del DS, no parchees el consumidor.

**Scope — design vs performance:** este archivo cubre **decisiones de diseño** (qué componente, qué token, qué jerarquía). Para **performance de React/Next.js** — crear páginas nuevas, refactorizar, eliminar waterfalls, optimizar bundle, decidir Server vs Client Components, data fetching, re-render optimization — usa el skill paralelo [React Performance](https://biaenergy.github.io/design-system/docs/ai-instructions/react-performance/) (basado en `vercel-labs/agent-skills`, 70 reglas en 8 categorías priorizadas por impacto). Los dos archivos son complementarios: `design.md` te dice **qué** mostrar, `react-performance` te dice **cómo** entregarlo rápido. Cuando refactores o crees una página nueva, lee los dos.

**Outputs sólidos siempre incluyen:**

- Imports desde `@biaenergy/ui` y `@biaenergy/ui/icons` (nunca `@remixicon/react`, ver `R2`).
- Tokens semánticos (`bg-bg-white-0`, `text-text-strong-950`), nunca paletas crudas (`bg-teal-400`, ver `R5`).
- La jerarquía de botones correcta (FancyButton para primary, Button basic para secondary, ver `R7`).
- Forms compuestos con `Label` + control + `Hint` (ver `R9`).

---

## §1 · Reglas no negociables

Las 13 reglas que definen qué es código "BIA-correcto". Cada una tiene un **rationale** (por qué existe) y, cuando aplica, un **ejemplo bad/good**. Cita el ID (`[R3]`) cuando una decisión dependa de la regla.

---

### R1 — Componentes se usan tal como vienen

**Regla:** No edites archivos en [`packages/ui/src/components/`](packages/ui/src/components/). Cualquier ajuste visual va en [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). Como consumidor, **nunca** reimplementes un componente "porque le falta una variante" — pide la variante en el DS antes.

**Rationale:** Los componentes se integran al repo manualmente (no via CLI). Modificar un componente integrado desincroniza el archivo de su versión fuente y rompe el flujo `/update-component`. Los tokens son el escape hatch — fueron diseñados para absorber el branding sin tocar lógica.

**bad:**

```tsx
// Forkeas Button para agregar un mode="huge"
function HugeButton({ children }) {
  return <button className="bg-primary-base text-static-white px-12 py-6">{children}</button>;
}
```

**good:**

```tsx
// Usas el size más grande del Button del DS, o pides el size en el repo del DS
<FancyButton.Root size="medium">{children}</FancyButton.Root>
```

---

### R2 — Iconos solo desde `@biaenergy/ui/icons`

**Regla:** Importa íconos exclusivamente desde el subpath `@biaenergy/ui/icons`. **Nunca** desde `@remixicon/react` directamente, aunque sea el mismo paquete.

**Rationale:** El subpath envuelve los íconos como client references (`'use client'`) auto-generados por [`packages/ui/scripts/generate-icons.mjs`](packages/ui/scripts/generate-icons.mjs). Importar desde `@remixicon/react` rompe el RSC boundary de Next.js App Router con el error: _"Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'"_. Pasarlos como prop (`<Button.Icon as={Icon} />`) desde un Server Component **solo funciona** con la versión wrapped.

**bad:**

```tsx
import { RiArrowRightSLine } from '@remixicon/react'; // 💥 falla en Server Component
```

**good:**

```tsx
import { RiArrowRightSLine } from '@biaenergy/ui/icons';
```

---

### R3 — El shell usa solo `bg-weak-25` (frame) + `bg-white-0` (card)

**Regla:** El layout de la app — el shell exterior con sidebar, top bar y card de contenido — usa **exactamente dos** tokens de fondo, anidados:

- `bg-weak-25` para el frame exterior (la "página").
- `bg-white-0` para el card interior donde vive el contenido.

Otros tokens de superficie (`bg-strong-950`, `bg-surface-800`, `bg-soft-200`, `bg-sub-300`) son para casos puntuales o invertidos (snackbars dark-on-light, tooltips, paneles inversos), **no para el shell normal**. `bg-weak-50` se reserva para zonas de input/code block dentro de un card.

**Rationale:** El producto BIA es minimal. Un shell con solo dos tokens consigue contraste suficiente con cero ruido visual. Auto-flippean en dark — `bg-weak-25` pasa a `#1c1c1c` y `bg-white-0` a `#171717`, así el card termina siendo el elemento **más oscuro** en dark y el **más claro** en light, sin código condicional.

**bad:**

```tsx
<div className="bg-bg-strong-950 p-6">           {/* 💥 token invertido — fondo negro en light */}
  <div className="bg-bg-soft-200 rounded-xl">    {/* 💥 ni frame ni card */}
    ...
```

**good:**

```tsx
<div className="bg-bg-weak-25 p-6">                                    {/* frame */}
  <div className="bg-bg-white-0 rounded-xl ring-1 ring-stroke-soft-200">   {/* card */}
    ...
```

---

### R4 — `brand-*` (teal) es acento, no fill

**Regla:** El color de marca BIA (`--color-brand-base`, teal-400 en light / teal-500 en dark) aparece **únicamente** en estos lugares (allowlist):

- `Checkbox.Root` checked
- `Radio.Item` selected
- `Switch.Root` checked
- `Slider.Root` track activo
- `ProgressBar.Root` color default
- `ProgressCircle.Root` color default
- `LinkButton.Root` variant primary
- `Chart.*` serie 1 (`--color-chart-1`)

Para todo lo demás, la respuesta es **`primary-*`**. Si tu pantalla "necesita más color", la respuesta no es teal — es revisar si la jerarquía está mal montada.

**Rationale:** El producto BIA es blanco/negro como base, teal como acento ocasional. La escala primary hace todo el trabajo pesado. Si el teal aparece en muchos lugares, pierde la fuerza de "esto es marca" y se vuelve decoración.

**bad:**

```tsx
<button className="bg-brand-base text-static-white">Confirmar</button>  {/* 💥 brand para CTA */}
```

**good:**

```tsx
<FancyButton.Root>Confirmar</FancyButton.Root>  {/* primary-* via FancyButton */}
```

---

### R5 — Cero paletas crudas en componentes

**Regla:** No uses `bg-teal-400`, `text-blue-500`, `border-red-300` ni ninguna otra paleta cruda en código de aplicación. Solo tokens semánticos (`bg-brand-base`, `text-error-base`, `border-stroke-soft-200`).

Las paletas crudas (`teal-*`, `gray-*`, `blue-*`, etc.) **existen** en `tokens.css` pero **solo para construir tokens semánticos nuevos**. Si necesitas un crudo en una vista, eso significa que falta un semántico — abre un issue en el repo del DS antes de improvisar.

**Excepción única documentada:** el hover translúcido sobre el shell (ver `R6`).

**Rationale:** Un crudo no auto-flippea en dark mode (`teal-400` se queda igual en ambos modos), no comunica intención semántica ("¿por qué teal aquí?") y rompe la centralización del branding — un cambio de marca futuro tendría que tocar N archivos.

**bad:**

```tsx
<div className="border-red-300 bg-teal-400 text-white">...</div>
```

**good:**

```tsx
<div className="bg-brand-base text-static-white border-error-base">...</div>
```

---

### R6 — Auto-flip dark: nunca escribas `dark:` sobre tokens

**Regla:** Los tokens semánticos (`bg-bg-white-0`, `text-text-strong-950`, `ring-stroke-soft-200`, etc.) **ya** flippean automáticamente cuando hay un ancestor con la clase `dark`. No escribas variantes `dark:bg-...`, `dark:text-...`, `dark:ring-...` sobre tokens. Un solo token, dos modos.

**Excepción única documentada (la única en todo el DS):** los hovers translúcidos sobre el frame del shell. Por la asimetría intencional del producto BIA (en light el hover **aclara**, en dark el hover **oscurece**), aplican con dos clases distintas:

```tsx
<button className="dark:hover:bg-bg-white-0/60 hover:bg-neutral-200/70">...</button>
```

Aplica a: icon buttons del header, items de tabs en el rail, triggers de menú sobre el shell, botones de chevron de navegación, hovers de iconos en una sidebar. Si tu hover no es sobre el frame del shell, **no aplicas esta excepción**.

**Rationale:** Si tienes que `dark:` un token, el token está mal o estás usando el token equivocado. Toda la arquitectura de tokens fue diseñada para resolver dark mode con un solo identificador.

**bad:**

```tsx
<div className="bg-bg-white-0 dark:bg-bg-strong-950 text-text-strong-950 dark:text-text-white-0">
  ...
</div>
```

**good:**

```tsx
<div className="bg-bg-white-0 text-text-strong-950">
  {/* auto-flip: en dark se ve oscuro automáticamente */}
</div>
```

---

### R7 — Jerarquía estricta de botones

**Regla:** El producto BIA tiene **un set acotado** de botones, con jerarquía explícita:

| Rol                                               | Componente                                    | Notas                                                                                                            |
| ------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Primary** (acción protagonista)                 | `FancyButton.Root` (default)                  | Una por pantalla/modal. "Guardar", "Confirmar", "Continuar".                                                     |
| **Primary destructive**                           | `FancyButton.Root variant="destructive"`      | "Eliminar", "Borrar cuenta". Solo cuando la acción es destructiva.                                               |
| **Secondary** (acompaña al primary)               | `Button.Root variant="basic"`                 | "Cancelar", "Volver", filtros, edición sin confirmación crítica. **El default cuando dudas qué Secondary usar.** |
| **Secondary error** (destructivo no-protagonista) | `Button.Root variant="error" mode="stroke"`   | "Eliminar este item" en una row.                                                                                 |
| **Tertiary**                                      | `Button.Root mode="lighter"` o `mode="ghost"` | Cuando hay 3+ botones agrupados y quieres que algunos pesen aún menos.                                           |
| **Acción de un solo icono pequeño**               | `CompactButton.Root`                          | Cerrar (X), more (...), edit en fila, navegación entre items. **Obligatorio para X — sin excepciones.**          |
| **Acción inline tipo link**                       | `LinkButton.Root`                             | Acción terciaria dentro de un párrafo o fila de tabla.                                                           |
| **Set mutuamente excluyente chico**               | `ButtonGroup.Root` + `ButtonGroup.Item`       | Toggle de período (Day/Week/Month), alineación. Si es multi-select, no es esto.                                  |

**Reglas duras:**

- **No uses `Button.Root variant="primary"`.** Existe en el código por compatibilidad histórica, pero **no es parte del lenguaje BIA** — para acción protagonista, `FancyButton`. Si ves `<Button.Root variant="primary">` en código existente, es un bug a corregir.
- **No uses `<FancyButton.Root variant="neutral">` ni `variant="primary"` explícito.** El default ya renderiza el Primary correcto; escribir el variant es ruido o lleva a un render inconsistente.
- **`Button.Root mode="filled"` casi nunca.** Compite visualmente con FancyButton. Solo si tienes una razón explícita (un secundario muy crítico en una pantalla sin Primary).
- **Una sola Primary por pantalla/modal.** Dos FancyButtons compiten por el ojo del usuario.

**Rationale:** La jerarquía consistente entre pantallas es lo que hace que el producto se sienta unificado. Un agente que mete `<Button.Root variant="primary">` para "el botón de guardar" rompe esa consistencia silenciosamente.

**bad:**

```tsx
<Button.Root variant="primary">Confirmar</Button.Root>
<Button.Root variant="primary">Cancelar</Button.Root>  {/* 💥 dos primaries, ninguno es FancyButton */}
```

**good:**

```tsx
<FancyButton.Root>Confirmar</FancyButton.Root>
<Button.Root variant="basic">Cancelar</Button.Root>
```

---

### R8 — Namespace API: usa dot-access, no destructuring

**Regla:** Cada componente expone un namespace (`Button`, `Input`, `Modal`, etc.) con sub-componentes accedidos vía dot-access (`Button.Root`, `Input.Wrapper`, `Modal.Header`). **No destructures** el namespace en variables locales.

**Rationale:** El namespace se compone server-side en [`packages/ui/src/index.ts`](packages/ui/src/index.ts) (módulo sin `'use client'`). Sus valores son client references válidos cuando se acceden vía dot-access desde Server Components. Destructurar (`const { Root } = Button`) puede romper el RSC boundary en algunos bundlers — no vale la pena el riesgo, además de que el dot-access deja explícito de qué componente viene cada pieza.

**bad:**

```tsx
const { Root, Icon } = Button; // 💥 evita
return (
  <Root>
    <Icon as={RiAddLine} />
    Click me
  </Root>
);
```

**good:**

```tsx
return (
  <Button.Root>
    <Button.Icon as={RiAddLine} />
    Click me
  </Button.Root>
);
```

---

### R9 — Errors van en pareja Input + Hint, nunca rojo flotante

**Regla:** El estado de error de un campo de formulario se comunica con **dos** componentes juntos:

1. El control con `hasError` (Input, Textarea) o el equivalente (Select muestra ring de error automáticamente cuando vive en un wrapper con error).
2. Un `Hint.Root` debajo, con `Hint.Icon as={RiErrorWarningFill}` y el mensaje.

**No uses** texto rojo suelto, mensajes flotantes encima del campo, tooltips de error, ni un `<p className="text-error-base">` improvisado.

**Rationale:** El borde rojo del Input + el Hint debajo son el par canónico — comunican "este campo tiene un problema, aquí está el detalle". Inventar variantes rompe la affordance: el usuario aprende un patrón en una pantalla y lo busca en la siguiente.

**bad:**

```tsx
<Input.Root>
  <Input.Wrapper>
    <Input.Input value={email} />
  </Input.Wrapper>
</Input.Root>;
{
  error && <p className="mt-1 text-sm text-red-500">Email inválido</p>;
}
{
  /* 💥 */
}
```

**good:**

```tsx
<Input.Root hasError={!!error}>
  <Input.Wrapper>
    <Input.Input value={email} />
  </Input.Wrapper>
</Input.Root>;
{
  error && (
    <Hint.Root hasError>
      <Hint.Icon as={RiErrorWarningFill} />
      Email inválido
    </Hint.Root>
  );
}
```

---

### R10 — Overlays con stacking-context conflictivo van con `PortalContainer`

**Regla:** Si un `Modal`, `Dropdown`, `Popover`, `Tooltip` o `Select` se renderiza dentro de un container que tiene `transform`, `filter`, `perspective`, `contain`, `will-change` o un nuevo stacking context (sidebars con `transform: translate`, drawers animados, modales anidados), **envuélvelo** con `PortalContainerProvider` apuntado al portal target correcto.

**Rationale:** Los overlays usan `Portal` de Radix por default, que monta en `document.body`. Cuando el container padre tiene un stacking context, el portal puede aparecer detrás del container en vez de encima, o quedar clipped por `overflow: hidden`. `PortalContainerProvider` redirige el portal al container que tú eliges.

**bad:**

```tsx
<div className="transform-gpu">
  {' '}
  {/* crea stacking context */}
  <Dropdown.Root>
    <Dropdown.Trigger>...</Dropdown.Trigger>
    <Dropdown.Content>...</Dropdown.Content> {/* 💥 puede aparecer detrás */}
  </Dropdown.Root>
</div>
```

**good:**

```tsx
const containerRef = useRef<HTMLDivElement>(null);
return (
  <div ref={containerRef} className="transform-gpu">
    <PortalContainerProvider container={containerRef.current}>
      <Dropdown.Root>
        <Dropdown.Trigger>...</Dropdown.Trigger>
        <Dropdown.Content>...</Dropdown.Content>
      </Dropdown.Root>
    </PortalContainerProvider>
  </div>
);
```

---

### R11 — Server Components: callbacks/funciones solo desde módulos `'use client'`

**Regla:** Cualquier valor de tipo función pasado como prop **desde un Server Component a un Client Component** debe venir de un módulo marcado con `'use client'`. Los íconos de `@biaenergy/ui/icons` ya cumplen esto. Tus event handlers, render props, y funciones custom deben definirse en archivos `'use client'` (o el componente que los recibe debe estarlo).

**Rationale:** Next.js App Router serializa props en el límite server→client. Las funciones no son serializables, así que solo pueden cruzar como **client references** — punteros a funciones definidas en módulos client. Pasar una función plana de un Server Component da el error "Functions cannot be passed directly to Client Components".

**bad:**

```tsx
// app/page.tsx (Server Component, sin 'use client')
import { Button } from '@biaenergy/ui'

export default function Page() {
  return <Button.Root onClick={() => alert('hi')}>Click</Button.Root>  {/* 💥 onClick no se serializa */}
}
```

**good:**

```tsx
// app/click-button.tsx
'use client';
import { Button } from '@biaenergy/ui';
export function ClickButton() {
  return <Button.Root onClick={() => alert('hi')}>Click</Button.Root>;
}

// app/page.tsx (Server Component)
import { ClickButton } from './click-button';
export default function Page() {
  return <ClickButton />;
}
```

---

### R12 — Storybook = playground, docs MDX = doc oficial

**Regla:** Cuando dudes sobre una variante, prop o comportamiento de un componente:

- **Para explorar variantes en vivo y tocar props con controles** → [Storybook](https://biaenergy.github.io/design-system/storybook/).
- **Para narrativa, do's/don'ts, props canónicas y los patterns oficiales** → [docs site](https://biaenergy.github.io/design-system/) (cada componente tiene una página `/docs/<group>/<name>`).
- **Para reglas vinculantes que no puedes violar sin pedir permiso** → este archivo (`design.md`).

**Rationale:** Cada surface tiene rol distinto. Storybook responde "¿qué hace si le paso `mode='ghost'`?". La docs site responde "¿cuándo debería usarlo?". `design.md` responde "¿qué decisión tomar cuando hay ambigüedad?".

---

### R13 — Iconos: Line por default, Fill solo para selección activa crítica

**Regla:** Línea (`*Line` icons) es el **default** del producto BIA — siempre. Contornos finos, no rellenos: los íconos son señalética, no manchas de color. Fill (`*Fill`) es la **excepción**, no la norma. Se reserva exclusivamente para indicar **selección activa en lugares ultra importantes** del producto (ej. el item activo de la navigation principal, una acción crítica que el usuario necesita ver "armada"). Para el resto de selecciones se sigue usando Line — la selección la marca el contenedor (background, border, peso del texto), no el ícono. **Cuando dudes, Line.**

**Rationale:** El producto BIA es minimal — contornos finos, coherentes con la escala primary y la filosofía blanco/negro. Si todos los íconos seleccionados se llenan, "fill" pierde el peso semántico de "lugar crítico" y se vuelve decoración. Llenar un ícono debe ser una decisión consciente con razón explícita, no el comportamiento automático ante cualquier `aria-selected` o `data-state="on"`.

**bad:**

```tsx
{
  /* Tab activo dentro de un SegmentedControl común — no es un lugar crítico */
}
<SegmentedControl.Trigger value="day">
  <Icon as={isActive ? RiCalendarFill : RiCalendarLine} /> {/* 💥 fill innecesario */}
  Día
</SegmentedControl.Trigger>;
```

**good:**

```tsx
{
  /* Tab activo en un control común — la selección la marca el contenedor (bg + indicator), el ícono se queda Line */
}
<SegmentedControl.Trigger value="day">
  <Icon as={RiCalendarLine} />
  Día
</SegmentedControl.Trigger>;

{
  /* Excepción: item activo de la navigation principal — lugar crítico, fill explícito */
}
<TabMenuVertical.Trigger value="home">
  <TabMenuVertical.Icon as={isActive ? RiHomeFill : RiHomeLine} />
  Home
</TabMenuVertical.Trigger>;
```

---

## §2 · Setup mínimo

Cuatro pasos para que `@biaenergy/ui` funcione en una app Next.js (o cualquier proyecto React 19 + Tailwind v4). Si ya están hechos, salta a §3.

> **¿Estás trabajando IN el repo del DS mismo** (agregando un componente nuevo, ajustando tokens, preparando un release)? Esta sección no aplica — esto es setup del **consumidor**. Para setup del repo del DS, scripts disponibles, estructura del monorepo, flujo `/add-component`, `/update-component`, CI/CD y publicación, ver [`CLAUDE.md`](CLAUDE.md).

### 1. Instalación

```bash
pnpm add @biaenergy/ui
pnpm add -D tailwindcss @tailwindcss/postcss tw-animate-css
```

`react` y `react-dom` se asumen ya presentes en el proyecto. Todo lo demás (Radix UI, `@remixicon/react`, `sonner`, `react-day-picker`, `recharts`, `react-otp-input`) viene incluido en `@biaenergy/ui` y **no requiere instalación adicional** desde el consumidor.

`@biaenergy/ui` vive en GitHub Packages — el `.npmrc` del proyecto (o tu `~/.npmrc` global) necesita:

```
@biaenergy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxx
```

con un Personal Access Token que tenga scope `read:packages`. Sin esto, `pnpm add` falla con 401.

### 2. Estilos globales

En tu `globals.css` (o el archivo CSS raíz del proyecto):

```css
@import 'tailwindcss';
@import '@biaenergy/ui/styles.css';

/* Permite que Tailwind compile las clases que usa @biaenergy/ui */
@source '../node_modules/@biaenergy/ui/dist';

/* Activa la variante dark basada en clase (no en media-query) */
@custom-variant dark (&:where(.dark, .dark *));
```

`styles.css` ya incluye los tokens (colores, tipografía, sombras) y los resets base. **No importes `tokens.css` por separado** salvo que necesites saltarte los resets — es raro.

### 3. Dark mode

Los tokens flippean automáticamente cuando hay un ancestor con clase `dark`. Para activarlo:

```tsx
<html lang="es" className="dark">
  ...
</html>
```

Lo más común es usar [`next-themes`](https://github.com/pacocoursey/next-themes):

```tsx
'use client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

Cualquier componente de `@biaenergy/ui` que use tokens (`bg-bg-white-0`, `text-text-strong-950`, etc.) responde automáticamente — **ver `R6`**, no escribas `dark:` en tu componentería.

Para forzar un modo en una sección puntual (un preview con tema fijo):

```tsx
<div className="dark">
  {/* este bloque siempre renderiza con tokens oscuros */}
  <Button.Root>Dark</Button.Root>
</div>
```

### 4. Iconos (RSC-safe)

Importa íconos siempre desde `@biaenergy/ui/icons` (ver `R2`):

```tsx
import { RiArrowRightSLine, RiCloseLine, RiCheckLine } from '@biaenergy/ui/icons';
```

El subpath re-exporta todos los íconos de Remix Icon como client references, así puedes pasarlos como prop (`<Button.Icon as={Icon} />`) desde un Server Component sin romper el RSC boundary. Importar de `@remixicon/react` directo **falla**.

### 5. Uso básico

```tsx
import { Button } from '@biaenergy/ui';
import { RiArrowRightSLine } from '@biaenergy/ui/icons';

export default function App() {
  return (
    <Button.Root variant="basic">
      Continuar
      <Button.Icon as={RiArrowRightSLine} />
    </Button.Root>
  );
}
```

---

## §3 · Modelo mental

Cinco conceptos que, una vez internalizados, hacen que las reglas de §1 se sientan obvias. Si tienes que decidir algo no cubierto explícitamente, dedúcelo desde aquí.

### M1 — Jerarquía de acciones (FancyButton → Button → CompactButton/LinkButton)

Cada pantalla tiene **una** acción protagonista, **una o dos** acciones de soporte, y un puñado de acciones terciarias. El DS mapea esto literalmente:

```
[Primary]      FancyButton.Root            ← una por pantalla/modal
[Secondary]    Button.Root variant="basic" ← acompaña al Primary
[Tertiary]     Button.Root mode="lighter"  ← cuando hay 3+ botones
              Button.Root mode="ghost"     ← más sutil que lighter
[Icon-only]    CompactButton.Root          ← X, more, edit
[Inline]       LinkButton.Root             ← dentro de párrafo/row
```

Si te encuentras eligiendo entre cuatro botones del mismo peso visual, repiensa la jerarquía: probablemente uno de ellos debería ser tertiary o no estar.

### M2 — Two-layer surface system (frame + card)

El layout de la app es **dos** rectángulos anidados:

```
┌─ bg-bg-weak-25 (frame, exterior, "página") ─────────────┐
│                                                          │
│   ┌─ bg-bg-white-0 (card, interior, contenido) ─────┐    │
│   │                                                  │    │
│   │   [Sidebar]    [Main content]                    │    │
│   │                                                  │    │
│   └──────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

En light: frame = `#f7f7f7`, card = `#ffffff` (card más claro).
En dark: frame = `#1c1c1c`, card = `#171717` (card más oscuro).

La inversión es deliberada — el card termina siendo el elemento de **mayor contraste** contra el frame en cualquier modo. **No hace falta código condicional por tema** (R6).

Otros tokens de superficie son para casos puntuales (R3): `bg-weak-50` para inputs/code blocks dentro del card, `bg-strong-950`/`bg-surface-800` para superficies invertidas (snackbars dark-on-light, paneles inversos).

### M3 — Tokens semánticos vs paletas crudas

```
Paletas crudas    →  Tokens semánticos    →  Componentes
(teal-400)        →  (brand-base)         →  (Switch checked)

Existen para...      Existen para...         Existen para...
construir tokens     que tú los uses.       que tú los compongas.
nuevos en el DS.     Nunca uses crudos.      Nunca los reescribas.
```

La regla del semántico-o-issue (R5): si necesitas un crudo en una vista, **es señal de que falta un semántico**. Pídelo en el repo del DS antes de improvisar.

### M4 — Namespace API + composición

Cada componente expone un objeto con sub-componentes:

```tsx
import { Button, Input, Modal } from '@biaenergy/ui';

Button = { Root, Icon };
Input = { Root, Wrapper, Input, Icon, Affix, InlineAffix };
Modal = {
  Root,
  Trigger,
  Close,
  Portal,
  Overlay,
  Content,
  Header,
  Title,
  Description,
  Body,
  Footer
};
```

Componer = anidar los sub-componentes en el orden esperado. Casi todos siguen `Root` (envoltorio + variantes) + sub-componentes opcionales.

**Polimorfismo con `asChild`** (de Radix Slot): `<Button.Root asChild><a href="/x">Ir</a></Button.Root>` renderiza un `<a>` con el estilado de Button — útil para que un link semántico se vea como botón. Disponible en la mayoría de los `Root`s.

**Iconos como prop:** sub-componentes tipo `Icon` (`Button.Icon`, `Input.Icon`, `CompactButton.Icon`) toman `as={IconComponent}` y heredan tamaño/color del padre. Nunca pongas un `<svg>` plano dentro de un slot de icono.

### M5 — Auto-flip dark mode (la regla del único token)

```tsx
{
  /* En light: bg-white-0 = #ffffff, text-text-strong-950 = #171717 */
}
{
  /* En dark:  bg-white-0 = #171717, text-text-strong-950 = #ffffff */
}
<div className="bg-bg-white-0 text-text-strong-950">
  Funciona en ambos modos sin código condicional.
</div>;
```

Un token, dos modos. **La excepción única documentada (R6)** son los hovers translúcidos sobre el shell, donde la asimetría intencional del producto BIA requiere dos clases distintas (`hover:bg-neutral-200/70 dark:hover:bg-bg-white-0/60`). Cualquier otro `dark:` sobre tokens es un bug.

---

## §4 · Tabla de decisión rápida

Tabla "necesito... → usa... → evita..." para que un agente pueda elegir el componente correcto en una pasada. Cuando aparezcan dos opciones, el primero es el default.

| Necesito...                                               | Usa                                                                                                                                                                                                                                                             | Evita                                    | Regla |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----- |
| Acción protagonista de la pantalla                        | `FancyButton.Root`                                                                                                                                                                                                                                              | `Button.Root variant="primary"`          | R7    |
| Acción destructiva protagonista                           | `FancyButton.Root variant="destructive"`                                                                                                                                                                                                                        | rojo improvisado                         | R7    |
| Acción secundaria (Cancelar, Volver)                      | `Button.Root variant="basic"`                                                                                                                                                                                                                                   | `mode="filled"`                          | R7    |
| Acción terciaria (3° botón en una fila)                   | `Button.Root mode="lighter"` o `mode="ghost"`                                                                                                                                                                                                                   | inventar un mode nuevo                   | R7    |
| Botón solo con icono pequeño (X, more)                    | `CompactButton.Root` (variant `stroke` o `ghost`)                                                                                                                                                                                                               | un `<button>` con SVG plano              | R7    |
| Acción inline dentro de un párrafo o row                  | `LinkButton.Root`                                                                                                                                                                                                                                               | un `<a>` estilado a mano                 | R7    |
| Toggle entre 2-4 vistas mutuamente excluyentes            | `SegmentedControl.Root`                                                                                                                                                                                                                                         | `ButtonGroup` para vistas                | M1    |
| Set de toggles con bordes continuos (Day/Week/Month)      | `ButtonGroup.Root`                                                                                                                                                                                                                                              | `Tab` para acciones                      | —     |
| Navegar entre 3+ secciones con su propio contenido        | `TabMenuHorizontal.Root`                                                                                                                                                                                                                                        | SegmentedControl                         | —     |
| Sidebar de settings o nav lateral                         | `TabMenuVertical.Root`                                                                                                                                                                                                                                          | accordion como nav                       | —     |
| Campo de texto una línea                                  | `Input.Root` con `Wrapper` + `Input.Input`                                                                                                                                                                                                                      | un `<input>` plano                       | —     |
| Campo de texto multi-línea                                | `Textarea.Root`                                                                                                                                                                                                                                                 | Input con `as="textarea"`                | —     |
| Código OTP/PIN                                            | `DigitInput.Root`                                                                                                                                                                                                                                               | N Inputs concatenados                    | —     |
| Calendario para fecha o rango                             | `Datepicker.Calendar`                                                                                                                                                                                                                                           | Input con `type="date"`                  | —     |
| Selección 1-de-N (set chico, 2-5)                         | `Radio.Group`                                                                                                                                                                                                                                                   | Select                                   | —     |
| Selección 1-de-N (set mediano-grande, 5+)                 | `Select.Root`                                                                                                                                                                                                                                                   | Radio                                    | —     |
| Selección multi (terms, multi-select)                     | `Checkbox.Root`                                                                                                                                                                                                                                                 | Switch                                   | —     |
| Toggle binario instantáneo (sin Save)                     | `Switch.Root`                                                                                                                                                                                                                                                   | Checkbox                                 | —     |
| Subir archivo (DnD + botón)                               | `FileUpload.Root`                                                                                                                                                                                                                                               | input file plano                         | —     |
| Mostrar estado de proceso (completed/pending/failed)      | `StatusBadge.Root`                                                                                                                                                                                                                                              | Badge genérico                           | —     |
| Mostrar conteo, prioridad, atributo del sistema           | `Badge.Root variant="lighter"`                                                                                                                                                                                                                                  | Tag                                      | —     |
| Categoría descriptiva (no interactiva)                    | `Tag.Root`                                                                                                                                                                                                                                                      | Badge                                    | —     |
| Categoría removible por usuario                           | `Tag.Root` con `Tag.DismissButton`                                                                                                                                                                                                                              | botón X custom                           | —     |
| Filtro toggleable que se selecciona/deselecciona          | `Button.Root variant="basic" size="small"` (selected = `bg-weak-50 + text-strong-950 + ring-stroke-sub-300`); para sets de alto contraste sobre superficies ruidosas, **Filtro fuerte** (selected = gradient `neutral-600→950` + texto blanco; flippea en dark) | Tag                                      | R7    |
| Datos comparables en columnas                             | `Table.Root` (con sticky header + sortable heads)                                                                                                                                                                                                               | `<table>` plano                          | —     |
| Stack de avatares con overflow                            | `AvatarGroup.Root` con `AvatarGroup.Overflow`                                                                                                                                                                                                                   | Avatars sueltos uno al lado del otro     | —     |
| Mensaje contextual inline persistente                     | `Alert.Root`                                                                                                                                                                                                                                                    | Toast para errores                       | —     |
| Eco inmediato de acción del usuario ("Guardado")          | Toast (Sonner + `AlertToast.Root`)                                                                                                                                                                                                                              | Notification                             | —     |
| Mensaje del sistema con título + descripción              | `Notification` (`notification(...)` API)                                                                                                                                                                                                                        | Toast                                    | —     |
| Etiqueta hover-only sobre un icono                        | `Tooltip.Root`                                                                                                                                                                                                                                                  | Popover con texto chico                  | —     |
| Panel flotante con contenido libre                        | `Popover.Root`                                                                                                                                                                                                                                                  | Modal para info contextual               | —     |
| Menú accionable anclado a un trigger                      | `Dropdown.Root`                                                                                                                                                                                                                                                 | Popover con lista                        | —     |
| Diálogo bloqueante con decisión obligatoria               | `Modal.Root`                                                                                                                                                                                                                                                    | Popover bloqueante                       | —     |
| Mostrar progreso lineal conocido                          | `ProgressBar.Root`                                                                                                                                                                                                                                              | spinner indeterminado                    | —     |
| Mostrar progreso compacto en una card/KPI                 | `ProgressCircle.Root`                                                                                                                                                                                                                                           | Bar para KPI                             | —     |
| Loading global de página (page-mount)                     | `LoaderBrand.Pill`                                                                                                                                                                                                                                              | LoaderArc full-screen                    | M1    |
| Loading dentro de un botón                                | `LoaderArc.Root size="sm"` (lo mete el Button via `state="loading"`)                                                                                                                                                                                            | spinner custom                           | —     |
| Placeholder de contenido todavía no llegado               | `Skeleton.Root` (con `h-*` `w-*`)                                                                                                                                                                                                                               | LoaderBrand sobre rows                   | —     |
| Atajo de teclado mostrado en un menú/tooltip              | `Kbd.Root`                                                                                                                                                                                                                                                      | un `<code>`                              | —     |
| Ruta jerárquica de 3+ niveles                             | `Breadcrumb.Root`                                                                                                                                                                                                                                               | back button + título                     | —     |
| Stepper lineal con label visible (checkout, wizard)       | `HorizontalStepper.Root`                                                                                                                                                                                                                                        | dots para pasos con label                | —     |
| Stepper en columna (sidebar de progreso)                  | `VerticalStepper.Root`                                                                                                                                                                                                                                          | Horizontal                               | —     |
| Historial cronológico de un proceso (tracking, audit log) | `Timeline.Root`                                                                                                                                                                                                                                                 | VerticalStepper para algo no interactivo | —     |
| Indicador mudo de pocos pasos (carrusel, onboarding 3-4)  | `DotStepper.Root`                                                                                                                                                                                                                                               | HorizontalStepper sin labels             | —     |
| Paginación de tabla/lista con páginas finitas             | `Pagination.Root`                                                                                                                                                                                                                                               | scroll infinito                          | —     |
| Anuncio full-width al top de una vista                    | `Banner.Root`                                                                                                                                                                                                                                                   | Alert para anuncios                      | —     |
| Acordeón para FAQ o detalles secundarios                  | `Accordion.Root`                                                                                                                                                                                                                                                | Tabs como reveal                         | —     |
| Datos estructurados como gráfica                          | `Chart.Bar` / `Chart.Line` / `Chart.Area` / etc.                                                                                                                                                                                                                | recharts directo                         | —     |

---

## §5 · Foundations

Resumen denso de las decisiones de fundamentos. Para detalle visual y razonamiento extendido, los links a la docs site.

### Color → [docs](apps/docs/content/docs/foundations/color.mdx)

**Filosofía:** Sistema minimal blanco/negro. La escala `primary-*` hace todo el trabajo, el `brand-*` (teal) es acento ocasional. Auto-flip dark via tokens semánticos.

**Familias de tokens (todas declaradas en `@theme` dentro de [tokens.css](packages/ui/src/styles/tokens.css)):**

- **`primary-*`** — workhorse del UI. `primary-base` (fills, texto principal, íconos activos), `primary-light`/`primary-lighter` (selected, hovers sutiles, fondos de pills), `primary-dark`/`primary-darker` (hover/pressed sobre fondos oscuros). Más alphas: `primary-alpha-24`, `primary-alpha-16`, `primary-alpha-10`.
- **`brand-*`** — acento BIA teal (R4). `brand-base` (default, teal-400 light / teal-500 dark), `brand-hover` y `brand-focus` (LinkButton primary), `brand-soft` (Switch checked hover).
- **`bg-*`** — superficies. `bg-weak-25` (frame del shell, R3), `bg-white-0` (card del shell, R3), `bg-weak-50` (inputs/code blocks dentro del card), `bg-soft-200`/`bg-sub-300` (separadores rellenos), `bg-strong-950`/`bg-surface-800` (invertidos — snackbars, paneles inversos).
- **`text-*`** — foreground. `text-strong-950` (principal), `text-sub-600` (secundario), `text-soft-400` (metadata, captions), `text-disabled-300` (deshabilitado), `text-white-0` (sobre fondos oscuros).
- **`stroke-*`** — bordes/rings. `stroke-soft-200` (default), `stroke-sub-300` (un escalón más notable, ej. filtros seleccionados), `stroke-strong-950` (énfasis), `stroke-white-0`.
- **Estados semánticos** — cada uno con 4 variantes (`-dark`, `-base`, `-light`, `-lighter`): `information-*`, `warning-*`, `error-*`, `success-*`, `away-*`, `feature-*`, `verified-*`, `highlighted-*`, `stable-*`, `faded-*`.
- **`chart-*`** — series de gráfica: `chart-1` (= brand teal, R4), `chart-2..5` (azul/naranja/morado/amarillo).
- **Estáticos** — no flippean: `static-black`, `static-white` (logos, íconos sobre buttons filled).

**Glass utilities** — superficies translúcidas con `backdrop-blur(40px)` y fill semitransparente que varía por modo:

- **`.glass`** — fill sólido + blur. Para overlays planos.
- **`.glass-popup`** — fill radial + blur + capa de sombras (inner highlights, ring, drop). Para modals, dropdowns, popovers, tooltips con elevación.
- **`.glass-popup-dark-on-light` / `.glass-popup-light-on-dark`** — invertido (snackbars que necesitan contrastar contra el fondo).

**Reglas de uso:**

- Shell: solo `bg-weak-25` + `bg-white-0` (R3).
- Brand: solo en la allowlist (R4): Checkbox/Radio/Switch checked, Slider, ProgressBar/Circle, LinkButton primary, Chart serie 1.
- Cero crudos en componentes (R5).
- No `dark:` sobre tokens (R6), excepción: hover translúcido del shell.

### Typography → [docs](apps/docs/content/docs/foundations/typography.mdx)

**Filosofía:** Inter como fuente principal, escala calibrada para el producto BIA. Cinco familias con propósito semántico claro — usa la familia, no inventes combinaciones de size/weight.

**Familias:**

| Familia        | Uso                                 | Peso          | Tokens                                                                             |
| -------------- | ----------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| **Title**      | Encabezados jerárquicos h1–h6       | 500 (Medium)  | `text-title-h1` (56px) ... `text-title-h6` (20px)                                  |
| **Label**      | Etiquetas UI, botones, inputs       | 500 (Medium)  | `text-label-xl` (24px) ... `text-label-xs` (12px)                                  |
| **Paragraph**  | Cuerpo, descripciones               | 400 (Regular) | `text-paragraph-xl` (24px) ... `text-paragraph-xs` (12px)                          |
| **Subheading** | Section headers con tracking amplio | 500 (Medium)  | `text-subheading-md` (16px) ... `text-subheading-2xs` (11px) — sueles ir uppercase |
| **Doc**        | Contenido editorial largo           | 400 / 500     | `text-doc-paragraph` (18px regular), `text-doc-label` (18px medium)                |

**Baseline del body:** `text-paragraph-sm` (14px / 400), inicializado en [styles.css](packages/ui/src/styles/styles.css). Cualquier texto sin utility tipográfica propia hereda este tamaño.

**Reglas de uso:**

- `h1` solo una vez por página. `h2`–`h6` para jerarquía descendente.
- Mantenete dentro de una familia para elementos del mismo grupo (todos los botones de un form usan `text-label-sm`).
- Para texto de cuerpo importante con contraste de tamaño, sube a `text-paragraph-md` o `text-paragraph-lg` antes de cambiar de familia.

### Icons → [docs](apps/docs/content/docs/foundations/icons.mdx)

**Filosofía:** Remix Icon v4.6.0 vía el subpath wrapped `@biaenergy/ui/icons` (R2). 400+ íconos disponibles, todos como client references.

**Line por default, Fill solo en selección activa crítica (R13).** El producto BIA es minimal — contornos finos, no rellenos. `*Line` cubre el 95% de los casos; `*Fill` se reserva para lugares ultra importantes (item activo de la navigation principal, acción crítica "armada"). En cualquier control común (tab, segmented, dropdown item) la selección la marca el contenedor, no el ícono — el ícono se queda Line.

**Patrón canónico — pasar como prop:**

```tsx
import { RiArrowRightSLine } from '@biaenergy/ui/icons'

<Button.Icon as={RiArrowRightSLine} />
<Input.Icon as={RiSearchLine} />
<CompactButton.Icon as={RiCloseLine} />
```

El sub-componente `Icon` hereda tamaño y color del padre. **Nunca** pongas un `<svg>` plano dentro de un slot de icono — pierdes los ajustes de tamaño automáticos.

**Para usar un icono fuera de un slot** (decorativo, en un empty state, en un Banner):

```tsx
import { RiAlarmWarningLine } from '@biaenergy/ui/icons';

<RiAlarmWarningLine className="text-text-sub-600 size-5" />;
```

### Animations → [docs](apps/docs/content/docs/foundations/animations.mdx)

**Filosofía:** El DS expone una capa de animation tokens reutilizables (`--animate-*`, `--bia-*`) declarados en `@theme`. Las curvas y duraciones están calibradas para que el producto se sienta unificado — no inventes duraciones.

**Tokens por categoría:**

- **Accordion**: `animate-accordion-down`, `animate-accordion-up`, `animate-accordion-item-in`, `animate-accordion-item-in-fast`.
- **Badge**: `bia-badge-pop`, `bia-badge-fade`, `bia-badge-slide` (durations + easing).
- **Icon/Text swaps**: `bia-icon-swap-*`, `bia-text-swap-*` (blur, duration, ease, scale/translate — para transiciones entre íconos o textos en el mismo slot).
- **Digit input**: `bia-digit-stagger`, `bia-digit-distance`, `bia-digit-blur` (animación de aparición secuencial de dígitos OTP).
- **Page transitions**: `bia-page-fade`, `bia-page-slide`, `bia-page-blur` (transiciones de ruta).
- **Panel/Resize**: `bia-panel-*`, `bia-resize-*` (paneles colapsables, drawers).
- **Loaders**: `bia-loader-arc-spin` (1s linear infinite — la curva linear es deliberada para el loop), `bia-loader-brand-ripple` (wave concéntrico del LoaderBrand).
- **Skeleton**: `bia-skeleton-wave` (mask diagonal moviéndose, no el dot-pattern).
- **Button lifecycle**: `.bia-button-content` (fade-out + blur + scale-down), `.bia-button-shake` (5-stop keyframe), `bia-confetti-burst` (CSS confetti del success state).

**`prefers-reduced-motion`:** las animaciones largas (skeleton wave, confetti, button shake) se desactivan automáticamente; los spinners (LoaderArc) quedan visibles pero estáticos.

### Navigation shell → [docs](apps/docs/content/docs/foundations/navigation.mdx)

**Filosofía:** El shell de la app se construye **solo con componentes y tokens del DS**. Cero CSS suelto. El [block de navigation](apps/docs/content/docs/foundations/navigation.mdx) muestra cómo se compone una app real entera — sirve como referencia. Cinco invariantes:

1. **Card = héroe, chrome = fondo.** Card `bg-white-0`, chrome (top bar + sidebar) `bg-weak-25` (R3). En light el card es lo más claro; en dark, lo más oscuro. Mismo invariante en ambos temas, sin condicional.
2. **Una sola jerarquía.** El switch de sección vive en el dropdown del top bar (icono filled de la sección activa con `glass-popup`). No hay rail vertical adicional — todo el árbol entra en el sidebar.
3. **Colapso silencioso.** Iconos no se mueven al colapsar el sidebar; los textos se desvanecen con `opacity` (no se desmontan). Padding constante, `overflow-x-clip` en wrappers que recortan.
4. **Cada tab es su propio workspace.** Cada document tab guarda su propia `(section, sub-item)`. Clickear otro tab restaura su estado exacto — no absorbe los del tab anterior.
5. **Sólo piezas del DS, cero CSS suelto.**

**Composición del shell (lo que renderiza el block de referencia):**

- **Frame (página):** `bg-weak-25` con `px-2 pb-2 pt-0.5`.
- **Card (contenido):** `bg-white-0` con `rounded-2xl ring-1 ring-stroke-soft-200`. Header del card lleva **solo** título `text-title-h5` + descripción `text-paragraph-sm text-text-sub-600`. Sin breadcrumb (la jerarquía la da el tab activo + el menú lateral).
- **Top bar (`h-12`):**
  - **Section dropdown** (en desktop, alineado al ancho del sidebar via `bia-resize`): `Dropdown.Root` con trigger custom = `glass-popup` envolviendo el icono filled de la sección + label `text-label-md` + chevron `RiExpandUpDownLine`. Items con `IconLine` por sección.
  - **Toggle / back / forward:** `CompactButton.Root variant="ghost" size="large"`. El toggle alterna entre `RiSidebarFoldLine` ↔ `RiSidebarUnfoldLine` (desktop) y `RiMenuLine` (mobile).
  - **Document tabs:** scrolleables horizontalmente (wheel vertical → `scrollLeft`), con dividers verticales que aparecen solo cuando hay overflow en ese lado. Cada tab muestra `section › item` con close hover. "+" para nueva pestaña vive fuera del scroll.
  - **Cluster derecho:** historial con `CompactButton.Root variant="ghost"` + AI button con `FancyButton.Root variant="basic"` e icono `RiSparkling2Fill` (excepción Fill, R13 — el único Fill del shell). Hover anima rotación + scale del sparkle.
- **Sidebar (desktop in-flow `w-60` ↔ `w-[52px]` via `bia-resize`; mobile drawer fixed con backdrop + Escape):**
  - **Search `⌘K`:** botón con `bg-white-0` + `shadow-regular-xs`, abre `SearchModal`. `RiSearchLine` + label "Buscar…" + `Kbd.Root>⌘K</Kbd.Root>`. Tooltip "Buscar (⌘K)" cuando el sidebar está colapsado.
  - **Menú vertical:** `TabMenuVertical.Root` con `Group` + `GroupTrigger` + `GroupContent` + `SubItem` para multinivel. Al cambiar sección, dos slots cruzan con `bia-page-slide` (direccional por índice de sección). Colapsado: SubItems pasan a pills `size-7` con las primeras 2 letras + Tooltip `side="right"`.
  - **Footer del sidebar:** `Avatar.Root` + nombre/empresa + chevron en cuadradito `ring-stroke-soft-200`. Click abre `Dropdown.Content side="top"` con header de usuario (avatar + email + **toggle sol/luna** integrado a la derecha, con `stopPropagation` para no cerrar el menú) + items: Settings de empresa, Mi cuenta, Preferencias, Cerrar sesión.
- **Section switch (loader):** al cambiar sección, contenido del card fade-out → `LoaderBrand.Pill size="md"` centrado con fade + zoom 94 → 100%, hold 3s → fade-in del nuevo contenido. El header del card y el menú lateral cruzan en paralelo con `bia-page-slide`.
- **Responsive (tres breakpoints, sin reflujo brusco):**
  - `≥ lg` (1024px+): sidebar in-flow abierto por default.
  - `sm..lg` (640–1023px): sidebar in-flow pero **auto-colapsa una sola vez al entrar** al rango. El usuario puede reabrirlo con el toggle.
  - `< sm` (≤ 639px): sidebar se vuelve drawer fixed con backdrop. El section dropdown migra dentro del drawer. Cierra con backdrop, Escape o al elegir sección/sub-item. La transition del slide se habilita un frame después del switch a mobile (evita slide-out fantasma desde la posición in-flow previa).

**Hover sobre el frame del shell — la única excepción `dark:` (R6):**

```tsx
<button className="dark:hover:bg-bg-white-0/60 hover:bg-neutral-200/70">...</button>
```

Aplica a icon buttons del header, items de tabs sobre el chrome, triggers de menú sobre el shell, hovers de íconos en una sidebar. Si tu hover no es sobre el frame del shell, no aplicas esta excepción.

---

## §6 · Componentes

50 cards, agrupadas en 9 secciones. Cada card sigue el schema:

```
### ComponentName — One-line descriptor
**when:** El 60% del caso de uso.
**avoid:** El 30% del error que un agente comete.
**api:** Component.Root { props clave } · Component.SubA { props } · ...
**pair:** Con qué otros componentes se compone canónicamente.
[snippet canónico]
**docs:** /docs/<group>/<name>
```

`api:` lista solo las props que un agente elige (variant, size, mode, asChild, status, value/onChange en controlados). Para la tabla completa, sigue el link `**docs:**`.

---

### §6.1 — Actions

#### Button — Secondary action button

**when:** Acciones secundarias del producto BIA — "Cancelar", "Volver", filtros, edición sin confirmación crítica, acciones de soporte. **Default cuando dudas qué Secondary usar:** `variant="basic"`. Para filtros toggleables, `variant="basic" size="small"` con estado seleccionado replicando el visual del hover (`bg-weak-50` + `text-strong-950` + `ring-stroke-sub-300`). Para **Filtro fuerte** (sets de alto contraste sobre superficies ruidosas): `Button.Root variant="basic" size="xsmall"` por defecto (`small` solo cuando los filtros son la acción principal del toolbar), seleccionado pinta `bg-gradient-to-b from-neutral-600 to-neutral-950` + `text-text-white-0` + `ring-text-sub-600` (en dark: `from-neutral-200 to-neutral-0` + `dark:ring-neutral-300`); hover bloqueado con `!` para que el botón se quede "pegado". No mezcles filtros normales y fuertes en el mismo set.
**avoid:** Acción protagonista (usa `FancyButton`, R7). `mode="filled"` casi nunca — compite con el Primary. **Nunca `variant="primary"`** (existe por compatibilidad histórica, no es parte del lenguaje BIA).
**api:** `Button.Root` { variant: `'basic' \| 'neutral' \| 'error' \| 'primary'`, mode: `'filled' \| 'stroke' \| 'lighter' \| 'ghost'`, size: `'medium' \| 'small' \| 'xsmall' \| 'xxsmall'`, asChild?, state?: `'idle' \| 'loading' \| 'success' \| 'error'`, confetti?: `'dots' \| false \| ((rect) => void)` } · `Button.Icon` { as: ElementType }
**pair:** Acompañado por `FancyButton` (Cancelar + Confirmar). Para errores destructivos no protagonistas, `variant="error" mode="stroke"`. Estado de loading se gestiona via prop `state` — el Button mete un `LoaderArc` interno (ver §7 Pattern: Button lifecycle).

```tsx
<Button.Root variant="basic">
  <Button.Icon as={RiAddLine} />
  Cancelar
</Button.Root>
```

**docs:** [/docs/actions/button](apps/docs/content/docs/actions/button.mdx)

#### FancyButton — Primary action button

**when:** **El** botón del producto BIA. La acción protagonista de la pantalla — el filled oscuro que tira del ojo. Una sola por vista (o por modal/sección): "Guardar", "Confirmar", "Continuar", "Crear cuenta". Default = primary (no escribas `variant`). Para destructivo protagonista (`Eliminar cuenta`, `Borrar definitivamente`): `variant="destructive"`. Para acción secundaria al mismo nivel jerárquico que el primary: `variant="basic"`.
**avoid:** Múltiples FancyButton por pantalla (pierde el rol de "una sola"). `variant="neutral"` ni `variant="primary"` explícitos — el default ya renderiza el Primary correcto. `Button.Root variant="primary"` para esto (R7). Zonas densas tipo toolbar o filas de tabla (ahí va Button compact).
**api:** `FancyButton.Root` { variant?: `'primary' \| 'basic' \| 'destructive'` (default: `'primary'`), size?: `'medium' \| 'small' \| 'xsmall' \| 'xxsmall'`, asChild? } · `FancyButton.Icon` { as: ElementType }
**pair:** Casi siempre con `Button.Root variant="basic"` al lado (Confirmar + Cancelar). Dentro de `Modal.Footer` es el patrón canónico del DS.

```tsx
<FancyButton.Root>
  Empezar ahora
  <FancyButton.Icon as={RiArrowRightLine} />
</FancyButton.Root>
```

**docs:** [/docs/actions/fancy-button](apps/docs/content/docs/actions/fancy-button.mdx)

#### CompactButton — Icon-only button (obligatorio para X y acciones de un solo icono)

**when:** **Obligatorio** para cualquier acción de un solo icono pequeño en el producto BIA. **El cerrar (X) siempre va con CompactButton — sin excepciones.** Modal close, banner dismiss, tag remove, drawer close, chip remove. También: more (`...`), search inline, edit en una row de tabla, navegación entre items (chevrons), copiar al portapapeles, abrir/cerrar paneles, cualquier botón sin texto en una toolbar/header de card/fila/dentro de un input.
**avoid:** `<button>` plano con un `<RiCloseLine />` adentro (rompe consistencia). Las variants `white` y `modifiable` — existen por compatibilidad histórica pero no son parte del lenguaje BIA, `stroke` o `ghost` cubren todos los casos.
**api:** `CompactButton.Root` { variant: `'stroke' \| 'ghost'` (canónicas BIA), size: `'medium' \| 'small' \| 'xsmall' \| 'xxsmall'`, asChild? } · `CompactButton.Icon` { as: ElementType }
**pair:** `stroke` cuando vive sobre superficie plana (`bg-white-0` o `bg-weak-25`). `ghost` cuando vive sobre fondo con textura/contraste propio (Alert, Banner, Toast, Input enfocado, menú de contexto). Acompáñalo siempre con `aria-label` — es solo icon.

```tsx
<CompactButton.Root variant="ghost" aria-label="Cerrar">
  <CompactButton.Icon as={RiCloseLine} />
</CompactButton.Root>
```

**docs:** [/docs/actions/compact-button](apps/docs/content/docs/actions/compact-button.mdx)

#### LinkButton — Inline action styled as link

**when:** Acción terciaria inline que vive dentro de un párrafo, fila de tabla o lista. La acción acompaña al texto en lugar de ser un bloque propio. `gray` default (coherente con la filosofía minimal); `error` reservado para destructivos inline ("Eliminar cuenta", "Descartar cambios"). `LinkButton` con `variant="primary"` es uno de los pocos lugares donde aparece el `brand-*` (R4).
**avoid:** Confundirlo con un link semántico real. Es un `<button>` con apariencia de link — para acciones que **no navegan**. Si la acción cambia de URL, combina con `asChild` y un `<a>` real para mantener semántica/accesibilidad.
**api:** `LinkButton.Root` { variant?: `'gray' \| 'primary' \| 'error'` (default: `'gray'`), size?: `'medium' \| 'small'`, asChild?, underline?: boolean } · `LinkButton.Icon` { as: ElementType }
**pair:** Suele aparecer en filas de Table como `Cell` accionable, o dentro de Hint/Alert como CTA inline.

```tsx
<LinkButton.Root>
  Ver detalles
  <LinkButton.Icon as={RiArrowRightSLine} />
</LinkButton.Root>
```

**docs:** [/docs/actions/link-button](apps/docs/content/docs/actions/link-button.mdx)

#### ButtonGroup — Mutually exclusive segmented buttons

**when:** Sets mutuamente excluyentes con bordes continuos: switch de período (Day/Week/Month), toggle de alineación, segmented control entre vistas en una toolbar. Items chicos, agrupados, en toolbars o headers de card o paneles de control.
**avoid:** Sets multi-select (usa filtros con `Button` standalone variant="basic" size="small"). Sets que ocupan todo el ancho de la pantalla (probablemente quieres Tabs, no esto). Estado: el componente es **presentacional**, no gestiona el activo — tú pasas `data-state="on"` al item activo desde tu state.
**api:** `ButtonGroup.Root` { size?: `'medium' \| 'small' \| 'xsmall'` } · `ButtonGroup.Item` { data-state?: `'on' \| 'off'` } · `ButtonGroup.Icon` { as: ElementType }
**pair:** Compite con `SegmentedControl` — `ButtonGroup` tiene bordes continuos y vibe de toolbar; `SegmentedControl` es un selector con indicador flotante animado. Si dudas entre los dos: `SegmentedControl` para conmutar vistas dentro de una pantalla, `ButtonGroup` para toolbars.

```tsx
<ButtonGroup.Root>
  <ButtonGroup.Item>Day</ButtonGroup.Item>
  <ButtonGroup.Item data-state="on">Week</ButtonGroup.Item>
  <ButtonGroup.Item>Month</ButtonGroup.Item>
</ButtonGroup.Root>
```

**docs:** [/docs/actions/button-group](apps/docs/content/docs/actions/button-group.mdx)

---

### §6.2 — Form

#### Input — Single-line text field

**when:** Una línea de texto: text, email, password, search. El default cubre todo — suma `Input.Icon` cuando el contexto pide pista visual (search), `Input.Affix` para prefijos del `Wrapper` ("https://"), `Input.InlineAffix` para sufijos dentro del wrapper ("USD", "kg", `⌘K`).
**avoid:** Múltiples líneas (usa `Textarea`). Códigos segmentados OTP (usa `DigitInput`). Fechas (usa `Datepicker.Calendar`). Mensajes de error como `<p className="text-red-500">` flotantes — el par canónico es `Input.Root hasError` + `Hint.Root` debajo (R9).
**api:** `Input.Root` { size: `'medium' \| 'small' \| 'xsmall'`, hasError?: boolean, asChild? } · `Input.Wrapper` { ... } · `Input.Input` { ...HTMLInputAttributes } · `Input.Icon` { as: ElementType } · `Input.Affix` { children } · `Input.InlineAffix` { children }
**pair:** Trío canónico de form: `Label.Root` arriba + `Input.Root` + `Hint.Root` debajo (helper o error). Para currency/unit: `Input.Affix` o `Input.InlineAffix` con `Select.Root variant="compactForInput"` cuando es currency selector + amount.

```tsx
<Input.Root>
  <Input.Wrapper>
    <Input.Icon as={RiSearchLine} />
    <Input.Input placeholder="Buscar..." />
  </Input.Wrapper>
</Input.Root>
```

**docs:** [/docs/form/input](apps/docs/content/docs/form/input.mdx)

#### Textarea — Multi-line text field

**when:** Texto multi-línea: comentarios, descripciones, mensajes. Variante simple (sin contador) por default. Variante con contador embebido cuando hay un límite duro de caracteres ("Máximo 280 caracteres") — el contador hace explícito el límite.
**avoid:** Una sola línea (usa `Input`). Códigos OTP (usa `DigitInput`). Mostrar contador "0/9999" arbitrario sin límite real — es ruido.
**api:** `Textarea.Root` { simple?: boolean, ...HTMLTextAreaAttributes } · `Textarea.CharCounter` { current: number, max: number }
**pair:** Mismo trío de form que Input: `Label.Root` + `Textarea.Root` + `Hint.Root`.

```tsx
<Textarea.Root simple placeholder="Escribe un comentario..." />
```

**docs:** [/docs/form/textarea](apps/docs/content/docs/form/textarea.mdx)

#### Checkbox — Multi-select that confirms with Submit

**when:** Selección multi-select que se confirma con un Submit/Save. Listas multi-select ("selecciona los días"), terms & conditions, filtros que se aplican al confirmar. `indeterminate` solo para representar "algunos hijos seleccionados" en el padre de un set — no es un tercer estado lógico.
**avoid:** Cambio que debe surtir efecto al instante sin Save (usa `Switch`). Tres opciones lógicas (usa `Radio`).
**api:** `Checkbox.Root` { checked?: boolean | 'indeterminate', onCheckedChange?, defaultChecked?, disabled? } (Radix Checkbox under the hood)
**pair:** `Label.Root` al costado, atado por `htmlFor` y `id` correspondiente. Para listas con muchos items, considera un container con `Divider.Root` entre items. Es uno de los lugares donde aparece `brand-*` (R4) en estado checked.

```tsx
<div className="flex items-center gap-2">
  <Checkbox.Root id="terms" />
  <Label.Root htmlFor="terms">Acepto los términos</Label.Root>
</div>
```

**docs:** [/docs/form/checkbox](apps/docs/content/docs/form/checkbox.mdx)

#### Radio — Mutually exclusive small set (2-5)

**when:** Selección 1-de-N para sets chicos (2-5 opciones) donde ver todas a la vez aporta. Una opción default seleccionada al montar — no obligues al usuario a decidir algo arbitrario. `brand-*` aparece en el item seleccionado (R4).
**avoid:** 5+ opciones (usa `Select`). Dos opciones que el usuario va a togglear seguido (considera `Switch`). Grupo sin selección default — fuerza una decisión innecesaria.
**api:** `Radio.Group` { value?, onValueChange?, defaultValue, disabled? } · `Radio.Item` { value: string, id?, disabled? }
**pair:** Cada `Radio.Item` con su `Label.Root htmlFor`. Para grupos descriptivos, agrupa con un container que tenga `Divider.Root` entre items.

```tsx
<Radio.Group defaultValue="option-1">
  <div className="flex items-center gap-2">
    <Radio.Item value="option-1" id="r1" />
    <Label.Root htmlFor="r1">Opción 1</Label.Root>
  </div>
  <div className="flex items-center gap-2">
    <Radio.Item value="option-2" id="r2" />
    <Label.Root htmlFor="r2">Opción 2</Label.Root>
  </div>
</Radio.Group>
```

**docs:** [/docs/form/radio](apps/docs/content/docs/form/radio.mdx)

#### Switch — Instant binary toggle (no Save)

**when:** Encender/apagar una funcionalidad con efecto inmediato, sin botón Save: notificaciones, modo oscuro, sync automático. La etiqueta del lado describe el estado activo ("Activar notificaciones") leído como afirmación. `brand-*` aparece en estado checked (R4); hover sobre checked es `brand-soft`.
**avoid:** Selección que se confirma con Submit (usa `Checkbox`). Dos labels (uno por estado) — el Switch ya muestra cuál está prendido.
**api:** `Switch.Root` { checked?, onCheckedChange?, defaultChecked?, disabled? } (Radix Switch)
**pair:** `Label.Root` al costado o encima atado por id, opcionalmente `Hint.Root` con descripción debajo.

```tsx
<div className="flex items-center gap-2">
  <Switch.Root id="notif" />
  <Label.Root htmlFor="notif">Activar notificaciones</Label.Root>
</div>
```

**docs:** [/docs/form/switch](apps/docs/content/docs/form/switch.mdx)

#### Slider — Range numérico donde la posición importa más que el número exacto

**when:** Rango numérico donde la posición visual aporta: volumen, brillo, threshold, "mostrar resultados de los últimos N días". Muestra el valor numérico al costado o encima del slider. `brand-*` aparece en el track activo (R4).
**avoid:** Cuando el usuario necesita el número exacto (`12500`, `$48.750`) — eso es `Input` `type="number"`. Slider sin número visible — el usuario tiene que adivinar el valor.
**api:** `Slider.Root` { defaultValue: number[], value?, onValueChange?, min, max, step, disabled? } · `Slider.Thumb` (uno por valor; con `Slider.Thumb` \* 2 haces un range slider)
**pair:** Suele ir con un `<span className="text-label-sm text-text-strong-950">` que muestra el valor actual.

```tsx
<Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
  <Slider.Thumb />
</Slider.Root>
```

**docs:** [/docs/form/slider](apps/docs/content/docs/form/slider.mdx)

#### Select — 1-de-N for medium-large sets (5+)

**when:** Selección 1-de-N para sets medianos a grandes (5+). Las cuatro variantes tienen rol específico: `default` para forms, `compact` para filtros densos sobre tablas, `compactForInput` cuando vive pegado a un Input (currency selector + amount), `inline` cuando reemplaza una palabra dentro de un párrafo.
**avoid:** Sets chicos (2-5) donde ver todas las opciones aporta — usa `Radio`. 50+ opciones donde necesitas búsqueda — baja a Radix Combobox (no incluido en el DS). Mezclar variantes arbitrariamente.
**api:** `Select.Root` { value?, onValueChange?, defaultValue, disabled? } · `Select.Trigger` { variant?: `'default' \| 'compact' \| 'compactForInput' \| 'inline'`, size? } · `Select.Value` { placeholder } · `Select.Content` { ... } · `Select.Item` { value: string } · `Select.Group`, `Select.GroupLabel`, `Select.Separator`, `Select.ItemIcon`, `Select.TriggerIcon`
**pair:** Trío de form: `Label.Root` arriba, `Hint.Root` debajo. Si es selector de currency: `Select variant="compactForInput"` pegado a `Input.Root`.

```tsx
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Selecciona una opción" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Manzana</Select.Item>
    <Select.Item value="banana">Plátano</Select.Item>
    <Select.Item value="orange">Naranja</Select.Item>
  </Select.Content>
</Select.Root>
```

**docs:** [/docs/form/select](apps/docs/content/docs/form/select.mdx)

#### Datepicker — Calendar for date or range selection

**when:** **Cualquier fecha o rango — siempre.** No metas fechas en un Select ni en un Input crudo: el calendario es lo único que evita errores de formato regional (DD/MM vs MM/DD), zonas horarias y fechas inválidas. Elige un modo (`single`, `range`, `multiple`) y no lo cambies en runtime.
**avoid:** `Input type="date"` (varía visualmente entre browsers). Cambiar de modo dinámicamente — confunde al usuario que ya aprendió la interacción.
**api:** `Datepicker.Calendar` { mode: `'single' \| 'range' \| 'multiple'`, size?: `'medium' \| 'small'`, selected?, onSelect?, ...DayPickerProps }. Internamente usa `react-day-picker`.
**size:** `medium` (default, celdas `size-10`) es el tamaño canónico cuando el calendario es la pieza central del flujo (página de booking, scheduling stand-alone). `size="small"` (celdas `size-8`, caption `h-7`, gaps reducidos) cuando el calendario vive dentro de un `Popover` en un form denso — el medium se siente desproporcionado al lado de inputs y selects de altura `h-10`. No abras un calendario `medium` y otro `small` en la misma pantalla, elige uno.
**pair:** Suele vivir dentro de un `Popover.Root` para no ocupar espacio fijo en el form. Para rangos, el snippet completo con start/end suele acompañarse de un `Input.Root` que muestra el valor formateado al costado.

```tsx
const [selected, setSelected] = React.useState<Date>()

<Datepicker.Calendar
  mode="single"
  size="small"
  selected={selected}
  onSelect={setSelected}
/>
```

**docs:** [/docs/form/datepicker](apps/docs/content/docs/form/datepicker.mdx)

#### DigitInput — Segmented OTP / PIN input

**when:** Códigos OTP / PIN — la segmentación en celdas hace explícito "escribir N dígitos" sin leer un placeholder. Auto-focus + auto-advance (heredado de `react-otp-input`) — pegar un código de 6 dígitos es instantáneo.
**avoid:** Inputs numéricos generales (montos, edades) — eso es `Input`. Desactivar el auto-focus/auto-advance — rompe la UX que hace especial a este componente.
**api:** `DigitInput.Root` { value: string, onChange: (v: string) => void, numInputs: number, disabled?, hasError? }
**pair:** Acompañado de `Hint.Root` debajo para errores ("Código incorrecto") o helpers ("6 dígitos enviados a tu email"). En auth flows suele ir junto a un `Button.Root` "Reenviar código" con timer.

```tsx
const [code, setCode] = React.useState('')

<DigitInput.Root value={code} onChange={setCode} numInputs={6} />
```

**docs:** [/docs/form/digit-input](apps/docs/content/docs/form/digit-input.mdx)

#### FileUpload — Drag-and-drop + button file input

**when:** Subir archivos. **Siempre los dos**: DnD primero, botón de selección como fallback obligatorio (mobile, accesibilidad, screen readers no arrastran). Validación al soltar (en `onDrop`), no al submit — el error inline con `Hint` debajo identifica qué archivo está mal.
**avoid:** Exponer solo DnD o solo botón. Validar en submit — el usuario tiene que adivinar cuál de N archivos falló.
**api:** `FileUpload.Root` { ... } · `FileUpload.Button` { children } · `FileUpload.Icon` { as: ElementType }
**pair:** Acompañado por `Hint.Root` que describe formatos aceptados y tamaño máximo ("JPG, PNG o PDF, menor a 10MB"). Errores aparecen en otro `Hint.Root hasError` debajo.

```tsx
<FileUpload.Root>
  <FileUpload.Icon as={RiUploadCloud2Line} />
  <div className="space-y-1">
    <div className="text-label-sm text-text-strong-950">Elige un archivo o arrástralo aquí</div>
    <div className="text-paragraph-xs text-text-sub-600">JPG, PNG o PDF, menor a 10MB</div>
  </div>
  <FileUpload.Button>Buscar archivo</FileUpload.Button>
  <input type="file" className="hidden" />
</FileUpload.Root>
```

**docs:** [/docs/form/file-upload](apps/docs/content/docs/form/file-upload.mdx)

#### Label — Form field label

**when:** Identificar un campo de form. Vive arriba (o al costado) del input al que pertenece, atado por `htmlFor`. `required` activa el asterisco rojo. `Label.Sub` (subText) para hints cortos contextuales ("(opcional)").
**avoid:** Usarlo como heading o como texto suelto — eso es `<h*>` o utility `text-label-*` directa. Agregar "(obligatorio)" en el texto cuando ya tienes `required`.
**api:** `Label.Root` { htmlFor: string, required?: boolean, disabled? } · `Label.Asterisk` (auto-renderizado si `required`) · `Label.Sub` { children } (subText opcional, ej. "(opcional)")
**pair:** Trío de form: `Label.Root` + control + `Hint.Root`. Si la ayuda es más larga que un sub-label, va en `Hint`, no aquí.

```tsx
<Label.Root htmlFor="email" required>
  Correo electrónico
  <Label.Sub>(personal)</Label.Sub>
</Label.Root>
```

**docs:** [/docs/form/label](apps/docs/content/docs/form/label.mdx)

#### Hint — Helper / error text below input

**when:** Microcopy permanente debajo del campo: helper fijo ("Mín. 8 caracteres") o errores de validación ("Email inválido"). **Un Hint por campo, máximo** — no apiles helper + error a la vez. Cuando aparece el error, el helper se reemplaza.
**avoid:** Ayuda contextual on-demand (eso es `Tooltip`). Texto rojo flotante o `<p className="text-red-500">` (R9). Dos Hints debajo del mismo input — bloque visual desordenado.
**api:** `Hint.Root` { hasError?: boolean, disabled?: boolean } · `Hint.Icon` { as: ElementType }
**pair:** Trío de form: `Label.Root` + control + `Hint.Root`. En error, la pareja canónica es control con `hasError` + `Hint.Root hasError` con `Hint.Icon as={RiErrorWarningFill}`.

```tsx
<Hint.Root>
  <Hint.Icon as={RiInformationLine} />
  Mínimo 8 caracteres.
</Hint.Root>
```

**docs:** [/docs/form/hint](apps/docs/content/docs/form/hint.mdx)

#### FormField — Label + control + hint stack

**when:** Cuando vas a escribir el trío `Label.Root` + control + `Hint.Root` (que en la práctica es **casi todos los forms**). FormField encierra los tres con el spacing canónico (`gap-1.5`) y se hace cargo de mostrar `Label.Asterisk` cuando `required`, y de switchear entre `hint` (neutral) y `error` (`Hint.Root hasError`) sin que tengas que armar el ternary. **Default para forms nuevos** — usá los primitivos sueltos solo si necesitas un layout horizontal (label al costado del input) o un Hint encima del control.
**avoid:** Escribir `<div className="flex flex-col gap-1.5">` con `Label`, control y `Hint` adentro (es exactamente lo que hace este componente, sin tomar la decisión sobre el spacing). Pasar tanto `hint` como `error` esperando los dos juntos — `error` pisa a `hint` (R9: un Hint por campo).
**api:** `FormField.Root` { id?: string, label: ReactNode, required?: boolean, error?: ReactNode, hint?: ReactNode, children: ReactNode }. `id` se setea como `htmlFor` del Label interno — el consumidor sigue pasando el mismo id al input (no clonamos children).
**pair:** Vive con el control que envuelve (`Input.Root`, `Select.Root`, `Textarea.Root`, `Datepicker` dentro de un `Popover`, etc.). Si el control tiene su propio estado de error, pasale `hasError` aparte — FormField solo se encarga del Hint.

```tsx
<FormField.Root
  id="email"
  label="Email"
  required
  error={errors.email?.message}
  hint="Se usa para login y notificaciones"
>
  <Input.Root hasError={!!errors.email}>
    <Input.Wrapper>
      <Input.Icon as={RiMailLine} />
      <Input.Input id="email" {...register('email')} />
    </Input.Wrapper>
  </Input.Root>
</FormField.Root>
```

**docs:** [/docs/form/form-field](apps/docs/content/docs/form/form-field.mdx)

#### FileFormatIcon — Visual format label for files

**when:** Etiqueta visual de formato en listas donde el usuario reconoce el tipo de un vistazo: CSV, PDF, XLSX, ZIP. Nueve colores fijos, dos tamaños — el color codifica el formato, **no lo elijas arbitrariamente**.
**avoid:** Representar "un archivo cualquiera" sin formato relevante (un ícono normal alcanza). Inventar combinaciones color-formato — el set existe para que CSV se vea igual en cualquier pantalla del producto.
**api:** `FileFormatIcon.Root` { format: string, color: `'red' \| 'blue' \| 'orange' \| 'yellow' \| 'green' \| 'purple' \| 'pink' \| 'sky' \| 'gray'`, size?: `'small' \| 'medium'` }
**pair:** Suele aparecer en filas de tabla o lista junto al nombre del archivo y un `LinkButton.Root` "Descargar".

```tsx
<FileFormatIcon.Root format="PDF" color="red" />
```

**docs:** [/docs/form/file-format-icon](apps/docs/content/docs/form/file-format-icon.mdx)

---

### §6.3 — Displaying Data

#### Avatar — User/entity visual identity

**when:** Identidad visual de un usuario o entidad. Imagen → iniciales → placeholder, en ese orden de fallback. Acompaña al nombre — no lo reemplaza salvo en espacios densos (lista de chats, sidebar de miembros). Indicators (`Status`, `Notification`, `BrandLogo`) son **alternativos, no acumulables** — uno solo a la vez.
**avoid:** Múltiples avatars sueltos uno al lado del otro (usa `AvatarGroup`). Superponer dos indicators (compiten visualmente).
**api:** `Avatar.Root` { size: `'80' \| '72' \| '64' \| '56' \| '48' \| '40' \| '32' \| '24' \| '20'`, color?, placeholderType?, ...HTMLAttributes } · `Avatar.Image` { src, alt } · `Avatar.Indicator`, `Avatar.Status`, `Avatar.BrandLogo`, `Avatar.Notification`
**pair:** Junto al nombre del usuario en headers de comments, rows de tabla, listas de miembros. Para múltiples participantes: `AvatarGroup`.

```tsx
<Avatar.Root size="48">
  <Avatar.Image src="https://i.pravatar.cc/150?img=47" alt="Ana Torres" />
</Avatar.Root>
```

**docs:** [/docs/displaying-data/avatar](apps/docs/content/docs/displaying-data/avatar.mdx)

#### AvatarGroup — Stack of avatars with overflow counter

**when:** Stack para mostrar varios participantes — superpuestos con contador "+N" para overflow. Ideal para asignados a tarea, miembros de equipo, participantes en conversación. **3-5 avatares antes del overflow** — más se vuelve ruidoso.
**avoid:** Un solo participante (usa `Avatar` directo — un Group de uno se ve raro). Pasar 8 apilados — la idea es legibilidad, no completitud.
**api:** `AvatarGroup.Root` { size: same as `Avatar.Root` } · `AvatarGroup.Overflow` { children }
**pair:** Internamente lleva `Avatar.Root` items + `AvatarGroup.Overflow` al final con "+N".

```tsx
<AvatarGroup.Root size="32">
  <Avatar.Root color="blue">AB</Avatar.Root>
  <Avatar.Root color="purple">MV</Avatar.Root>
  <Avatar.Root color="yellow">SG</Avatar.Root>
  <AvatarGroup.Overflow>+3</AvatarGroup.Overflow>
</AvatarGroup.Root>
```

**docs:** [/docs/displaying-data/avatar-group](apps/docs/content/docs/displaying-data/avatar-group.mdx)

#### Badge — Compact label for counts/states/categories

**when:** Etiqueta compacta para info estática asignada por el sistema: conteos, prioridad, atributos. Convive con texto, va al lado de un nombre, dentro de una row, sobre un avatar. **`variant="lighter"` es el canónico BIA** — glass effect + inset highlight, lectura suave coherente con el lenguaje minimal. Cubre el 90% de los casos.
**avoid:** Categorías descriptivas con peso visual (usa `Tag`). Estados de proceso completed/pending/failed (usa `StatusBadge`). `filled`/`light`/`stroke` cuando `lighter` alcanza.
**api:** `Badge.Root` { variant: `'filled' \| 'light' \| 'lighter' \| 'stroke'` (default BIA: `'lighter'`), color: `'primary' \| 'gray' \| 'blue' \| 'orange' \| 'red' \| 'green' \| 'yellow' \| 'purple' \| 'sky' \| 'pink' \| 'teal'`, size: `'medium' \| 'small' \| 'xsmall'`, square?, asChild? } · `Badge.Icon` { as: ElementType } · `Badge.Dot`
**pair:** Frecuentemente en una row al lado de un nombre o un metric. Como counter dentro de tabs (`<TabMenuHorizontal.Trigger>Inbox <Badge.Root>3</Badge.Root></TabMenuHorizontal.Trigger>`).

```tsx
<Badge.Root variant="lighter">Default</Badge.Root>
```

**docs:** [/docs/displaying-data/badge](apps/docs/content/docs/displaying-data/badge.mdx)

#### Stat — Metric card with header, big value (number pop-in) and trend

**when:** Tarjeta para mostrar **una** métrica/KPI. El valor lleva el peso visual con el number pop-in del DS (cada char entra con blur + overshoot, stagger 70ms; re-anima cuando cambia). Header arriba (auto-tooltipea al hover si se trunca), value grande, subheader debajo, opcional footer con `Trend` (pill semántico ↑/↓ con `color="green" | "red"`) y `Note` para contexto temporal.
**avoid:** Múltiples métricas en una misma card (una por `Stat.Root`, varias en grid). Usar como botón/link (es presentación, no acción — si necesitás click, envolvé desde afuera). Usarlo para texto descriptivo plano (no es un Card genérico).
**api:** `Stat.Root` { ...HTMLAttributes } · `Stat.Header` { ...HTMLAttributes } (auto-truncate + auto-tooltip) · `Stat.Body` (wrapper `gap-1` para Value+Subheader) · `Stat.Value` { children: `string \| number`, animate?: `boolean` (default `true`) } · `Stat.Subheader` · `Stat.Footer` (wrapper flex row para Trend+Note) · `Stat.Trend` { direction?: `'up' \| 'down'`, color?: `'green' \| 'red'` (default `'green'`) } · `Stat.Note`
**pair:** En grid de KPIs sobre dashboards. El value se beneficia del number pop-in cuando los valores se actualizan por React Query polling o realtime — la animación re-fira con cada cambio.

```tsx
<Stat.Root>
  <Stat.Header>Consumo en mayo</Stat.Header>
  <Stat.Body>
    <Stat.Value>1,234</Stat.Value>
    <Stat.Subheader>kWh</Stat.Subheader>
  </Stat.Body>
  <Stat.Footer>
    <Stat.Trend direction="up" color="green">
      12.5%
    </Stat.Trend>
    <Stat.Note>vs mes anterior</Stat.Note>
  </Stat.Footer>
</Stat.Root>
```

**docs:** [/docs/displaying-data/stat](apps/docs/content/docs/displaying-data/stat.mdx)

#### StatusBadge — Process state indicator (completed/pending/failed/disabled)

**when:** **Específicamente** para estado de un proceso: `completed`, `pending`, `failed`, `disabled`. Glass effect + dot/icon — indicador visual fuerte porque el estado importa. Dot para densidad alta (tabla con muchas rows), icon cuando el estado convive con varios otros y necesita reforzarse.
**avoid:** Info compacta general, conteos, atributos (usa `Badge`). Categorías descriptivas (usa `Tag`).
**api:** `StatusBadge.Root` { status: `'completed' \| 'pending' \| 'failed' \| 'disabled'`, asChild? } · `StatusBadge.Icon` { as: ElementType } · `StatusBadge.Dot`
**pair:** Casi siempre dentro de una `Table.Cell` o en headers de pipeline. Acompañado por texto que nombra el estado ("Sin actividad", "Pago confirmado").

```tsx
<StatusBadge.Root status="disabled">
  <StatusBadge.Dot />
  Sin actividad
</StatusBadge.Root>
```

**docs:** [/docs/displaying-data/status-badge](apps/docs/content/docs/displaying-data/status-badge.mdx)

#### Tag — Descriptive non-interactive label

**when:** Categoría descriptiva, selección hecha en otro lado, atributo asignado por el sistema. **No es un toggle.** Si la asignación es removible por el usuario (input de tags, recipientes en email, chips de filtro aplicado), agrega `Tag.DismissButton`.
**avoid:** Filtros toggleables (rompe el patrón — usa la receta de filtros con `Button` standalone variant="basic" size="small"). Estados de proceso (usa `StatusBadge`). Conteos/info compacta (usa `Badge`).
**api:** `Tag.Root` { variant?, size?, color?, disabled?, asChild? } · `Tag.Icon` { as: ElementType } · `Tag.DismissButton` { onClick } · `Tag.DismissIcon`
**pair:** En input de tags, suele vivir dentro de un container que mapea sobre un array de strings. En tabla, dentro de `Table.Cell`.

```tsx
<Tag.Root>Default</Tag.Root>
```

**docs:** [/docs/displaying-data/tag](apps/docs/content/docs/displaying-data/tag.mdx)

#### Table — Tabular data with sortable columns

**when:** Datos estructurados con columnas comparables — el usuario va a comparar valores entre filas (ordenar, filtrar, escanear). Header sticky + hover row + dividers son lo que diferencia Table de un grid genérico. **Columnas sortables por default** (pasale `sortable` a cada `Table.Head`) salvo que la columna no tenga sentido ordenar (acciones bulk, avatar puro). Vive dentro de un container con título + acciones bulk.
**avoid:** Items no comparables o con jerarquía visual fuerte (usa cards o lista). Tabla sin header + body — no es Table, es un grid plano.
**api:** `Table.Root` { ... } · `Table.Header`, `Table.Body` · `Table.Row` · `Table.Head` { sortable?: boolean, sortDirection? } · `Table.Cell` · `Table.RowDivider`, `Table.Caption`
**pair:** Suele acompañarse de filtros arriba (`Button.Root variant="basic" size="small"` en row), `Pagination.Root` al pie, y bulk actions en header. Para celdas accionables: `LinkButton.Root` o `CompactButton.Root`. Para estado: `StatusBadge.Root`.

```tsx
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head sortable>Nombre</Table.Head>
      <Table.Head sortable>Estado</Table.Head>
      <Table.Head>Rol</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ana López</Table.Cell>
      <Table.Cell>
        <StatusBadge.Root status="completed">
          <StatusBadge.Dot />
          Activo
        </StatusBadge.Root>
      </Table.Cell>
      <Table.Cell>Admin</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

**docs:** [/docs/displaying-data/table](apps/docs/content/docs/displaying-data/table.mdx)

#### Timeline — Cronología vertical de eventos (tracking, audit, lifecycle)

**when:** Mostrar eventos en orden cronológico. Dos variantes según el caso. **`variant="process"`** (default) — proceso con estado conocido: cada item es `completed` (brand teal + check), `active` (ring brand + dot), `pending` (gris). Para tracking de envío, status de pedido, lifecycle con futuro conocido. **`variant="neutral"`** — todos los items iguales (indicador `glass-popup` + dot strong-950, copy regular). Para historiales puros sin "futuro": activity feed, audit log, commits, registro de cambios. El usuario solo lee — no clickea, no navega.
**avoid:** Wizards / pasos navegables (usa [`VerticalStepper`](apps/docs/content/docs/navigation/vertical-stepper.mdx) — es interactivo). Listas planas sin orden temporal (usa una lista genérica). Estados más allá de los 3 semánticos del `process` — si necesitás `failed`/`skipped`/etc., usa [`StatusBadge`](apps/docs/content/docs/displaying-data/status-badge.mdx) dentro de la descripción. Mezclar el `state` del item con `variant="neutral"` — el variant manda, el state se ignora.
**api:** `Timeline.Root` { variant?: `'process' \| 'neutral'` } · `Timeline.Item` { state?: `'completed' \| 'active' \| 'pending'` } · `Timeline.ItemIndicator` · `Timeline.ItemContent` · `Timeline.ItemTitle` · `Timeline.ItemDescription` · `Timeline.ItemTimestamp`. El `state` resuelto se propaga por contexto al indicator/title/description/timestamp hijos. Todos los wrappers tipográficos aceptan `asChild` para componer con `<h3>`, `<time>`, etc. **Tamaño del indicador**: la CSS var `--ts-indicator-size` (default `1.25rem`) controla simultáneamente el círculo y el offset de la línea conectora — escalarla mantiene la alineación. Para iconos custom: pasalos como children del `ItemIndicator`, sumá `className="glass-popup"` para el chrome del step badge, y bumpeá la var a `1.75rem` para acomodarlos.
**pair:** Vive dentro de una card con header (title + status del proceso). Para el resumen accionable arriba: `StatusBadge.Root` para el estado global, `Button.Root` para acciones primarias ("Track Shipment", "Contact Support"). Para eventos heterogéneos en `neutral`, iconos de `@biaenergy/ui/icons` dentro del indicador comunican el tipo (truck, check, alert).

```tsx
// Process — tracking con estados
<Timeline.Root>
  <Timeline.Item state="completed">
    <Timeline.ItemIndicator />
    <Timeline.ItemContent>
      <Timeline.ItemTitle>Order Confirmed</Timeline.ItemTitle>
      <Timeline.ItemDescription>Payment processed securely</Timeline.ItemDescription>
    </Timeline.ItemContent>
    <Timeline.ItemTimestamp>Nov 15, 11:42 AM</Timeline.ItemTimestamp>
  </Timeline.Item>
  <Timeline.Item state="active">
    <Timeline.ItemIndicator />
    <Timeline.ItemContent>
      <Timeline.ItemTitle>Package Shipped</Timeline.ItemTitle>
    </Timeline.ItemContent>
    <Timeline.ItemTimestamp>Nov 16, 16:05 PM</Timeline.ItemTimestamp>
  </Timeline.Item>
  <Timeline.Item state="pending">
    <Timeline.ItemIndicator />
    <Timeline.ItemContent><Timeline.ItemTitle>Delivered</Timeline.ItemTitle></Timeline.ItemContent>
    <Timeline.ItemTimestamp>--</Timeline.ItemTimestamp>
  </Timeline.Item>
</Timeline.Root>

// Neutral — activity feed / audit log (state se ignora)
<Timeline.Root variant="neutral">
  <Timeline.Item>
    <Timeline.ItemIndicator />
    <Timeline.ItemContent>
      <Timeline.ItemTitle>Ana López creó la cuenta</Timeline.ItemTitle>
    </Timeline.ItemContent>
    <Timeline.ItemTimestamp>hace 2h</Timeline.ItemTimestamp>
  </Timeline.Item>
</Timeline.Root>

// Neutral con iconos en glass-popup
<Timeline.Root variant="neutral" style={{ '--ts-indicator-size': '1.75rem' }}>
  <Timeline.Item>
    <Timeline.ItemIndicator className="glass-popup">
      <RiTruckLine className="size-3.5 text-text-strong-950" />
    </Timeline.ItemIndicator>
    <Timeline.ItemContent>
      <Timeline.ItemTitle>En camino</Timeline.ItemTitle>
    </Timeline.ItemContent>
    <Timeline.ItemTimestamp>14:21</Timeline.ItemTimestamp>
  </Timeline.Item>
</Timeline.Root>
```

**docs:** [/docs/displaying-data/timeline](apps/docs/content/docs/displaying-data/timeline.mdx)

#### ProgressBar — Linear progress indicator

**when:** Procesos lineales con estado conocido: uploads, instalaciones, multi-step que avanza secuencialmente. `brand` es el default — uno de los pocos lugares donde la marca aparece como acento (R4). `neutral` para mediciones secundarias, `red` para problemas (cuotas excedidas, error rate alto).
**avoid:** Loading indeterminado sin progreso conocido (usa `LoaderArc` o `LoaderBrand`). Métricas de "completitud" en card compacta (usa `ProgressCircle`).
**api:** `ProgressBar.Root` { value: number, max?: number (default 100), color?: `'brand' \| 'neutral' \| 'red'` } (peer-deps: ninguno)
**pair:** Suele ir con un `<span className="text-label-sm">` mostrando el porcentaje al lado o encima.

```tsx
<ProgressBar.Root value={40} />
```

**docs:** [/docs/displaying-data/progress-bar](apps/docs/content/docs/displaying-data/progress-bar.mdx)

#### ProgressCircle — Circular progress indicator

**when:** Progreso conocido ocupando poco espacio: stats compactas, métricas en card, KPI con valor numérico al lado. `brand` default (R4); `neutral` para secundarias, `red` para indicadores de problema (uso de cuota cerca del límite).
**avoid:** Procesos lineales con sensación de avance (usa `ProgressBar`). Loading indeterminado sin valor (usa `LoaderArc`).
**api:** `ProgressCircle.Root` { value: number, max?, size?: `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`, color?: `'brand' \| 'neutral' \| 'red'`, children? }
**pair:** Frecuentemente con un valor numérico como children del `ProgressCircle.Root` (ej. `65%`).

```tsx
<ProgressCircle.Root value={65}>65%</ProgressCircle.Root>
```

**docs:** [/docs/displaying-data/progress-circle](apps/docs/content/docs/displaying-data/progress-circle.mdx)

#### Divider — Horizontal visual separator

**when:** Separador visual horizontal dentro de un mismo card o sección. **Antes de meter un divider, pregúntate si más spacing alcanza** — un buen layout suele ser mejor que una línea. `line` default (sin texto). Variantes con texto (`line-text`, `text`, `solid-text`) para agrupar contenido por categoría temporal o semántica ("Hoy / Ayer / Esta semana").
**avoid:** Separar pantallas o secciones grandes (el divider se siente subdimensionado — usa Card o sub-page). Dividers consecutivos sin contenido entre ellos.
**api:** `Divider.Root` { variant?: `'line' \| 'line-text' \| 'text' \| 'solid-text' \| 'content'`, children? }
**pair:** Dentro de listas largas para agrupación temporal. Dentro de un card como separador de secciones internas.

```tsx
<Divider.Root />
```

**docs:** [/docs/displaying-data/divider](apps/docs/content/docs/displaying-data/divider.mdx)

#### Banner — Full-width announcement at top of view

**when:** Mensaje full-width destacado para estados del sistema: mantenimientos programados, advertencias críticas, anuncios de feature. Vive en el top de una vista o sección — **mucho más alto en jerarquía que un Toast: interrumpe**. Cinco status semánticos (`error`/`warning`/`success`/`information`/`feature`). `feature` (teal) reservado para anuncios de producto y highlights.
**avoid:** Errores de validación de form (usa `Hint`). Eco de acción del usuario (usa Toast). Closable cuando el banner comunica un error que el usuario debe resolver — la X manda señal de "ignorable".
**api:** `Banner.Root` { status: `'error' \| 'warning' \| 'success' \| 'information' \| 'feature'`, ...HTMLAttributes } · `Banner.Content` · `Banner.Icon` { as: ElementType } · `Banner.CloseButton` { children, onClick? }
**pair:** El `Banner.CloseButton` suele envolver un `RiCloseLine`. La regla: closable solo si es no-bloqueante (`information`, `feature`, `success`).

```tsx
<Banner.Root status="information">
  <Banner.Content>
    <Banner.Icon as={RiInformationFill} />
    Tienes una actualización disponible.
  </Banner.Content>
  <Banner.CloseButton>
    <RiCloseLine />
  </Banner.CloseButton>
</Banner.Root>
```

**docs:** [/docs/displaying-data/banner](apps/docs/content/docs/displaying-data/banner.mdx)

#### Kbd — Keyboard key display

**when:** Mostrar teclas o combinaciones: atajos dentro de tooltips, ayudas inline, command palettes, hints de keyboard navigation. Símbolos cuando aplique (`⌘`, `⇧`, `↩`, `↑/↓`) en lugar de "Cmd"/"Shift"/"Enter" — más compacto. "Ctrl" en texto cuando el target es Windows.
**avoid:** Usarlo como botón — es decoración tipográfica. Si el atajo dispara algo al click, eso es `CompactButton` o `Button` con el Kbd como label adicional.
**api:** `Kbd.Root` { children } (presentacional)
**pair:** Frecuentemente como `Input.InlineAffix` (ej. el `⌘K` de un buscador). Dentro de `Tooltip.Content` para mostrar el shortcut de un botón.

```tsx
<Kbd.Root>⌘ K</Kbd.Root>
```

**docs:** [/docs/displaying-data/kbd](apps/docs/content/docs/displaying-data/kbd.mdx)

#### IconWrapper — Glass-popup container to highlight an icon

**when:** Container glass-popup para destacar un icono: modales, headers, empty states, cards de feature. Hace que el icono "respire" y se lea como protagonista, no decoración. Tres tamaños canónicos: `Standard` (48px) para protagonista en empty state/modal, `Small` (40px) para uso secundario en cards, `Xsmall` (32px) para densidad alta.
**avoid:** Decoración bonita sin razón semántica — el color tinta el fondo y debe reforzar un estado/categoría. Usarlo en filas densas donde sobra ruido.
**api:** No expone una namespace separada — es una receta CSS aplicada a un `<div>` con `glass-popup` + `flex size-X items-center justify-center rounded-xl`. Color de tinta vía `text-X-base` en el ícono interno.
**pair:** Dentro de `Modal.Header`, en empty states con `RiSparklingLine` u otro icono temático, en cards de feature al top izquierdo.

```tsx
<div className="glass-popup flex size-12 shrink-0 items-center justify-center rounded-xl">
  <RiSparklingLine className="text-text-sub-600 size-5" />
</div>
```

**docs:** [/docs/displaying-data/icon-wrapper](apps/docs/content/docs/displaying-data/icon-wrapper.mdx)

#### Chart — Recharts wrapper with DS tokens applied

**when:** Datos estructurados como gráfica. Wrapper sobre `recharts` con tokens del DS aplicados a series, ejes y tooltip. **Forma según dato:** `Chart.Bar` para comparación discreta, `Chart.Line`/`Chart.Area` para series temporales, `Chart.Pie`/`Chart.Radial` para parts-of-whole, `Chart.Radar` para perfil multidimensional. **Si dudas, `Bar` es la opción segura.**
**avoid:** Reasignar colores manualmente — `chart-1` es brand teal (R4), el resto son `chart-2..5` (azul/naranja/morado/amarillo). Importar `recharts` directo cuando los props del wrapper alcanzan.
**api:** `Chart.Bar` / `Chart.Line` / `Chart.Area` / `Chart.Pie` / `Chart.Radial` / `Chart.Radar` { data, config, xKey?/nameKey?, keys?/valueKey?, className }. Para casos avanzados, escapa a primitivas de `recharts` (acceso directo desde el subpath `@biaenergy/ui/chart`).
**pair:** Suele vivir dentro de un card con título y descripción. Tooltip del chart se renderiza con tokens del DS automáticamente.
**pattern · "Chart con título" (dashboard default):** Misma anatomía que la [Table con título](apps/docs/content/docs/displaying-data/table.mdx#con-título). Wrapper de **dos capas**: outer `bg-bg-titled-frame rounded-2xl` (en dark el token cae a `neutral-850`, un step más oscuro que `bg-weak-50`, para que el inner card destaque sin pelear con el page-frame), header con label `text-label-md` (Inter) + `Dropdown` a la derecha, inner card blanca `bg-bg-white-0 rounded-xl border border-stroke-soft-200 shadow-regular-sm` que contiene el chart + leyenda debajo. **Dos controles distintos** que NO se confunden: el **Dropdown del header** cambia el _dataset_ que la gráfica visualiza (período, segmento, fuente — nunca filtra series); la **leyenda debajo** es interactiva — click sobre una entrada aísla esa serie (las demás se atenúan al 40% opacity), click otra vez sobre la misma entrada las restaura. Para Pie/Radial donde "serie" = slice, "aislar" = filtrar la `data` a esa sola fila. Implementación: `hideLegend` para apagar la leyenda interna de recharts y renderizar la leyenda custom como botones con swatch + label. Variantes vivas: [Line](apps/docs/content/docs/charts/line.mdx#con-título) · [Area](apps/docs/content/docs/charts/area.mdx#con-título) · [Bar](apps/docs/content/docs/charts/bar.mdx#con-título) · [Pie](apps/docs/content/docs/charts/pie.mdx#con-título) · [Radar](apps/docs/content/docs/charts/radar.mdx#con-título) · [Radial](apps/docs/content/docs/charts/radial.mdx#con-título).

```tsx
<Chart.Area
  data={data}
  config={config}
  xKey="month"
  keys={['desktop']}
  className="aspect-auto h-[260px] w-full"
/>
```

**docs:** [/docs/displaying-data/chart](apps/docs/content/docs/displaying-data/chart.mdx) — variantes específicas: [Bar](apps/docs/content/docs/charts/bar.mdx), [Line](apps/docs/content/docs/charts/line.mdx), [Area](apps/docs/content/docs/charts/area.mdx), [Pie](apps/docs/content/docs/charts/pie.mdx), [Radar](apps/docs/content/docs/charts/radar.mdx), [Radial](apps/docs/content/docs/charts/radial.mdx)

---

### §6.4 — Feedback

#### Alert — Inline persistent contextual message

**when:** Inline, persistente, en el flow del documento. Vive donde el contexto lo amerita — al inicio de un form, dentro de un card, encima de una tabla. **No tiene timeout** — se queda hasta que la condición que lo motivó cambie. Cinco status semánticos (`information`, `success`, `warning`, `error`, `feature`) — no inventes colores custom.
**avoid:** Mensaje que aparece sin disparo del usuario y se va solo (eso es Toast/Notification). Auto-dismiss con setTimeout — confunde sobre si la condición sigue activa. `feature` para alerts cotidianos — pierde fuerza si se reparte (resérvalo para anuncios de producto).
**api:** `Alert.Root` { status: `'information' \| 'success' \| 'warning' \| 'error' \| 'feature'`, variant?, size? } · `Alert.Icon` { as: ElementType } · `Alert.CloseIcon` { as: ElementType, onClick? }
**pair:** Frecuentemente dentro de un card al inicio (warning de trial expirando, info de configuración faltante). El `Alert.CloseIcon` se incluye solo cuando el alert es no-bloqueante.

```tsx
<Alert.Root status="information">
  <Alert.Icon as={RiInformationFill} />
  Este es un mensaje informativo.
</Alert.Root>
```

**docs:** [/docs/feedback/alert](apps/docs/content/docs/feedback/alert.mdx)

#### Notification — System-driven toast with title + description

**when:** Mensaje del sistema, no del usuario — aparece en respuesta a un evento del backend o de la app: "Tu reporte está listo", "Conexión recuperada", "3 dispositivos sincronizados". Lleva `title` + `description` y se queda hasta que el usuario la cierra. Top-right por default, apilable cuando llegan varias.
**avoid:** Eco inmediato de acción del usuario ("Guardado") — eso es Toast. Repartir en distintas posiciones de pantalla en la misma sesión — rompe el sistema visual.
**api:** Imperativa via función global: `notification({ status, title, description, action? })`. Wrap la app con `<Notification.Provider />` (renderiza el `Notification.Viewport`).
**pair:** Necesita `<Notification.Provider>` montado una vez en la app (típicamente en root layout). `notification.action(...)` para dispatch.

```tsx
notification({
  status: 'information',
  title: 'Ejemplo',
  description: 'Click para disparar una notificación.'
});
```

**docs:** [/docs/feedback/notification](apps/docs/content/docs/feedback/notification.mdx)

#### Toast — Ephemeral feedback for user actions (Sonner-based)

**when:** Eco inmediato de la acción del usuario — confirma que algo pasó en respuesta directa a un click: "Guardado", "Copiado al portapapeles", "Enviado". Vida corta, mensaje suelto (`message` solo). El renderer `AlertToast.Root` toma solo `message` precisamente por eso.
**avoid:** Mensajes del sistema con `title` + `description` (usa `Notification`). Errores graves que el usuario debe ver antes de seguir (usa `Alert` inline o `Modal`) — un toast fugaz puede pasarse por alto.
**api:** `toast.custom((t) => <AlertToast.Root t={t} status={...} message={...} />)` — Sonner under the hood. `<Toaster />` montado en root layout.
**pair:** Necesita `<Toaster />` (de `sonner`) en root. `AlertToast.Root` se compone con el objeto `t` que Sonner pasa al render callback.

```tsx
toast.custom(t => <AlertToast.Root t={t} status="information" message="Operación completada." />);
```

**docs:** [/docs/feedback/toast](apps/docs/content/docs/feedback/toast.mdx)

#### Tooltip — Hover/focus label for icon-only or abbreviated UI

**when:** Etiqueta para nombrar algo que ya está en pantalla pero no lleva texto: un ícono solo (`CompactButton`), un campo abreviado, un avatar. Aparece en hover (cursor) o focus (teclado), nunca en click. **`xsmall` por default** — el del producto BIA. Comparte surface glass con `Modal` y `Popover`; auto-tema en light/dark — no le pongas colores custom.
**avoid:** Mensaje que es un párrafo o requiere lectura pausada (usa `Popover` o texto inline visible). Acciones (links, botones, formularios) adentro del Content — el tooltip se cierra apenas el cursor sale, así que cualquier acción queda inalcanzable con mouse.
**api:** `Tooltip.Provider` { delayDuration?, ... } · `Tooltip.Root` { open?, onOpenChange?, defaultOpen?, delayDuration? } · `Tooltip.Trigger` { asChild? } · `Tooltip.Content` { side?, align?, size?: `'xsmall' \| 'small'` }
**pair:** Casi siempre con `Tooltip.Trigger asChild` envolviendo un `CompactButton.Root` o un `<Button.Icon>`. Para shortcuts, contenido = texto + `Kbd.Root`.

```tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <CompactButton.Root variant="ghost" aria-label="Buscar">
        <CompactButton.Icon as={RiSearchLine} />
      </CompactButton.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Buscar</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

**docs:** [/docs/feedback/tooltip](apps/docs/content/docs/feedback/tooltip.mdx)

---

### §6.5 — Overlays

#### Modal — Blocking dialog requiring decision

**when:** **Bloqueante por diseño** — detiene el flujo y exige una decisión: confirmaciones destructivas, formularios cortos focalizados (4-5 campos), errores que el usuario no puede ignorar. `showClose={false}` cuando la decisión es obligatoria (legal, verificación de identidad). Footer con FancyButton (acción primaria) + Button basic (Cancelar) es el patrón canónico.
**avoid:** Info contextual o complementaria sin requerir foco total (usa `Popover`). Flujos largos (onboarding multi-paso, edición compleja con tabs) — un modal grande con scroll es señal de formato mal elegido. Modales sin footer accionable.
**api:** `Modal.Root` { open?, onOpenChange?, defaultOpen? } · `Modal.Trigger` { asChild? } · `Modal.Close` { asChild? } · `Modal.Portal`, `Modal.Overlay`, `Modal.Content` { showClose? } · `Modal.Header` { title?, description? } · `Modal.Title`, `Modal.Description`, `Modal.Body`, `Modal.Footer`. Built on Radix Dialog — focus trap + ESC + click outside para cerrar (a menos que `showClose={false}`).
**pair:** Footer canónico: `FancyButton.Root` (acción primaria) + `Button.Root variant="basic"` (Cancelar), ambos envueltos en `Modal.Close asChild` para que cerrar el modal sea automático. Para confirmaciones destructivas: `FancyButton.Root variant="destructive"`.

```tsx
<Modal.Root>
  <Modal.Trigger asChild>
    <Button.Root variant="basic">Abrir modal</Button.Root>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header title="Confirmar acción" description="Esta acción no se puede deshacer" />
    <Modal.Body>
      <p className="text-paragraph-sm text-text-sub-600">
        ¿Estás seguro? Los datos serán eliminados de forma permanente.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button.Root variant="basic" className="w-full">
          Cancelar
        </Button.Root>
      </Modal.Close>
      <Modal.Close asChild>
        <FancyButton.Root variant="destructive" className="w-full">
          Eliminar
        </FancyButton.Root>
      </Modal.Close>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>
```

**docs:** [/docs/overlays/modal](apps/docs/content/docs/overlays/modal.mdx)

#### Dropdown — Action menu anchored to a trigger

**when:** Lista de **acciones u opciones** anclada a un trigger: menús contextuales sobre un item, acciones de cuenta (perfil/ajustes/logout), o cuando hay 5+ opciones que no caben como botones. Cada item es accionable. Para alternar estado en línea (multi-selección, modo de vista) usa `CheckboxItem` o `RadioItem` — dejan el check sin cerrar el menú. Jerarquía con `Label` y `Separator`. `MenuSub` solo cuando una opción tiene variantes claras ("Compartir por → Correo / Mensaje").
**avoid:** Solo mostrar info sin acciones (usa `Popover`). Contenido libre (formulario, texto largo, ayuda) — eso es `Popover`. Anidar `MenuSub` por anidar — pierde a los usuarios.
**api:** `Dropdown.Root` { open?, onOpenChange?, defaultOpen? } · `Dropdown.Trigger` { asChild? } · `Dropdown.Content` { side?, align? } · `Dropdown.Item` { onSelect? } · `Dropdown.ItemIcon` { as: ElementType } · `Dropdown.Group`, `Dropdown.Label`, `Dropdown.Separator`, `Dropdown.MenuSub`, `Dropdown.MenuSubTrigger`, `Dropdown.MenuSubContent`, `Dropdown.CheckboxItem`, `Dropdown.RadioGroup`, `Dropdown.RadioItem`, `Dropdown.Arrow`, `Dropdown.Portal`. Built on Radix DropdownMenu.
**pair:** `Dropdown.Trigger asChild` con un `Button.Root variant="basic"` o `CompactButton.Root` (X y more). Los destructivos al final, separados por `Dropdown.Separator`.

```tsx
<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button.Root variant="basic">
      Abrir menú
      <Button.Icon as={RiArrowDownSLine} />
    </Button.Root>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>
      <Dropdown.ItemIcon as={RiUser3Line} />
      Perfil
    </Dropdown.Item>
    <Dropdown.Item>
      <Dropdown.ItemIcon as={RiSettings3Line} />
      Ajustes
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item>
      <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
      Cerrar sesión
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>
```

**docs:** [/docs/overlays/dropdown](apps/docs/content/docs/overlays/dropdown.mdx)

#### Popover — Floating panel with free content

**when:** Panel flotante con contenido **libre** (no solo lista de acciones): info contextual ("¿qué significa este dato?"), ayuda inline, formularios cortos asociados a un control. **No bloqueante** — cierra al click fuera, no atrapa el foco. Anclado a un trigger concreto (o `Anchor` separado).
**avoid:** Solo una etiqueta breve (usa `Tooltip`). Acciones discretas en lista (usa `Dropdown`). Bloquear el flujo (usa `Modal`). Popover sin trigger visual claro — el usuario pierde contexto.
**api:** `Popover.Root` { open?, onOpenChange?, defaultOpen? } · `Popover.Trigger` { asChild? } · `Popover.Anchor` { asChild? } (si quieres desacoplar trigger del anchor) · `Popover.Content` { side?, align? } · `Popover.Close` { asChild? }. Built on Radix Popover.
**pair:** Trigger suele ser `Button.Root variant="basic"` con un icono info o un `CompactButton.Root variant="ghost"`. Dentro del `Popover.Content` cabe cualquier composición (texto, form chico, datepicker).

```tsx
<Popover.Root>
  <Popover.Trigger asChild>
    <Button.Root variant="basic">
      <Button.Icon as={RiInformationFill} />
      Más info
    </Button.Root>
  </Popover.Trigger>
  <Popover.Content>
    <div className="flex max-w-[280px] flex-col gap-2">
      <p className="text-label-sm text-text-strong-950">Sobre este dato</p>
      <p className="text-paragraph-sm text-text-sub-600">
        El consumo se calcula sumando las lecturas del periodo activo en kWh.
      </p>
    </div>
  </Popover.Content>
</Popover.Root>
```

**docs:** [/docs/overlays/popover](apps/docs/content/docs/overlays/popover.mdx)

---

### §6.6 — Layout

#### Accordion — Collapsible content reveal (not navigation)

**when:** **Revelar, no navegar** — el contenido vive en la misma página y se expande inline. `single + collapsible` para FAQs y bloques alternativos donde tiene sentido leer uno a la vez. `multiple` cuando abrir uno no debe cerrar otro — settings agrupados, filtros expandibles, secciones que el usuario puede comparar.
**avoid:** Secciones alternativas con cambio claro de vista (usa `TabMenuHorizontal` o `SegmentedControl`). Esconder lo que define la pantalla — el accordion es para contenido **secundario** (detalles, ayuda contextual, secciones largas).
**api:** `Accordion.Root` { type: `'single' \| 'multiple'`, collapsible?: boolean, value?, onValueChange?, defaultValue? } · `Accordion.Item` { value: string } · `Accordion.Header`, `Accordion.Trigger`, `Accordion.Icon` { as: ElementType }, `Accordion.Arrow`, `Accordion.Content`. Built on Radix Accordion.
**pair:** Para FAQ: `single + collapsible`, una pregunta abierta a la vez. Para settings expandibles: `multiple`.

```tsx
<Accordion.Root type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>
        ¿Cómo funciona el ciclo de facturación?
        <Accordion.Arrow />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Facturamos mensualmente el día 1. El corte incluye el consumo completo del mes anterior y
      cualquier ajuste pendiente.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

**docs:** [/docs/layout/accordion](apps/docs/content/docs/layout/accordion.mdx)

#### Breadcrumb — Hierarchical navigation path

**when:** Solo cuando hay jerarquía de **3+ niveles** y el usuario necesita saber dónde está parado y cómo volver. El último item es la página actual (`active`, sin `<a>`, sin hover underline). Reemplaza un eslabón por un `Select` inline cuando ese nivel admite intercambio horizontal (workspace o proyecto que el usuario cambia seguido).
**avoid:** Flujos de 1-2 niveles (un título de pantalla y un back button hacen el trabajo, ocupar espacio sin aportar). Items intermedios que no naveguen — todos los anteriores al `active` deben ser links reales.
**api:** `Breadcrumb.Root` · `Breadcrumb.Item` { active?: boolean, asChild? } · `Breadcrumb.Icon` { as: ElementType } · `Breadcrumb.ArrowIcon` { as: ElementType }
**pair:** Vive en el header de un card, junto a botones de navegación (`CompactButton` back/forward). Combina con `Select.Root variant="inline"` para niveles intercambiables.

```tsx
<Breadcrumb.Root>
  <Breadcrumb.Item asChild>
    <a href="#">Inicio</a>
  </Breadcrumb.Item>
  <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
  <Breadcrumb.Item asChild>
    <a href="#">Configuración</a>
  </Breadcrumb.Item>
  <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
  <Breadcrumb.Item active>Perfil</Breadcrumb.Item>
</Breadcrumb.Root>
```

**docs:** [/docs/layout/breadcrumb](apps/docs/content/docs/layout/breadcrumb.mdx)

#### SegmentedControl — Toggle between mutually exclusive views (2-4 short labels)

**when:** Conmutar **vistas del mismo contenido** — el qué no cambia, cambia cómo se mira: Día/Semana/Mes, Lista/Grid, Resumen/Detalles. 2 a 4 opciones cortas (una palabra o un icono). El indicador flotante sobre fondo de caja es lo que lo distingue visualmente de tabs.
**avoid:** Cambiar entre **secciones distintas** con su propio título y propósito (usa `TabMenuHorizontal`). 5+ opciones — la caja se vuelve un menú y pierde lectura.
**api:** `SegmentedControl.Root` { value?, onValueChange?, defaultValue, orientation?: `'horizontal' \| 'vertical'` } · `SegmentedControl.List` · `SegmentedControl.Trigger` { value: string } · `SegmentedControl.Content` { value: string }
**pair:** Embebible en una toolbar al lado de otros controles (`Input`, `Select.Root variant="compact"`). Para nav lateral del shell, version `orientation="vertical"`.

```tsx
<SegmentedControl.Root defaultValue="day">
  <SegmentedControl.List className="w-max">
    <SegmentedControl.Trigger value="day">Día</SegmentedControl.Trigger>
    <SegmentedControl.Trigger value="week">Semana</SegmentedControl.Trigger>
    <SegmentedControl.Trigger value="month">Mes</SegmentedControl.Trigger>
  </SegmentedControl.List>
</SegmentedControl.Root>
```

**docs:** [/docs/layout/segmented-control](apps/docs/content/docs/layout/segmented-control.mdx)

#### TabMenuHorizontal — Section navigation with animated underline

**when:** Navegación entre **secciones de una pantalla** con su propio contenido y propósito: Resumen / Consumo / Facturas / Equipo dentro de la misma feature. **3+ secciones** (con 2 pesa demasiado, un toggle es más liviano). Subrayado bajo el activo es la señal — vive sobre `bg-bg-white-0` sin caja. Scroll horizontal entra solo cuando hace falta.
**avoid:** Alternar la representación del mismo dato (usa `SegmentedControl`). Muchísimas secciones (considera `TabMenuVertical` en sidebar). Menos de 3 secciones (usa toggle/segmented).
**api:** `TabMenuHorizontal.Root` { value?, onValueChange?, defaultValue, orientation? } · `TabMenuHorizontal.List` · `TabMenuHorizontal.Trigger` { value: string } · `TabMenuHorizontal.Icon` { as: ElementType } · `TabMenuHorizontal.ArrowIcon` { as: ElementType } · `TabMenuHorizontal.Content` { value: string }. Built on Radix Tabs.
**pair:** Cada `Trigger` puede llevar `Icon`, badge o counter (`<Badge.Root variant="lighter">3</Badge.Root>`).

```tsx
<TabMenuHorizontal.Root defaultValue="resumen">
  <TabMenuHorizontal.List>
    <TabMenuHorizontal.Trigger value="resumen">Resumen</TabMenuHorizontal.Trigger>
    <TabMenuHorizontal.Trigger value="consumo">Consumo</TabMenuHorizontal.Trigger>
    <TabMenuHorizontal.Trigger value="facturas">Facturas</TabMenuHorizontal.Trigger>
  </TabMenuHorizontal.List>
  <TabMenuHorizontal.Content value="resumen" className="text-paragraph-sm text-text-sub-600 pt-4">
    Panorama general de la cuenta.
  </TabMenuHorizontal.Content>
</TabMenuHorizontal.Root>
```

**docs:** [/docs/layout/tab-menu-horizontal](apps/docs/content/docs/layout/tab-menu-horizontal.mdx)

#### TabMenuVertical — Sidebar navigation with grouped sub-items

**when:** Sidebar de settings o navegación principal. La columna deja ver todas las opciones a la vez — ideal cuando hay muchas y necesitan escanearse rápido. **`Group` para multinivel:** `Group + GroupTrigger + GroupContent + SubItem` (chevron rotativo, línea vertical de conexión, sub-items que cambian la tab activa global). Iconos opcionales pero recomendados en sidebar denso.
**avoid:** Pocas secciones que caben en una fila (usa `TabMenuHorizontal`). Anidar más de un nivel — pierde a los usuarios.
**api:** `TabMenuVertical.Root` { value?, onValueChange?, defaultValue } · `TabMenuVertical.List` · `TabMenuVertical.Trigger` { value: string } · `TabMenuVertical.Icon` { as: ElementType } · `TabMenuVertical.Content` { value: string } · `TabMenuVertical.Group` { defaultOpen? } · `TabMenuVertical.GroupTrigger`, `TabMenuVertical.GroupContent`, `TabMenuVertical.SubItem` { value: string }
**pair:** Cada `Trigger` puede llevar icono líder (`TabMenuVertical.Icon`). `Group` se usa para "Settings → General / Equipo / Integraciones" con sub-items navegables. En el shell de la app, vive dentro del card como menú lateral.

```tsx
<TabMenuVertical.Root defaultValue="perfil" className="flex gap-6">
  <TabMenuVertical.List className="max-w-[200px]">
    <TabMenuVertical.Trigger value="perfil">
      <TabMenuVertical.Icon as={RiUser3Line} />
      Perfil
    </TabMenuVertical.Trigger>
    <TabMenuVertical.Trigger value="notificaciones">
      <TabMenuVertical.Icon as={RiNotification3Line} />
      Notificaciones
    </TabMenuVertical.Trigger>
  </TabMenuVertical.List>
  <div className="text-paragraph-sm text-text-sub-600 flex-1">
    <TabMenuVertical.Content value="perfil">
      Actualiza tu nombre, email y foto de perfil.
    </TabMenuVertical.Content>
  </div>
</TabMenuVertical.Root>
```

**docs:** [/docs/layout/tab-menu-vertical](apps/docs/content/docs/layout/tab-menu-vertical.mdx)

---

### §6.7 — Navigation

#### DotStepper — Mute progress indicator (3-5 short steps)

**when:** Indicador minimal de progreso — solo cantidad y posición. Para flujos cortos (carruseles, onboarding de 3-4 pasos, slides de primer contacto) donde el usuario no necesita saber _qué_ hay en cada paso, solo _cuántos_ le quedan. **3-5 items, no más.**
**avoid:** Pasos con label visible (usa `HorizontalStepper` o `VerticalStepper`). Más de 5 dots — el usuario no escanea 8 puntos para ubicarse.
**api:** `DotStepper.Root` · `DotStepper.Item` { active?: boolean }
**pair:** Frecuentemente al pie de un carrusel o onboarding multi-slide.

```tsx
<DotStepper.Root>
  <DotStepper.Item />
  <DotStepper.Item active />
  <DotStepper.Item />
  <DotStepper.Item />
</DotStepper.Root>
```

**docs:** [/docs/navigation/dot-stepper](apps/docs/content/docs/navigation/dot-stepper.mdx)

#### HorizontalStepper — Linear stepper with labels (checkout, wizard)

**when:** Flujos lineales con label visible: checkouts, wizards multi-paso, formularios largos divididos en secciones. Tres estados: `completed`, `active`, `pending`. Cada item lleva número o ícono. Vive arriba del flow, ancho completo.
**avoid:** Indicador mudo de pocos pasos (usa `DotStepper`). Flujo vertical en sidebar (usa `VerticalStepper`). Inventar más estados — los detalles del paso van en el contenido, no en el stepper.
**api:** `HorizontalStepper.Root` · `HorizontalStepper.Item` { state?: `'completed' \| 'active' \| 'pending'` } · `HorizontalStepper.ItemIndicator` { children } · `HorizontalStepper.SeparatorIcon` { as?: ElementType }
**pair:** Acompañado por contenido del step actual abajo (el detalle no va en el stepper). Botones del flow (Next/Back) son `FancyButton.Root` + `Button.Root variant="basic"`.

```tsx
<HorizontalStepper.Root>
  <HorizontalStepper.Item state="completed">
    <HorizontalStepper.ItemIndicator>1</HorizontalStepper.ItemIndicator>
    <span>Datos</span>
  </HorizontalStepper.Item>
  <HorizontalStepper.SeparatorIcon />
  <HorizontalStepper.Item state="active">
    <HorizontalStepper.ItemIndicator>2</HorizontalStepper.ItemIndicator>
    <span>Dirección</span>
  </HorizontalStepper.Item>
  <HorizontalStepper.SeparatorIcon />
  <HorizontalStepper.Item>
    <HorizontalStepper.ItemIndicator>3</HorizontalStepper.ItemIndicator>
    <span>Pago</span>
  </HorizontalStepper.Item>
</HorizontalStepper.Root>
```

**docs:** [/docs/navigation/horizontal-stepper](apps/docs/content/docs/navigation/horizontal-stepper.mdx)

#### VerticalStepper — Column stepper for sidebars or onboarding

**when:** Stepper en columna para flujos largos o laterales: onboarding multi-paso, sidebars de progreso, configuraciones por etapas. Mismos 3 estados que el horizontal (`completed`, `active`, `pending`). La flecha indicadora opcional refuerza la dirección descendente.
**avoid:** Flujos cortos en el top de una vista (usa `HorizontalStepper`). Indicador mudo (usa `DotStepper`).
**api:** `VerticalStepper.Root` · `VerticalStepper.Item` { state?: `'completed' \| 'active' \| 'pending'` } · `VerticalStepper.ItemIndicator` { children } · `VerticalStepper.Arrow`
**pair:** En sidebar de onboarding, suele ir junto al contenido del step activo a la derecha.

```tsx
<VerticalStepper.Root className="max-w-[280px]">
  <VerticalStepper.Item state="completed">
    <VerticalStepper.ItemIndicator>1</VerticalStepper.ItemIndicator>
    <span>Cuenta creada</span>
    <VerticalStepper.Arrow />
  </VerticalStepper.Item>
  <VerticalStepper.Item state="active">
    <VerticalStepper.ItemIndicator>2</VerticalStepper.ItemIndicator>
    <span>Verifica tu email</span>
    <VerticalStepper.Arrow />
  </VerticalStepper.Item>
</VerticalStepper.Root>
```

**docs:** [/docs/navigation/vertical-stepper](apps/docs/content/docs/navigation/vertical-stepper.mdx)

#### Pagination — Page controls for tables and lists

**when:** Tablas y listas con páginas **discretas** finitas. El usuario necesita saber qué página ve, cuántas hay, y poder saltar a una específica. Vive al pie del contenido, alineado al final o centrado. Item seleccionado con glass-popup; los demás un escalón más sutil.
**avoid:** Feeds o scroll continuo — eso es scroll virtual o "load more" (Pagination implica páginas finitas y numeradas). Arriba del contenido — competiría con el header de la tabla.
**api:** `Pagination.Root` · `Pagination.Item` { current?: boolean } · `Pagination.NavButton` { onClick?, disabled? } · `Pagination.NavIcon` { as: ElementType }
**pair:** Casi siempre con `Table.Root` arriba. Suele venir con un Select.compact "Items por página" al lado izquierdo.

```tsx
<Pagination.Root>
  <Pagination.NavButton>
    <Pagination.NavIcon as={RiArrowLeftSLine} />
  </Pagination.NavButton>
  <Pagination.Item>1</Pagination.Item>
  <Pagination.Item current>2</Pagination.Item>
  <Pagination.Item>3</Pagination.Item>
  <Pagination.NavButton>
    <Pagination.NavIcon as={RiArrowRightSLine} />
  </Pagination.NavButton>
</Pagination.Root>
```

**docs:** [/docs/navigation/pagination](apps/docs/content/docs/navigation/pagination.mdx)

---

### §6.8 — Charts

> Todos los charts son variantes del wrapper `Chart.*` documentado en §6.3 (Displaying Data). Comparten la misma filosofía:
>
> - Tokens del DS aplicados a series, ejes y tooltip.
> - `chart-1` = brand teal (R4); `chart-2..5` siguen un set fijo. **No reasignes colores manualmente.**
> - Forma según dato: Bar para comparación discreta, Line/Area para series temporales, Pie/Radial para parts-of-whole, Radar para perfil multidimensional.
> - Si dudas, **`Bar` es la opción segura.**

#### Chart.Bar — Discrete comparisons across categories

**when:** Comparar magnitudes entre categorías discretas. Barras verticales u horizontales, agrupadas o apiladas. **La gráfica más legible** para comparación — si dudas entre tipos, es esta.
**avoid:** Series temporales largas (usa `Line` o `Area`). Distribuciones que suman 100% (usa `Pie`/`Radial`).
**api:** `Chart.Bar` { data, config, xKey, keys: string[], className }
**titled wrapper:** Para dashboards, montá la Bar dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied) (header con Dropdown de dataset + legend click-to-isolate debajo). Ver [/docs/charts/bar#con-título](apps/docs/content/docs/charts/bar.mdx#con-título).

```tsx
<Chart.Bar
  data={data}
  config={config}
  xKey="month"
  keys={['desktop']}
  className="aspect-auto h-[260px] w-full"
/>
```

**docs:** [/docs/charts/bar](apps/docs/content/docs/charts/bar.mdx)

#### Chart.Line — Temporal series, clean reading for 3+ overlapping

**when:** Series temporales sin relleno. Lectura más limpia que `Area` cuando hay 3+ series superpuestas (el relleno satura).
**avoid:** Una sola serie acumulativa (`Area` es más legible). Comparación discreta (usa `Bar`).
**api:** `Chart.Line` { data, config, xKey, keys: string[], className }
**titled wrapper:** Para dashboards, montá la Line dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied). La página `/docs/charts/line` tiene el **wrapper completo copy-paste-able** — usalo como referencia para el resto de las variantes. Ver [/docs/charts/line#con-título](apps/docs/content/docs/charts/line.mdx#con-título).

```tsx
<Chart.Line
  data={data}
  config={config}
  xKey="month"
  keys={['desktop']}
  className="aspect-auto h-[260px] w-full"
/>
```

**docs:** [/docs/charts/line](apps/docs/content/docs/charts/line.mdx)

#### Chart.Area — Temporal series with cumulative feel (1-2 series)

**when:** Series temporales con relleno bajo la línea — sensación de "magnitud acumulada". Ideal para 1-2 series.
**avoid:** 3+ series superpuestas (usa `Line` para que sea legible).
**api:** `Chart.Area` { data, config, xKey, keys: string[], className }
**titled wrapper:** Para dashboards, montá la Area dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied). Ver [/docs/charts/area#con-título](apps/docs/content/docs/charts/area.mdx#con-título).

```tsx
<Chart.Area
  data={data}
  config={config}
  xKey="month"
  keys={['desktop']}
  className="aspect-auto h-[260px] w-full"
/>
```

**docs:** [/docs/charts/area](apps/docs/content/docs/charts/area.mdx)

#### Chart.Pie — Parts of a whole that sum to 100%

**when:** Distribuciones que suman 100% donde el peso relativo de cada parte es la información clave. Cada fila del data es un slice; los colores se inyectan automáticamente desde `config[<sliceName>].color`.
**avoid:** Más de 5-6 slices (se vuelve ilegible). Comparaciones que no suman a un total (usa `Bar`).
**api:** `Chart.Pie` { data, config, nameKey, valueKey, className }
**titled wrapper:** Para dashboards, montá la Pie dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied). En Pie, la leyenda lista cada slice; "aislar" filtra la `data` a esa sola fila (queda un círculo del 100% del slice elegido). Pasale `hideLegend` para apagar la leyenda interna de recharts. Ver [/docs/charts/pie#con-título](apps/docs/content/docs/charts/pie.mdx#con-título).

```tsx
<Chart.Pie
  data={data}
  config={config}
  nameKey="source"
  valueKey="visitors"
  className="mx-auto aspect-square h-[280px]"
/>
```

**docs:** [/docs/charts/pie](apps/docs/content/docs/charts/pie.mdx)

#### Chart.Radar — Multi-dimensional profile of an entity

**when:** Perfil multidimensional de una entidad — eje categórico al perímetro, valores radiales desde el centro. Útil para evaluaciones, capabilities, comparativas multivariable (ej. capacidades de un usuario en distintas dimensiones).
**avoid:** Series temporales (usa `Line`). Comparación entre N entidades superpuestas (la legibilidad cae rápido con 3+).
**api:** `Chart.Radar` { data, config, nameKey, keys: string[], className }
**titled wrapper:** Para dashboards, montá la Radar dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied) (mismo wrapper que Line/Bar/Area: dataset Dropdown + legend click-to-isolate). Ver [/docs/charts/radar#con-título](apps/docs/content/docs/charts/radar.mdx#con-título).

```tsx
<Chart.Radar
  data={data}
  config={config}
  nameKey="dimension"
  keys={['a']}
  className="mx-auto aspect-square h-[300px]"
/>
```

**docs:** [/docs/charts/radar](apps/docs/content/docs/charts/radar.mdx)

#### Chart.Radial — Concentric arcs for parallel progress

**when:** Slices renderizados como arcos concéntricos (en lugar de cuñas). Ideal para progreso paralelo (varios objetivos contra su máximo) o distribuciones con énfasis radial.
**avoid:** Pocas categorías (`Pie` es más legible). Series temporales (usa `Line` o `Area`).
**api:** `Chart.Radial` { data, config, nameKey, valueKey, className }
**titled wrapper:** Para dashboards, montá la Radial dentro del [patrón "Chart con título"](#chart--recharts-wrapper-with-ds-tokens-applied). Como en Pie, la leyenda lista cada anillo; "aislar" filtra la `data` a esa sola fila (queda un solo arco contra el background). Pasale `hideLegend`. Ver [/docs/charts/radial#con-título](apps/docs/content/docs/charts/radial.mdx#con-título).

```tsx
<Chart.Radial
  data={data}
  config={config}
  nameKey="source"
  valueKey="visitors"
  className="mx-auto aspect-square h-[300px]"
/>
```

**docs:** [/docs/charts/radial](apps/docs/content/docs/charts/radial.mdx)

---

### §6.9 — Loaders & UI Helpers

#### LoaderArc — Inline spinner (in-button, in-control)

**when:** El spinner inline canónico — un anillo girando 1s linear infinite. Vive **adentro** de algo: un botón en loading, un menú reordenándose, un input validando. Asociado al control que disparó la acción. Hereda el color del padre (`currentColor`) — no le pases color.
**avoid:** Page-mount o panel-mount (usa `LoaderBrand.Pill`). Spinner por más de 1.5s sin reportar progreso (considera `ProgressBar`/`ProgressCircle` con valor). Combinarlo con `Skeleton` en la misma surface — mezclas dos lenguajes.
**api:** `LoaderArc.Root` { size?: `'xs' \| 'sm' \| 'md' \| 'lg'` (12/16/24/32 px) }
**pair:** Lo mete el `Button` automáticamente cuando le pasas `state="loading"` — no instáncialo manualmente para botones (ver §7 Pattern: Button lifecycle).

```tsx
<LoaderArc.Root size="md" />
```

**docs:** [/docs/foundations/loaders](apps/docs/content/docs/foundations/loaders.mdx)

#### LoaderBrand — Brand-colored page-mount loader (dot-matrix wave)

**when:** Page-mount o panel-mount — lo que el usuario percibe como "la app aún no llegó". Una grilla 4×4 de dots con wave concéntrico animado. **`LoaderBrand.Pill` es el default** — el dot-matrix dentro de un chip glass-popup, listo para superponer en cualquier surface (el chip aporta el contraste necesario sobre fondos arbitrarios). `LoaderBrand.Root` (raw) cuando la surface ya provee el chrome (centrado en card vacía, splash con backdrop propio). **Una sola instancia en pantalla a la vez.**
**avoid:** Loading inline dentro de un control (usa `LoaderArc`). Múltiples LoaderBrand simultáneos. Usar `LoaderBrand.Root` cuando la surface no tiene chrome propio — sin chip se ve perdido.
**api:** `LoaderBrand.Pill` { size?: `'sm' \| 'md' \| 'lg'` (24/36/56 px), speed?: number, cycle?: number } · `LoaderBrand.Root` { size?, speed?, cycle?, style? } (color via `style={{ color: ... }}`, default `var(--color-brand-base)`)
**pair:** Centrado dentro del card cuando la página entera está cargando. Sobre splash inicial, sobre panel cuyo contenido aún no llegó.

```tsx
<LoaderBrand.Pill size="md" />
```

**docs:** [/docs/foundations/loaders](apps/docs/content/docs/foundations/loaders.mdx)

#### Skeleton — Content placeholder (dot-field with diagonal wave)

**when:** Alternativa al `LoaderBrand` cuando ya tienes el shell de la página montado y solo faltan datos puntuales: una row de tabla, una card de feed, el cuerpo de un panel. Es válido pero no el default — **si dudas, elige `LoaderBrand`.** El consumer le da el bounding box (`h-*`, `w-*`); la wave aparece sola.
**avoid:** Combinarlo con `LoaderArc`/`LoaderBrand` en la misma surface — mezclas lenguajes. Skeletons de muchos rows individuales con timings diferentes — la wave debería ser uniforme.
**api:** `Skeleton.Root` { shape?: `'rect' \| 'circle' \| 'pill'` (default `'rect'` rounded-md), ...HTMLAttributes }
**pair:** Dentro de filas de tabla cuando los datos llegan progresivamente. En cards de feed o lista cuando el shell ya está montado.

```tsx
<Skeleton.Root className="h-4 w-32" />
<Skeleton.Root shape="circle" className="size-10" />
```

**docs:** [/docs/foundations/loaders](apps/docs/content/docs/foundations/loaders.mdx)

---

## §7 · Patrones cross-cutting

Composiciones canónicas que aparecen en muchas pantallas. Cada patrón cita las reglas que lo justifican.

### P1 — Form base (Label + control + Hint)

El trío canónico de cualquier campo de formulario. Cumple R9 (errors van en pareja control + Hint).

```tsx
import { Label, Input, Hint } from '@biaenergy/ui';
import { RiInformationLine, RiErrorWarningFill } from '@biaenergy/ui/icons';

function EmailField({ value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label.Root htmlFor="email" required>
        Correo electrónico
      </Label.Root>
      <Input.Root hasError={!!error}>
        <Input.Wrapper>
          <Input.Input
            id="email"
            type="email"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="tu@email.com"
          />
        </Input.Wrapper>
      </Input.Root>
      {error ? (
        <Hint.Root hasError>
          <Hint.Icon as={RiErrorWarningFill} />
          {error}
        </Hint.Root>
      ) : (
        <Hint.Root>
          <Hint.Icon as={RiInformationLine} />
          Te enviaremos confirmación a esta dirección.
        </Hint.Root>
      )}
    </div>
  );
}
```

**Aplica a todo control de form:** `Input`, `Textarea`, `Select`, `Datepicker`, `DigitInput`, `FileUpload`, `Checkbox`, `Radio`, `Switch`, `Slider`. La estructura `Label → control → Hint` es la afordancia que un usuario de BIA aprende y reutiliza.

**Reglas citadas:** R9 (errors en pareja).

### P2 — `asChild` para polimorfismo

Cuando un componente debe **renderizar como otro elemento** sin perder su estilo. Patrón Radix Slot — disponible en la mayoría de los `Root`s.

```tsx
// Un link semántico (<a>) que se ve como botón
<Button.Root asChild>
  <a href="/dashboard">Ir al dashboard</a>
</Button.Root>

// Un breadcrumb item que es link real
<Breadcrumb.Item asChild>
  <a href="/settings">Settings</a>
</Breadcrumb.Item>

// Un trigger de modal/dropdown que es un botón custom
<Modal.Trigger asChild>
  <Button.Root variant="basic">Abrir modal</Button.Root>
</Modal.Trigger>
```

**Cuándo:** un componente custom o un elemento HTML semántico (`<a>`, `<label>`, `<form>`) debe heredar el estilo del componente del DS sin envolverlo en otro elemento. Disponible en: `Button.Root`, `FancyButton.Root`, `Modal.Trigger`/`Close`, `Dropdown.Trigger`, `Popover.Trigger`/`Anchor`/`Close`, `Tooltip.Trigger`, `Breadcrumb.Item`, `Badge.Root`, `Tag.Root`, etc. Si la prop existe, es el canal correcto.

**No la uses para:** envolver dos hijos (Slot solo acepta uno). Componer manualmente cuando el componente ya tiene `asChild` — duplicas trabajo.

### P3 — Modal canónico (Header + Body + Footer)

```tsx
import { Modal, Button, FancyButton } from '@biaenergy/ui';

<Modal.Root>
  <Modal.Trigger asChild>
    <Button.Root variant="basic">Abrir</Button.Root>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header title="Confirmar eliminación" description="Esta acción no se puede deshacer." />
    <Modal.Body>
      <p className="text-paragraph-sm text-text-sub-600">
        Se eliminarán permanentemente los datos asociados a este registro. Confirma solo si estás
        seguro.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button.Root variant="basic" className="w-full">
          Cancelar
        </Button.Root>
      </Modal.Close>
      <Modal.Close asChild>
        <FancyButton.Root variant="destructive" className="w-full">
          Eliminar
        </FancyButton.Root>
      </Modal.Close>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>;
```

**Reglas citadas:** R7 (jerarquía de botones — destructive primary + basic cancel), R10 (si el modal vive en stacking context conflictivo, envolver con `PortalContainerProvider`).

### P4 — Dropdown vs Popover vs Tooltip — cuál usar cuándo

```
Tooltip   → etiqueta breve hover-only para algo sin texto       (xsmall, no clickeable)
Popover   → panel flotante con contenido libre (info, form)     (no bloqueante, click outside cierra)
Dropdown  → lista de acciones u opciones anclada a trigger      (cada item accionable, atrapa keyboard)
Modal     → diálogo bloqueante que requiere decisión            (focus trap, ESC/click outside opcional)
```

Decisión rápida:

- **¿Es solo una palabra y no requiere click?** → `Tooltip`.
- **¿Tiene varios items accionables (perfil/ajustes/logout)?** → `Dropdown`.
- **¿Es contenido libre (form chico, descripción larga, datepicker)?** → `Popover`.
- **¿Bloquea el flow hasta que el usuario decida algo?** → `Modal`.

### P5 — Loading states (LoaderArc / LoaderBrand / Skeleton — cuándo cada uno)

Tres tipos de "espera" — cada uno tiene su rol (ver §6.9):

```
LoaderArc       → adentro de un control (botón en loading, menú reordenándose)
                  Hereda color del padre. El Button lo mete automáticamente con state="loading".

LoaderBrand     → page-mount o panel-mount ("la app aún no llegó")
  .Pill (default) → sobre cualquier surface — chip glass-popup aporta contraste
  .Root  (raw)    → cuando la surface ya provee chrome (card vacía, splash con backdrop)
                  Una sola instancia en pantalla a la vez.

Skeleton        → secundario, cuando ya tienes shell montado y faltan datos puntuales
                  Si dudas entre Skeleton y LoaderBrand → elige LoaderBrand.
```

**Tres reglas duras (de [foundations/loaders](apps/docs/content/docs/foundations/loaders.mdx)):**

1. Nunca un spinner por más de 1.5s sin reportar progreso (sube a `ProgressBar`/`ProgressCircle` con valor).
2. Nunca combines `Skeleton` y `LoaderArc`/`LoaderBrand` en la misma superficie — mezclas lenguajes.
3. Nunca bloquees la página entera cuando solo una región está cargando.

### P6 — Button lifecycle (state machine: idle → loading → success → error)

El `Button` tiene una state machine integrada. El consumer flippea el state — el botón gestiona la transición visual (lockea width, fade-out a children, fade-in a `LoaderArc`, flash a `brand-base` en success con `RiCheckLine` + confetti, shake en error).

```tsx
import { Button } from '@biaenergy/ui';
import { useState } from 'react';

function SaveButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setState('loading');
    try {
      await save();
      setState('success');
      setTimeout(() => setState('idle'), 1200);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 600);
    }
  };

  return (
    <Button.Root state={state} onClick={handleSave}>
      Guardar cambios
    </Button.Root>
  );
}
```

**Confetti:**

- `confetti="dots"` (default) — 12 partículas CSS, sin peer-deps. Apropiado para la mayoría de los success.
- `confetti={(rect) => ...}` — callback con el `getBoundingClientRect()` del botón al cruzar loading→success. Reservado para "really happy moments" (confirmar pago, completar onboarding) — la docs site usa `canvas-confetti` para físicas más exageradas.
- `confetti={false}` — sin efecto.

**Timings recomendados:**

- Loading hold: lo que tarde la operación. Si supera 1.5s, considera `ProgressBar` con valor.
- Success hold antes de volver a idle: **1200 ms**.
- Error hold antes de volver a idle: **600 ms**.

El consumer es **dueño del state** — el botón nunca se auto-revierte. `prefers-reduced-motion` desactiva shake y confetti automáticamente.

### P7 — PortalContainer para overlays en stacking context (R10)

Cuando un overlay (`Modal`, `Dropdown`, `Popover`, `Tooltip`, `Select`) vive dentro de un container con `transform`, `filter`, `perspective`, `contain`, `will-change`, o cualquier nuevo stacking context, el portal default puede aparecer detrás o quedar clipped.

```tsx
import { PortalContainerProvider, Dropdown } from '@biaenergy/ui';
import { useRef } from 'react';

function DrawerWithDropdown() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="transform-gpu">
      {' '}
      {/* crea stacking context */}
      <PortalContainerProvider container={containerRef.current}>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button.Root variant="basic">Acciones</Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Editar</Dropdown.Item>
            <Dropdown.Item>Eliminar</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </PortalContainerProvider>
    </div>
  );
}
```

**No la necesitas cuando:** el overlay vive directamente bajo `<body>` (la mayoría de los casos). Úsala solo si ves que el overlay aparece detrás del padre o queda clipped.

### P8 — Filtros toggleable (Button basic + estado seleccionado replica el hover)

Patrón canónico para una row de filtros que se seleccionan/deseleccionan. Tamaño `small` por default — los filtros no deberían competir con el contenido que filtran. Estado seleccionado **replica el visual del hover** (`bg-weak-50` + `text-strong-950`) más un ring `stroke-sub-300` un escalón más notable que el default.

```tsx
import { Button } from '@biaenergy/ui';
import { useState } from 'react';

function FilterRow() {
  const [active, setActive] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setActive(s => {
      const next = new Set(s);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="flex flex-wrap gap-2">
      {['Hoy', 'Esta semana', 'Este mes', 'Todos'].map(label => (
        <Button.Root
          key={label}
          variant="basic"
          size="small"
          data-state={active.has(label) ? 'on' : 'off'}
          onClick={() => toggle(label)}
        >
          {label}
        </Button.Root>
      ))}
    </div>
  );
}
```

**No uses `Tag` para esto** — Tag es etiqueta descriptiva no interactiva. Filtros toggleables son una variante deliberada de `Button basic` (ver Button card y filosofía).

---

## §8 · Anti-patrones

Las violaciones más comunes que un agente comete cuando no leyó las reglas. Cada una cita la regla violada y muestra ❌ vs ✅. Cita los IDs cuando hagas un code review.

### AP1 — Color crudo en componente [viola R5]

❌

```tsx
<div className="border-red-300 bg-teal-400 text-white">...</div>
```

✅

```tsx
<div className="bg-brand-base text-static-white border-error-base">...</div>
```

**Por qué:** los crudos no auto-flippean en dark, no comunican intención semántica, y rompen la centralización del branding.

---

### AP2 — Primary button con `Button.Root` [viola R7]

❌

```tsx
<Button.Root variant="primary">Confirmar</Button.Root>
```

✅

```tsx
<FancyButton.Root>Confirmar</FancyButton.Root>
```

**Por qué:** `variant="primary"` existe en `Button` por compatibilidad histórica, pero **no es parte del lenguaje BIA**. La acción protagonista siempre es FancyButton.

---

### AP3 — Icon import desde `@remixicon/react` [viola R2, R11]

❌

```tsx
import { RiArrowRightSLine } from '@remixicon/react';
```

✅

```tsx
import { RiArrowRightSLine } from '@biaenergy/ui/icons';
```

**Por qué:** el subpath wrap los íconos como client references. Importar de `@remixicon/react` directo rompe el RSC boundary cuando se pasan como prop desde Server Component.

---

### AP4 — `dark:` sobre tokens [viola R6]

❌

```tsx
<div className="bg-bg-white-0 dark:bg-bg-strong-950 text-text-strong-950 dark:text-text-white-0">
  ...
</div>
```

✅

```tsx
<div className="bg-bg-white-0 text-text-strong-950">{/* auto-flippea en dark */}</div>
```

**Por qué:** los tokens semánticos ya flippean automáticamente. La excepción única documentada (R6) es el hover translúcido sobre el frame del shell — para eso, dos clases asimétricas; para todo lo demás, un solo token.

---

### AP5 — Surface tokens distintos a `bg-weak-25` + `bg-white-0` para el shell [viola R3]

❌

```tsx
<div className="bg-bg-strong-950 p-6">                {/* token invertido — fondo negro en light */}
  <div className="bg-bg-soft-200 rounded-xl">         {/* ni frame ni card */}
    ...
```

✅

```tsx
<div className="bg-bg-weak-25 p-6">                                  {/* frame */}
  <div className="bg-bg-white-0 rounded-2xl ring-1 ring-stroke-soft-200">  {/* card */}
    ...
```

**Por qué:** el shell del producto BIA usa exactamente dos tokens, anidados. Los demás tokens de surface son para casos puntuales (`bg-weak-50` para inputs/code blocks dentro del card; los invertidos para snackbars dark-on-light o paneles inversos).

---

### AP6 — Error sin Hint, con `<p className="text-red-500">` flotante [viola R9]

❌

```tsx
<Input.Root>
  <Input.Wrapper>
    <Input.Input value={email} />
  </Input.Wrapper>
</Input.Root>;
{
  error && <p className="mt-1 text-sm text-red-500">Email inválido</p>;
}
```

✅

```tsx
<Input.Root hasError={!!error}>
  <Input.Wrapper>
    <Input.Input value={email} />
  </Input.Wrapper>
</Input.Root>;
{
  error && (
    <Hint.Root hasError>
      <Hint.Icon as={RiErrorWarningFill} />
      {error}
    </Hint.Root>
  );
}
```

**Por qué:** el par canónico es `hasError` en el control + `Hint.Root hasError` debajo. Mensajes flotantes rompen la afordancia que el usuario aprende.

---

### AP7 — Destructuring del namespace [viola R8]

❌

```tsx
const { Root, Icon } = Button;
return (
  <Root>
    <Icon as={RiAddLine} />
    Click me
  </Root>
);
```

✅

```tsx
return (
  <Button.Root>
    <Button.Icon as={RiAddLine} />
    Click me
  </Button.Root>
);
```

**Por qué:** el dot-access mantiene la safety del client reference cuando el componente se usa desde Server Component. Destructurar puede romper en algunos bundlers, además de que dot-access deja explícito de qué namespace viene cada pieza.

---

### AP8 — `Button.Root mode="filled"` para acción primaria [viola R7]

❌

```tsx
<Button.Root mode="filled" variant="basic">
  Guardar
</Button.Root>
```

✅

```tsx
<FancyButton.Root>Guardar</FancyButton.Root>
```

**Por qué:** `mode="filled"` en Button compite visualmente con FancyButton. Si necesitas un botón pesado, ese rol lo cumple FancyButton — no inflar el secondary.

---

### AP9 — `Tag` como filtro toggleable [viola R7 + filosofía Tag]

❌

```tsx
<Tag.Root data-state={active ? 'on' : 'off'} onClick={() => toggle()}>
  Hoy
</Tag.Root>
```

✅

```tsx
<Button.Root
  variant="basic"
  size="small"
  data-state={active ? 'on' : 'off'}
  onClick={() => toggle()}
>
  Hoy
</Button.Root>
```

**Por qué:** Tag es etiqueta descriptiva no interactiva. Filtros toggleable son una variante deliberada de `Button basic` con `size="small"` y estado seleccionado replicando el visual del hover (ver §7 P8).

---

### AP10 — Toast para error grave [viola filosofía Toast]

❌

```tsx
toast.custom(t => (
  <AlertToast.Root t={t} status="error" message="Error: no se pudo procesar el pago" />
));
```

✅

```tsx
{
  /* Error inline persistente, dentro del form */
}
<Alert.Root status="error">
  <Alert.Icon as={RiErrorWarningFill} />
  No pudimos procesar el pago. Verifica los datos de tu tarjeta.
</Alert.Root>;

{
  /* O un Modal bloqueante si la decisión es necesaria antes de seguir */
}
```

**Por qué:** un toast fugaz puede pasarse por alto. Un mensaje crítico que se pierde es peor que ninguno. Errores graves van inline (`Alert`) o bloqueantes (`Modal`), nunca en Toast.

---

### AP11 — Múltiples `LoaderBrand` simultáneos [viola filosofía Loaders]

❌

```tsx
<div>
  <LoaderBrand.Pill />
  <div>
    <LoaderBrand.Pill /> {/* 💥 dos en pantalla */}
  </div>
</div>
```

✅

```tsx
{
  /* Uno solo: para page-mount de toda la pantalla, va el outer */
}
<LoaderBrand.Pill />;

{
  /* Para datos puntuales en regiones específicas, usa Skeleton */
}
<Skeleton.Root className="h-4 w-32" />;
```

**Por qué:** una sola instancia de LoaderBrand en pantalla a la vez (regla del foundations/loaders). Para regiones específicas, Skeleton.

---

### AP12 — `<Button.Root variant="primary">` y `<FancyButton.Root variant="primary">` confundidos [viola R7]

❌

```tsx
<FancyButton.Root variant="primary">Guardar</FancyButton.Root>  {/* variant explícito redundante */}
<Button.Root variant="primary">Configurar</Button.Root>          {/* variant inválido en Button */}
```

✅

```tsx
<FancyButton.Root>Guardar</FancyButton.Root>           {/* el default ya es primary */}
<Button.Root variant="basic">Configurar</Button.Root>  {/* secondary correcto */}
```

**Por qué:** `FancyButton.Root` por default ya es primary — escribirlo es ruido. `Button.Root variant="primary"` no es parte del lenguaje BIA.

---

## §9 · Resolución de ambigüedades

Los 5 casos donde un agente, sin guía explícita, se equivoca silenciosamente. Cada uno: situación → camino incorrecto → camino correcto → razón.

### Q1 — "Necesito un botón principal"

- **Situación:** El usuario pide "un botón para confirmar el pedido", "el botón de submit del form", "el CTA de la página".
- **Camino incorrecto:** `<Button.Root variant="primary">Confirmar</Button.Root>` — porque "primary" suena correcto y `Button` es lo primero que importas.
- **Camino correcto:** `<FancyButton.Root>Confirmar</FancyButton.Root>` (sin `variant`).
- **Razón:** En BIA hay **dos componentes de botón distintos** según jerarquía. `FancyButton` = primary (gradient, shine, dark filled — la acción protagonista). `Button` = secondary (cancelar, edición, filtros). `Button.Root variant="primary"` existe en código por compatibilidad histórica pero no es parte del lenguaje BIA. Cita `R7`.

### Q2 — "Necesito hacer hover translúcido sobre el frame del shell"

- **Situación:** Estás construyendo el shell del producto (rail, top bar, sidebar de iconos) y un icon button necesita un hover sutil sobre el frame.
- **Camino incorrecto:** `hover:bg-bg-weak-50` — un solo token, parece consistente con la regla de "auto-flip dark".
- **Camino correcto:** `hover:bg-neutral-200/70 dark:hover:bg-bg-white-0/60` (la **única** excepción `dark:` documentada en el DS).
- **Razón:** El producto BIA tiene una **asimetría intencional** entre light y dark: en light el hover **aclara** (overlay gris claro sobre el frame), en dark el hover **oscurece** (overlay del color del card sobre el frame). Esto solo funciona con dos clases distintas. Aplica únicamente a hovers translúcidos sobre el frame del shell — para hovers sobre cards o sobre fondos `bg-white-0`, vuelve la regla normal de auto-flip. Cita `R6`.

### Q3 — "Necesito un acento de color"

- **Situación:** Una pantalla está demasiado neutral, quieres "un toque de color".
- **Camino incorrecto:** `bg-brand-base` o `bg-teal-500` para destacar un panel, una card de feature, un highlight visual. "El brand es teal, así que algo teal queda bien".
- **Camino correcto:** Verifica la **brand allowlist (R4)**. El `brand-*` aparece **únicamente** en: Checkbox/Radio/Switch checked, Slider track activo, ProgressBar/Circle, LinkButton primary, Chart serie 1. Si tu caso no entra ahí, la respuesta es **`primary-*`** (la escala gris/negra que hace todo el trabajo). Si necesitas llamar la atención sobre algo específico, considera un `Banner.Root status="feature"` (que sí usa teal, deliberadamente, para anuncios).
- **Razón:** El producto BIA es **minimal blanco/negro con teal como acento ocasional**. Si el teal aparece en muchos lugares, pierde la fuerza de "esto es marca". Que la pantalla se sienta "demasiado neutral" suele ser señal de jerarquía mal montada — falta un FancyButton, un Banner, un Status Badge, no un teal arbitrario.

### Q4 — "Necesito customizar el look de un componente"

- **Situación:** Un componente del DS no se ve exactamente como tú quieres (ej. el padding del Button es muy chico, los corners del Card no son los que esperas, el ring del Input necesita ser más fuerte).
- **Camino incorrecto:** Editas [`packages/ui/src/components/<name>/<name>.tsx`](packages/ui/src/components/) directamente, o crees un wrapper que reescribe las clases con `className=""` y un `cn()` complicado.
- **Camino correcto:** Cambia el **token** correspondiente en [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). El componente se actualiza automáticamente. Si el cambio es solo para tu app y no para el DS, **abre un issue en el repo del DS** antes de improvisar. Si el ajuste es muy específico (un Card con corners distintos), considera si es un caso legítimo o si estás luchando contra el sistema.
- **Razón:** Componentes inmutables tras integración es un tenet del proyecto (ver `CLAUDE.md`, "Componentes inmutables tras integración"). Modificar un componente desincroniza el archivo de su versión fuente y rompe el flujo `/update-component`. Los tokens son el escape hatch — fueron diseñados para absorber el branding sin tocar lógica. Cita `R1`.

### Q5 — "Estoy en un Server Component pasando un ícono como prop"

- **Situación:** Renderizas un Server Component que incluye `<Button.Icon as={Icon} />` o `<Input.Icon as={Icon} />` o cualquier slot que tome un componente como prop.
- **Camino incorrecto:** `import { RiArrowRightSLine } from '@remixicon/react'` — porque es el paquete original y "tiene los mismos íconos".
- **Camino correcto:** `import { RiArrowRightSLine } from '@biaenergy/ui/icons'`.
- **Razón:** El subpath `@biaenergy/ui/icons` envuelve los íconos como **client references** auto-generados (ver [`packages/ui/scripts/generate-icons.mjs`](packages/ui/scripts/generate-icons.mjs)). Importarlos directo de `@remixicon/react` funciona en Client Components pero **falla en Server Components** con: _"Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'"_. Cualquier callback/función pasada como prop **desde un Server Component** debe venir de un módulo `'use client'` — los íconos del subpath ya cumplen esto. Cita `R2` y `R11`.

---

## Apéndice — Cheatsheet (los 13 mandamientos en una pantalla)

```
R1   Componentes se usan tal como vienen. Cambios visuales → tokens.css.
R2   Iconos solo desde @biaenergy/ui/icons (RSC boundary).
R3   Shell = bg-weak-25 (frame) + bg-white-0 (card). Solo dos tokens.
R4   brand-* es acento. Allowlist: Checkbox/Radio/Switch/Slider/Progress/LinkButton/Chart-1.
R5   Cero paletas crudas en componentes. Solo tokens semánticos.
R6   No dark: sobre tokens. Excepción única: hover translúcido shell.
R7   Jerarquía: FancyButton primary, Button basic secondary, lighter/ghost tertiary.
R8   Namespace API via dot-access. No destructures.
R9   Errors = control hasError + Hint debajo. Nunca rojo flotante.
R10  Overlays en stacking context conflictivo → PortalContainerProvider.
R11  Server Components: callbacks/funciones desde módulos 'use client'.
R12  Storybook = playground. Docs MDX = oficial. design.md = reglas vinculantes.
R13  Iconos: Line por default. Fill solo en selección activa crítica.
```

> Cuando estés en duda, relee este cheatsheet. Cuando sigas en duda, lee la regla completa. Cuando aún sigas en duda, mira el componente en [Storybook](https://biaenergy.github.io/design-system/storybook/) o sigue el link `**docs:**` del componente.
