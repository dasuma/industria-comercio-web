---
description: Scaffold a component inside a module's components/ folder, following BIA conventions (one component per folder, co-located test, Server Component by default).
---

# /add-component

You are going to create a new component inside an existing module.

## Step 1 — Gather requirements

If the user didn't include arguments, ask via `AskUserQuestion`:

1. **Module name** (e.g. `operations/cgm-report`, `auth`).
2. **Component name** (PascalCase, e.g. `ReportCard`, `UserAvatar`).
3. **Client or Server Component?** Server by default — ask only if the intent is unclear. Mark as client if it needs state, effects, or event handlers.
4. **Create test file?** (co-located `ComponentName.test.tsx`). Default: yes.

If the user passed arguments in `$ARGUMENTS`, use them as module + component name and ask only what's missing.

## Step 2 — Pre-checks

1. Verify the module exists at `src/modules/{module}/`.
2. Verify no component with that name exists at `src/modules/{module}/components/{ComponentName}/`.

## Step 3 — Generate files

### `src/modules/{module}/components/{ComponentName}/index.tsx`

#### Server Component (default)

```tsx
import type { Locale } from '@/i18n/config';

interface {ComponentName}Props {
  locale: Locale;
}

export const {ComponentName} = ({ locale }: {ComponentName}Props) => {
  return (
    <div>
      {/* TODO: implement */}
    </div>
  );
};
```

#### Client Component (if requested)

```tsx
'use client';

interface {ComponentName}Props {
  // TODO: define props
}

export const {ComponentName} = ({}: {ComponentName}Props) => {
  return (
    <div>
      {/* TODO: implement */}
    </div>
  );
};
```

### `src/modules/{module}/components/{ComponentName}/{ComponentName}.test.tsx` (if test requested)

```tsx
import { render, screen } from '@testing-library/react';
import { {ComponentName} } from '.';

jest.mock('@biaenergy/ui', () => ({
  // mock UI components used
}));

describe('{ComponentName}', () => {
  it('renders correctly', () => {
    render(<{ComponentName} locale="es" />);
    // TODO: add assertions
  });
});
```

## Step 4 — Update barrel

Add the export to `src/modules/{module}/index.ts`:

```ts
export { {ComponentName} } from './components/{ComponentName}';
```

## Step 5 — Validate and report

1. Run `npm run type-check`.
2. Report:
   - Files created.
   - Export added to barrel.
   - Next steps: fill in the component logic, props, and dictionary strings.

## Anti-patterns to avoid

- **Never** add `'use client'` by default. Only if the component truly needs it.
- **Never** hardcode UI strings — use the module dictionary passed as prop or via `getDictionary`.
- **Never** import from another module's internals — only from barrels.
- **Never** put business logic in the component — extract to hooks or utils.

## Arguments

$ARGUMENTS
