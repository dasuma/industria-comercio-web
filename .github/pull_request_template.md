## Resumen

<!-- 1-3 bullets describiendo el _why_ del cambio. El diff muestra el _what_. -->

-

## Tipo de cambio

- [ ] feat (nueva funcionalidad)
- [ ] fix (bug)
- [ ] refactor (sin cambios de comportamiento)
- [ ] perf
- [ ] docs
- [ ] chore / build / ci
- [ ] test

## Checklist

### Calidad

- [ ] `npm run type-check` pasa
- [ ] `npm run lint` pasa
- [ ] `npm test` pasa
- [ ] `npm run build` pasa

### Arquitectura (ver [CLAUDE.md](../CLAUDE.md))

- [ ] **Boundaries**: ningún import cross-module por path interno (`@modules/X/components/Y`); solo barrel.
- [ ] **Layers**: `data/` no importa `components/` ni `hooks/`; `models/`/`dictionaries/` son hojas.
- [ ] **Server-first**: usé `'use client'` solo donde hay estado/efectos/handlers.
- [ ] **Sin `any`**, sin `console.log` (solo `warn`/`error`), sin `==`.
- [ ] **HTTP**: usé `doFetch` (no `axios`, no `fetch` directo en componentes).
- [ ] **QueryKeys**: registré toda key nueva en `src/data/core/QueryKeys.ts`.
- [ ] **Endpoints**: declarados en `data/endpoints.ts` del módulo, no URLs en componentes.

### UI / DS / i18n

- [ ] Sin strings de UI hardcodeados — todo viene del diccionario del módulo.
- [ ] Tokens del DS (`text-text-strong-950`, etc.), no colores hardcodeados.
- [ ] Componentes nuevos: `cn()` para clases, props tipadas con `interface`.
- [ ] Inputs accesibles: `<Label>` o `aria-label`, alt text en imágenes.

### Estado

- [ ] Server state en React Query, UI state en Zustand. Sin mezclar.
- [ ] Zustand: `skipHydration: true` + `partialize` + selectores como funciones individuales.
- [ ] Forms con React Hook Form + Zod resolver.

### Tests

- [ ] Tests en inglés, co-localizados (`Component.test.tsx`).
- [ ] Si toqué algo crítico, agregué/actualicé tests.

### Performance

- [ ] Sin cascadas async: `Promise.all` para fetches no dependientes.
- [ ] `next/dynamic` para componentes pesados si aplica.

## Notas para el reviewer

<!-- Decisiones que tomé y _por qué_, riesgos, alternativas que descarté, etc. -->
