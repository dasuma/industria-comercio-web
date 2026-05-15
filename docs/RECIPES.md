# Recetas

Tutoriales paso-a-paso para tareas comunes. Para arquitectura ver [ARCHITECTURE.md](./ARCHITECTURE.md). Para reglas ver [CONVENTIONS.md](./CONVENTIONS.md).

> **Tip**: muchas de estas recetas tienen un slash command equivalente (`/add-module`, `/add-endpoint`, `/add-page`, `/add-workspace`). Las que sí, lo indican.

> **Referencia canónica funcionando**: el módulo [`src/modules/example/`](../src/modules/example/) y la página [`/examples`](<../src/app/(app)/examples/page.tsx>) muestran el patrón completo en código real (data layer + form + i18n + estados de UI). Cuando arranquen los módulos reales se puede borrar.

## Tabla de contenidos

1. [Crear un módulo nuevo](#crear-un-módulo-nuevo)
2. [Agregar un endpoint](#agregar-un-endpoint-query)
3. [Agregar una página](#agregar-una-página)
4. [Agregar un workspace al sidebar](#agregar-un-workspace-al-sidebar)
5. [Registrar una page existente en el sidebar](#registrar-una-page-existente-en-el-sidebar)
6. [Agregar un idioma](#agregar-un-idioma)
7. [Crear un Zustand store](#crear-un-zustand-store)
8. [Escribir un test](#escribir-un-test)
9. [Agregar una variable de entorno](#agregar-una-variable-de-entorno)
10. [Cachear un fetch en server con revalidación](#cachear-un-fetch-en-server-con-revalidación)
11. [Invalidar queries tras una mutation](#invalidar-queries-tras-una-mutation)
12. [Crear un formulario (RHF + Zod + DS)](#crear-un-formulario-rhf--zod--ds)
13. [Mostrar un toast](#mostrar-un-toast)
14. [Estados de UI (loading / empty / error)](#estados-de-ui-loading--empty--error)

---

## Crear un módulo nuevo

> **Comando**: `/add-module {nombre}`

### Manual

1. Crea la carpeta:
   ```bash
   mkdir -p src/modules/sites/{components,data,dictionaries,hooks,models,utils}
   ```
2. Dictionaries — `src/modules/sites/dictionaries/es.ts`:
   ```ts
   export const sitesDictEs = { title: 'Mis sedes' };
   export type SitesDictionary = typeof sitesDictEs;
   ```
   Y `en.ts`, `index.ts` (ver [skill `bia-i18n-pattern`](../.claude/skills/bia-i18n-pattern/SKILL.md)).
3. Modelo — `src/modules/sites/models/site.interface.ts`:
   ```ts
   export interface Site {
     id: string;
     name: string;
   }
   ```
4. Endpoints — `src/modules/sites/data/endpoints.ts`:
   ```ts
   import type { IHttpClient } from '@/http_client';
   const isMocked = false;
   export const endpointsSites: Record<string, IHttpClient> = {};
   ```
5. Barrel — `src/modules/sites/index.ts`:
   ```ts
   export type { Site } from './models/site.interface';
   export { getSitesDict } from './dictionaries';
   ```

---

## Agregar un endpoint (Query)

> **Comando**: `/add-endpoint {modulo} {accion}`

### Manual

1. Registra el endpoint en `src/modules/sites/data/endpoints.ts`:
   ```ts
   list: {
     url: '/ems-api/sites',
     method: 'GET',
     requiresAuthorization: true,
     isMocked: false,
     urlMock: ''
   }
   ```
2. Suma el QueryKey en `src/data/core/QueryKeys.ts`:
   ```ts
   SITES_LIST = 'sites.list';
   ```
3. Crea el archivo `src/modules/sites/data/list/getSites.ts`:

   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { doFetch } from '@/http_client';
   import QueryKeys from '@data/core/QueryKeys';
   import { endpointsSites } from '../endpoints';
   import type { Site } from '../../models/site.interface';

   const getSites = () => doFetch<void, Site[]>({ endpoint: endpointsSites.list });

   export const useGetSites = () =>
     useQuery({ queryKey: [QueryKeys.SITES_LIST], queryFn: getSites });
   ```

4. Exporta desde `src/modules/sites/data/index.ts`:
   ```ts
   export { useGetSites } from './list/getSites';
   ```
5. Usa en componente:
   ```tsx
   'use client';
   import { useGetSites } from '@modules/sites/data';
   const Sites = () => {
     const { data, isPending } = useGetSites();
     if (isPending) return <p>Loading...</p>;
     return (
       <ul>
         {data?.map(s => (
           <li key={s.id}>{s.name}</li>
         ))}
       </ul>
     );
   };
   ```

### Mutation

Idéntico pero con `useMutation`:

```ts
const createSite = (params: CreateSiteRequest) =>
  doFetch<CreateSiteRequest, Site>({ endpoint: endpointsSites.create, params });

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.SITES_LIST] })
  });
};
```

---

## Agregar una página

> **Comando**: `/add-page` (interactivo). Pregunta pública/protegida y, si es protegida, si la registrás en el sidebar.

Una page protegida puede aparecer o no en el sidebar. Si aparece, su URL queda forzada a `/{workspaceId}/{itemKey}` para mantener la jerarquía visual del menu, y se actualizan 4 archivos: `APP_ROUTES`, `NavItemKey`, los dictionaries del shell y `workspaces.config.ts`.

### Pública (no requiere auth)

`src/app/(public)/about/page.tsx`:

```tsx
import { getDictionary } from '@/i18n/getDictionary';

const AboutPage = async () => {
  const dict = await getDictionary();
  return <h1>{dict.about.title}</h1>;
};
export default AboutPage;
```

URL: `/about`. El proxy ya considera `/` como público (`PUBLIC_ROUTES.login`); cualquier otra ruta sin sesión redirige al login. **Si quieres que `/about` sea pública sin sesión**, edita `PUBLIC_PATHS` en [`src/proxy.ts`](../src/proxy.ts).

### Protegida sin sidebar

`src/app/(app)/billing/invoice/[id]/page.tsx`:

```tsx
interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

const InvoicePage = async ({ params }: InvoicePageProps) => {
  const { id } = await params;
  return <h1>Invoice {id}</h1>;
};
export default InvoicePage;
```

URL: `/billing/invoice/123`. Sin sesión → redirige a `/`. **No** se registra en el sidebar — typical para detail pages, modals, sub-flows.

> **Nota Next 16**: `params` es `Promise<>`, hay que `await`.

### Protegida y registrada en el sidebar

Ejemplo: agregar una page "Reportes" bajo el workspace `Operaciones` (ya existe).

**1. La page** — `src/app/(app)/operaciones/reportes/page.tsx`:

```tsx
import { getActiveLocale } from '@/i18n/getDictionary';
import { getShellDict } from '@modules/shell';

const ReportesPage = async () => {
  const locale = await getActiveLocale();
  const dict = getShellDict(locale);
  return (
    <section className="space-y-2">
      <h1 className="text-title-h5 text-text-strong-950">{dict.items.reportes}</h1>
      <p className="text-paragraph-sm text-text-sub-600">
        {dict.workspaces.operaciones} · {dict.items.reportes}
      </p>
    </section>
  );
};
export default ReportesPage;
```

**2. La ruta canónica** — agregar a [`src/config/routes.ts`](../src/config/routes.ts):

```ts
export const APP_ROUTES = {
  cgm: '/operaciones/cgm',
  bianetwork: '/growth/bianetwork',
  reportes: '/operaciones/reportes' // ← nuevo
} as const;
```

**3. La unión `NavItemKey`** — extender [`src/modules/shell/models/nav.types.ts`](../src/modules/shell/models/nav.types.ts):

```ts
export type NavItemKey = 'cgm' | 'bianetwork' | 'reportes';
```

**4. Los dictionaries** — agregar a `items` en [`src/modules/shell/dictionaries/es.ts`](../src/modules/shell/dictionaries/es.ts) y `en.ts`. El `satisfies Record<NavItemKey, string>` rompe TS si te falta uno:

```ts
items: {
  cgm: 'CGM',
  bianetwork: 'Bianetwork',
  reportes: 'Reportes'
} satisfies Record<NavItemKey, string>,
```

**5. El item del workspace** — agregar a [`src/modules/shell/models/workspaces.config.ts`](../src/modules/shell/models/workspaces.config.ts):

```ts
import { RiBarChartLine /* ... */ } from '@biaenergy/ui/icons';

export const workspaces: Workspace[] = [
  {
    id: 'operaciones',
    iconFill: RiToolsFill,
    iconLine: RiToolsLine,
    items: [
      { kind: 'item', key: 'cgm', href: APP_ROUTES.cgm, icon: RiPulseLine },
      { kind: 'item', key: 'reportes', href: APP_ROUTES.reportes, icon: RiBarChartLine } // ← nuevo
    ]
  }
  // ...
];
```

**6. Validar** — `npm run type-check`. Si falla, suele ser por una de estas causas: olvidaste el item en algún dictionary, la URL en `APP_ROUTES` no matchea con el path del page file, o la `NavItemKey` literal no aparece en algún lugar.

> **Constraint**: las pages registradas en el sidebar **no pueden tener params dinámicos** — el item necesita un `href` estático para resolver el active state.

### Items agrupados (accordion en el sidebar)

Cuando un workspace tiene varias pages relacionadas (ej. `Operarios > Activos / Equipos / Turnos`), el item se modela como `kind: 'group'`:

```ts
{
  kind: 'group',
  id: 'operarios',
  labelKey: 'operarios',
  icon: RiTeamLine,
  items: [
    { key: 'operariosActivos', href: '/operaciones/operarios/activos' },
    { key: 'operariosEquipos', href: '/operaciones/operarios/equipos' }
  ]
}
```

El group requiere agregar **cada** sub-item a `NavItemKey` y a los dictionaries — el `labelKey` del group también es una `NavItemKey`.

---

## Agregar un workspace al sidebar

> **Comando**: `/add-workspace` (interactivo, sugiere íconos por keyword).

Un workspace es una sección top-level del header dropdown (Operaciones, Growth, etc.). Cuando ningún workspace existente encaja con la page que querés agregar, primero corré este flujo y después `/add-page` para poblarlo.

Ejemplo: agregar workspace `Finanzas`.

**1. La unión `WorkspaceKey`** — extender [`src/modules/shell/models/nav.types.ts`](../src/modules/shell/models/nav.types.ts):

```ts
export type WorkspaceKey = 'operaciones' | 'growth' | 'finanzas';
```

**2. Los dictionaries** — agregar a `workspaces` en `es.ts` y `en.ts`:

```ts
workspaces: {
  operaciones: 'Operaciones',
  growth: 'Growth',
  finanzas: 'Finanzas' // 'Finance' en en.ts
} satisfies Record<WorkspaceKey, string>,
```

**3. El workspace** — agregar al array en [`src/modules/shell/models/workspaces.config.ts`](../src/modules/shell/models/workspaces.config.ts):

```ts
import { RiMoneyDollarCircleFill, RiMoneyDollarCircleLine /* ... */ } from '@biaenergy/ui/icons';

export const workspaces: Workspace[] = [
  // ...workspaces existentes
  {
    id: 'finanzas',
    iconFill: RiMoneyDollarCircleFill, // R13: Fill solo para el active state del trigger
    iconLine: RiMoneyDollarCircleLine, // line para los items del dropdown
    items: [] // arranca vacío — usar /add-page después
  }
];
```

**4. Validar** — `npm run type-check`. El workspace **no aparece** en el sidebar todavía — `findItemByHref` activa el workspace según la URL actual, así que sin items no hay nada que matchear. Cuando agregues el primer item con `/add-page`, queda visible.

---

## Registrar una page existente en el sidebar

Si tenés una page que ya existe en `src/app/(app)/.../` y querés que aparezca en el sidebar:

1. Si la URL **no** matchea el patrón `/{workspaceId}/{itemKey}` (porque ya estaba creada con otra estructura), tenés dos opciones:
   - **Mover la page** al patrón canónico (recomendado para mantener consistencia).
   - **Saltearse el constraint** del comando y editar manualmente `workspaces.config.ts` con el `href` real de la page. La nav igual funciona, pero perdés la pista visual de la jerarquía.
2. Si ya matchea, seguí los pasos 2-6 de la sección "[Protegida y registrada en el sidebar](#protegida-y-registrada-en-el-sidebar)" pero saltea el paso 1 (la page ya existe).

---

## Agregar un idioma

1. Suma a `src/i18n/config.ts`:
   ```ts
   export const locales = ['es', 'en', 'pt'] as const;
   ```
2. Crea `src/i18n/dictionaries/pt.json` (misma forma que `es.json`).
3. Para cada módulo, crea `dictionaries/pt.ts` implementando el tipo:
   ```ts
   import type { SitesDictionary } from './es';
   export const sitesDictPt: SitesDictionary = { title: 'Meus locais' };
   ```
4. Actualiza el `Record<Locale, ...>` en cada `dictionaries/index.ts`:
   ```ts
   const dicts: Record<Locale, SitesDictionary> = { es, en, pt };
   ```

TS te avisa de los lugares que faltan al cambiar el tipo `Locale`.

---

## Crear un Zustand store

`src/modules/sites/store/sites.store.ts`:

```ts
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SitesState {
  selectedSiteId: string | null;
  setSelectedSiteId: (id: string | null) => void;
}

export const useSitesStore = create<SitesState>()(
  persist(
    set => ({
      selectedSiteId: null,
      setSelectedSiteId: id => set({ selectedSiteId: id })
    }),
    {
      name: 'sites-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ selectedSiteId: state.selectedSiteId }),
      skipHydration: true
    }
  )
);

export const selectSelectedSiteId = (s: SitesState) => s.selectedSiteId;
```

Uso (con selector individual para evitar re-renders innecesarios):

```tsx
const id = useSitesStore(selectSelectedSiteId);
```

---

## Escribir un test

`src/modules/sites/components/SiteCard/SiteCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { SiteCard } from './index';

jest.mock('@biaenergy/ui', () => ({
  Button: {
    Root: ({ children, ...p }: any) => <button {...p}>{children}</button>,
    Icon: () => null
  }
}));

describe('SiteCard', () => {
  it('renders site name', () => {
    render(<SiteCard site={{ id: '1', name: 'Centro' }} />);
    expect(screen.getByText('Centro')).toBeInTheDocument();
  });

  it('handles click correctly', async () => {
    const onClick = jest.fn();
    render(<SiteCard site={{ id: '1', name: 'Centro' }} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('1');
  });
});
```

Correr solo este test: `npm test SiteCard`.

---

## Agregar una variable de entorno

Las env vars se validan con Zod al arranque en [`src/config/env.ts`](../src/config/env.ts). Si una var requerida falta, el build falla con un mensaje claro.

1. Súmala a `.env.local` (no se commitea) y a `.env.example` con valor vacío o de ejemplo.
2. Si es **pública** (cliente puede leerla), prefijo `NEXT_PUBLIC_`. Si es **secreta** (solo server), sin prefijo.
3. Agregala al schema en `src/config/env.ts`:

   ```ts
   const clientSchema = z.object({
     // ...
     NEXT_PUBLIC_NUEVA_VAR: z.string().min(1) // o .url(), .optional(), etc.
   });

   const parsed = clientSchema.safeParse({
     // ...
     NEXT_PUBLIC_NUEVA_VAR: process.env.NEXT_PUBLIC_NUEVA_VAR
   });
   ```

4. Usá `import { env } from '@/config/env'` en el código. **Nunca** `process.env.X` directo.
5. Documenta en el README qué hace y dónde se obtiene.

---

## Cachear un fetch en server con revalidación

```tsx
// src/app/(app)/sites/page.tsx
import { doFetch } from '@/http_client';
import { endpointsSites } from '@modules/sites/data/endpoints';
import type { Site } from '@modules/sites/models/site.interface';

const SitesPage = async () => {
  const sites = await doFetch<void, Site[]>({
    endpoint: endpointsSites.list,
    next: { revalidate: 60, tags: ['sites'] }
  });
  return (
    <ul>
      {sites.map(s => (
        <li key={s.id}>{s.name}</li>
      ))}
    </ul>
  );
};
export default SitesPage;
```

Para invalidar después de una mutation server-side: `revalidateTag('sites')`.

---

## Invalidar queries tras una mutation

En la mutation:

```ts
export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSite,
    onSuccess: newSite => {
      // Opcional: actualizar cache directamente sin refetch
      queryClient.setQueryData<Site[]>([QueryKeys.SITES_LIST], old =>
        old ? [...old, newSite] : [newSite]
      );
      // O simplemente invalidar para refetch
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SITES_LIST] });
    }
  });
};
```

`setQueryData` evita una request extra; `invalidateQueries` es más simple pero refetchea.

---

## Crear un formulario (RHF + Zod + DS)

### 1. Schema con Zod

`src/modules/sites/schemas/createSite.schema.ts`:

```ts
import { z } from 'zod';

export const createSiteSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(80),
  address: z.string().min(5, 'Dirección requerida'),
  email: z.string().email('Email inválido').optional()
});

export type CreateSiteValues = z.infer<typeof createSiteSchema>;
```

### 2. Componente con RHF + DS

`src/modules/sites/components/CreateSiteForm/index.tsx`:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Hint, toast } from '@biaenergy/ui';
import { RiMailLine } from '@biaenergy/ui/icons';
import { createSiteSchema, type CreateSiteValues } from '../../schemas/createSite.schema';
import { useCreateSite } from '../../data';

export const CreateSiteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateSiteValues>({
    resolver: zodResolver(createSiteSchema),
    defaultValues: { name: '', address: '', email: '' }
  });
  const createSite = useCreateSite();

  const onSubmit = handleSubmit(async values => {
    try {
      await createSite.mutateAsync(values);
      toast.success('Sede creada');
    } catch (err) {
      toast.error((err as Error).message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label.Root htmlFor="name">
          Nombre <Label.Asterisk />
        </Label.Root>
        <Input.Root hasError={!!errors.name}>
          <Input.Wrapper>
            <Input.Input id="name" placeholder="Sede principal" {...register('name')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.name && <Hint.Root hasError>{errors.name.message}</Hint.Root>}
      </div>

      <div>
        <Label.Root htmlFor="address">
          Dirección <Label.Asterisk />
        </Label.Root>
        <Input.Root hasError={!!errors.address}>
          <Input.Wrapper>
            <Input.Input id="address" {...register('address')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.address && <Hint.Root hasError>{errors.address.message}</Hint.Root>}
      </div>

      <div>
        <Label.Root htmlFor="email">
          Email <Label.Sub>(opcional)</Label.Sub>
        </Label.Root>
        <Input.Root hasError={!!errors.email}>
          <Input.Wrapper>
            <Input.Icon as={RiMailLine} />
            <Input.Input id="email" type="email" {...register('email')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.email && <Hint.Root hasError>{errors.email.message}</Hint.Root>}
      </div>

      <Button.Root
        variant="primary"
        mode="filled"
        size="medium"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : 'Crear sede'}
      </Button.Root>
    </form>
  );
};
```

### Reglas

- **Validación en cliente y servidor**: el mismo schema Zod se reusa para validar el response del backend si lo expone (defensivo).
- **`defaultValues` siempre**: evita inputs no controlados.
- **`zodResolver`**: convierte errores Zod a la forma que RHF espera.
- **Strings de UI**: en una app real vendrían del diccionario del módulo. Aquí están inline solo para el ejemplo.
- **`isSubmitting`** desactiva el botón mientras la mutation corre.

---

## Mostrar un toast

El `<Toaster />` ya está en `src/app/layout.tsx`. Solo importa `toast`:

```tsx
'use client';
import { toast } from '@biaenergy/ui';

const handleClick = () => {
  toast.success('Sede creada');
  // toast.error('No se pudo guardar');
  // toast.info('Procesando...');
  // toast.warning('Revisa los campos');
  // toast('Mensaje genérico', { description: 'Detalle adicional' });
};
```

`toast` es la API de [sonner](https://sonner.emilkowal.ski/). Soporta `success`, `error`, `info`, `warning`, `loading`, `promise`, custom JSX, etc.

---

## Estados de UI (loading / empty / error)

Toda lista o detalle remoto debe contemplar **cuatro estados**: loading, empty, error, success. Patrón canónico (ver [`ExampleList`](../src/modules/example/components/ExampleList/index.tsx) por la implementación real):

```tsx
'use client';
import { Button } from '@biaenergy/ui';
import { useGetSites } from '../../data';

export const SitesList = ({ locale }: { locale: Locale }) => {
  const dict = getSitesDict(locale);
  const { data, isLoading, isError, refetch } = useGetSites();

  // 1. Loading — skeleton con animate-pulse y aria-busy
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-bg-weak-50" />
        ))}
        <span className="sr-only">{dict.list.loading}</span>
      </div>
    );
  }

  // 2. Error — mensaje + retry, role="alert"
  if (isError) {
    return (
      <div role="alert" className="rounded-lg border border-stroke-soft-200 p-4">
        <p className="text-text-strong-950">{dict.list.errorLoading}</p>
        <Button.Root variant="neutral" mode="stroke" size="small" onClick={() => refetch()}>
          {dict.list.retry}
        </Button.Root>
      </div>
    );
  }

  // 3. Empty — mensaje suave, mismo container que el success
  if (!data || data.length === 0) {
    return (
      <p className="rounded-lg border border-stroke-soft-200 p-4 text-text-sub-600">
        {dict.list.empty}
      </p>
    );
  }

  // 4. Success
  return <ul>{data.map(site => /* ... */)}</ul>;
};
```

### Reglas

- **Mismo orden siempre**: loading → error → empty → success. Permite hacer code review rápido.
- **Strings del diccionario**, jamás hardcodeados.
- **Accesibilidad**: `aria-busy` + `aria-live` para loading; `role="alert"` para error.
- **Tokens del DS**: `bg-bg-weak-50`, `border-stroke-soft-200`, `text-text-strong-950`, `text-text-sub-600`, `text-error-base`.
- **Retry**: el error siempre tiene un botón de retry (llamando `refetch()` de React Query).
- **Skeleton**: usá `animate-pulse` + `bg-bg-weak-50` con la altura/forma aproximada del contenido real.
