---
description: Create a Zustand store inside a module's store/ folder, following BIA conventions (skipHydration, partialize, individual selectors).
---

# /add-store

You are going to create a Zustand store for an existing module.

## Step 1 — Gather requirements

If the user didn't include arguments, ask via `AskUserQuestion`:

1. **Module name** (kebab-case, e.g. `operations/cgm-report`, `auth`).
2. **What UI state does the store manage?** (brief description — e.g. "selected filters, open modal, active tab"). This determines the initial state shape.
3. **Persist to localStorage?** Default: no. Only yes if state must survive page refresh.

If the user passed arguments in `$ARGUMENTS`, parse module name from them and ask only what's missing.

## Step 2 — Pre-checks

1. Verify the module exists at `src/modules/{module}/`.
2. Verify no store already exists at `src/modules/{module}/store/`. If it does, ask if the user wants to extend it instead.
3. Confirm `store/` is not already in the module barrel — if it is, remind the user to add selectors there.

## Step 3 — Generate the store file

### `src/modules/{module}/store/{module}.store.ts`

#### Without persistence (default)

```ts
'use client';

import { create } from 'zustand';

interface {Module}State {
  // TODO: define state fields based on requirements
  reset: () => void;
}

const initialState = {
  // TODO: initial values
};

export const use{Module}Store = create<{Module}State>()(set => ({
  ...initialState,
  reset: () => set(initialState)
}));

// Selectors — one function per piece of state
// export const select{Field} = (s: {Module}State) => s.{field};
```

#### With localStorage persistence

```ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface {Module}State {
  // TODO: define state fields
  reset: () => void;
}

const initialState = {
  // TODO: initial values
};

export const use{Module}Store = create<{Module}State>()(
  persist(
    set => ({
      ...initialState,
      reset: () => set(initialState)
    }),
    {
      name: '{module}-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // TODO: pick only the fields that MUST be persisted
      }),
      skipHydration: true
    }
  )
);
```

## Step 4 — Update barrel

Add to `src/modules/{module}/index.ts`:

```ts
export { use{Module}Store } from './store/{module}.store';
// export { select{Field} } from './store/{module}.store';
```

## Step 5 — Validate and report

1. Run `npm run type-check`.
2. Report:
   - Store file created.
   - Barrel updated.
   - Remind the user to:
     - Call `use{Module}Store.persist.rehydrate()` on mount (if persisted).
     - Use individual selectors to avoid unnecessary re-renders.
     - Never put server state (API data) in the store — use React Query for that.

## Anti-patterns to avoid

- **Never** mix server state and UI state in the same store.
- **Never** use `partialize: state => state` (persists everything — expensive and fragile).
- **Never** create inline selectors inside components — define them as standalone functions.
- **Never** put the store in `data/` or `hooks/` — it lives in `store/`.

## Arguments

$ARGUMENTS
