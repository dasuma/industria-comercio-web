---
description: Create a custom hook inside a module's hooks/ folder, following BIA conventions. Hooks may use data layer (queries/mutations) and store, but must not contain UI logic.
---

# /add-hook

You are going to create a custom hook for an existing module.

## Step 1 — Gather requirements

If the user didn't include arguments, ask via `AskUserQuestion`:

1. **Module name** (e.g. `operations/cgm-report`, `auth`).
2. **Hook name** (camelCase starting with `use`, e.g. `useReportFilters`, `useSelectedSite`).
3. **What does the hook do?** (brief — e.g. "manages URL search params for filters", "combines query + store for derived state").

If the user passed arguments in `$ARGUMENTS`, parse module + hook name from them and ask only what's missing.

## Step 2 — Pre-checks

1. Verify the module exists at `{ruta-del-modulo}/`.
2. Check `{ruta-del-modulo}/hooks/` exists — create it if not.
3. Verify no hook with that name already exists.

## Step 3 — Generate the hook file

### `{ruta-del-modulo}/hooks/{hookName}.ts`

#### URL search params hook (common pattern)

```ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const {
  hookName
} = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return {
    // TODO: expose typed param accessors and setParam
    setParam
  };
};
```

#### Data + store composition hook

```ts
import { use{Module}Store } from '../store/{module}.store';
import { useGet{Resource} } from '../data';

export const {hookName} = () => {
  const { data, isLoading, error } = useGet{Resource}();
  const selectedId = use{Module}Store(s => s.selectedId);

  const selected = data?.find(item => item.id === selectedId) ?? null;

  return { data, isLoading, error, selected };
};
```

#### Generic hook template

```ts
export const {
  hookName
} = () => {
  // TODO: implement hook logic

  return {
    // TODO: expose values and handlers
  };
};
```

## Step 4 — Generate the co-located test (if the hook has logic)

If the hook contains logic worth testing (derived state, conditional branches, side effects), create `{ruta-del-modulo}/hooks/{hookName}.test.tsx`.

**Skip the test only if** the hook is a trivial pass-through (e.g. just a `useQuery({ queryFn })` with no logic) — in that case the underlying data layer test already covers it.

**Template** (hook with React Query):

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { {hookName} } from './{hookName}';

// Mock external dependencies (data, store, navigation) — never the hook itself.
jest.mock('../data', () => ({
  useGet{Resource}: jest.fn()
}));

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestQueryClientWrapper';
  return Wrapper;
};

describe('{hookName}', () => {
  it('returns expected values when {condition}', async () => {
    // TODO: setup mocks, call hook, assert returned shape
    const { result } = renderHook(() => {hookName}(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current).toBeDefined());
    // expect(result.current.selected).toBe(...);
  });

  // TODO: one test per logical branch
});
```

**Template** (pure hook, no React Query): omit the `QueryClientProvider` wrapper.

If it's the **first hook with tests** in the modules tree, add the threshold entry to [jest.config.js](../../jest.config.js):

```js
'./{ruta-del-modulo}/hooks/': {
  statements: 70,
  branches: 60,
  functions: 70,
  lines: 70
}
```

## Step 5 — Update barrel

Add to `{ruta-del-modulo}/index.ts`:

```ts
export { {hookName} } from './hooks/{hookName}';
```

## Step 6 — Validate and report

1. Run `npm run type-check`.
2. If you generated a test, run `npm run test:ci` to confirm it passes and coverage threshold is met.
3. Report:
   - Hook file created.
   - Test file created (or skipped — explain why).
   - Barrel updated.
   - Remind the user: hooks that use `useSearchParams` must be inside a Client Component (wrap the consumer with `'use client'`, not the hook itself).

## Anti-patterns to avoid

- **Never** put `'use client'` in the hook file itself — that's the consumer's responsibility.
- **Never** derive state inside `useEffect` — use `useMemo` or computed variables.
- **Never** import from `components/` inside a hook — hooks live below components in the layer hierarchy.
- **Never** duplicate logic that belongs in `data/` (API calls) — call the data hook instead.

## Arguments

$ARGUMENTS
