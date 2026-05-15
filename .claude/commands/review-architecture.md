---
description: Revisa el código modificado contra las reglas arquitectónicas del template. Reporta violaciones agrupadas por severidad.
---

# /review-architecture

Vas a revisar los cambios actuales (staged + unstaged) contra las reglas del template. Reporta violaciones agrupadas por severidad, con `archivo:línea` y propuesta de fix.

## Paso 1 — Identificar archivos a revisar

```bash
git diff --name-only HEAD
git diff --cached --name-only
```

Si no hay repo (`git init` no se ha hecho aún), pregunta al usuario qué archivos revisar o revisa todo `src/`.

Filtra a `*.ts` y `*.tsx` dentro de `src/`.

## Paso 2 — Revisar cada archivo contra estas reglas

### CRÍTICAS (bloquean merge)

1. **`any` explícito** — busca `: any`, `as any`, `<any>`. Excepción: tests con justificación.
2. **`console.log`** — busca `console.log(`. Permitido: `console.warn`, `console.error`.
3. **URLs hardcodeadas** — busca strings que matcheen `https?://` fuera de `endpoints.ts` y `.env`. Deben venir de `process.env` o `endpoints.ts`.
4. **Imports cross-module** — un módulo `modules/A/` no debe importar de `modules/B/internal/...`. Solo del barrel `@modules/B`. Comando:
   ```bash
   grep -r "from '@modules/[a-z-]*/[a-z]" src/modules/
   ```
5. **`response.json()` manual** — el patrón es `doFetch<T,R>` que retorna ya tipado. Si ves `await response.json()` después de `doFetch`, está mal usado.
6. **`axios`** — prohibido. Usa `doFetch`.
7. **Tests en español** — todos los `describe`/`it`/variables en inglés.
8. **`var`** o **`==`** — usar `const`/`let` y `===`.

### IMPORTANTES (se debe corregir)

9. **`'use client'` innecesario** — el archivo no tiene `useState`, `useEffect`, `onClick`, `onChange`, store, contexto cliente, ni recibe props con funciones del cliente. Quitar para que sea server component.
10. **Strings de UI hardcodeados** — texto visible al usuario que no viene del diccionario.
11. **`useEffect` para derivar estado** — si solo deriva de props/state, usar variable computada o `useMemo`.
12. **Cascadas async** — múltiples `await` consecutivos en server components que no son dependientes. Usar `Promise.all`.
13. **Selector Zustand sin función** — `useStore(state => state.user)` ✅, `const { user } = useStore()` ❌ (re-render por cualquier cambio).
14. **Imports no usados** o **variables no usadas** sin prefijo `_`.

### SUGERENCIAS (mejoras)

15. **Funciones inline en render** que dependen del componente — considerar `useCallback` si se pasa a hijos memoizados.
16. **`useState(valor)` con valor costoso** — usar `useState(() => valor)` para lazy init.
17. **Componentes pesados sin `dynamic`** — chart libs, editores, modales pesados — considerar `next/dynamic`.

## Paso 3 — Revisar estructura de módulos modificados

Para cada módulo en `src/modules/{nombre}/`:

- ¿Tiene `index.ts` exportando lo público?
- ¿Los `data/{action}.ts` exportan tanto la función plana como el hook `use{Action}`?
- ¿Los strings de UI vienen del diccionario del módulo (`dictionaries/`)?
- ¿Las interfaces de dominio están en `models/`, los DTOs request/response en `types/`?

## Paso 4 — Reportar

Formato:

```
## Crítico (N issues)
- src/file.ts:42 — `: any` en parámetro `data`. Tipar como `User` o usar `unknown`.
- ...

## Importante (N issues)
- src/components/X.tsx:1 — `'use client'` sin uso de hooks/eventos. Remover para que sea server component.
- ...

## Sugerencia (N issues)
- ...

## Resumen
- Críticos: N
- Importantes: N
- Sugerencias: N
- Veredicto: APROBADO / DEBE CORREGIR / BLOQUEADO
```

Si **Críticos = 0**, sugiere que está listo para commit. Si **Importantes > 0**, sugiere corregir antes de PR. Si **Críticos > 0**, bloqueado.

## Anti-patterns a evitar al revisar

- **No** propongas fixes que no entiendes — si dudas, marca el item como "verificar manualmente".
- **No** ejecutes los fixes automáticamente — solo reporta. El usuario decide.
- **No** revises archivos generados (`.next/`, `coverage/`, `node_modules/`).
