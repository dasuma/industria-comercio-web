---
name: bia-i18n-pattern
description: Cómo funciona el i18n del template (sin /[lang] en URL, locale por cookie, dictionaries globales y por módulo). Usa este skill cuando vayas a renderizar texto, agregar idioma, o usar getDictionary.
---

# i18n

Locale activo se guarda en la cookie `NEXT_LOCALE`, **no aparece en la URL**. El proxy lo detecta una vez y lo persiste.

## Configuración base

`src/i18n/config.ts`:

```ts
export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';
```

`src/i18n/getDictionary.ts` provee:

- `getActiveLocale()` — devuelve el locale activo (lee cookie → Accept-Language → default).
- `getDictionary(locale?)` — devuelve el diccionario global (lee `dictionaries/{locale}.json`).

## Dictionaries globales

`src/i18n/dictionaries/{es,en}.json`. Estructura libre por sección. Ejemplo:

```json
{
  "common": { "loading": "Cargando..." },
  "home": { "title": "Bienvenido a BIA" }
}
```

## Dictionaries por módulo

Cada módulo trae su propio diccionario en `src/modules/{name}/dictionaries/`:

```ts
// es.ts
export const sitesDictEs = {
  title: 'Mis sedes',
  empty: 'No tienes sedes registradas'
};
export type SitesDictionary = typeof sitesDictEs;

// en.ts
import type { SitesDictionary } from './es';
export const sitesDictEn: SitesDictionary = {
  title: 'My sites',
  empty: 'You have no sites registered'
};

// index.ts
import type { Locale } from '@/i18n/config';
import { sitesDictEs, type SitesDictionary } from './es';
import { sitesDictEn } from './en';

const dicts: Record<Locale, SitesDictionary> = { es: sitesDictEs, en: sitesDictEn };
export const getSitesDict = (locale: Locale): SitesDictionary => dicts[locale] ?? dicts.es;
```

**Patrón**: `es.ts` define el tipo (con `typeof`), `en.ts` implementa el tipo (typeguard automático), `index.ts` mapea locale → dict.

## Uso en server components

```tsx
import { getDictionary, getActiveLocale } from '@/i18n/getDictionary';
import { getSitesDict } from '@modules/sites/dictionaries';

const SitesPage = async () => {
  const locale = await getActiveLocale();
  const dict = await getDictionary(locale);
  const sitesDict = getSitesDict(locale);

  return (
    <section>
      <h1>{sitesDict.title}</h1>
      <p>{dict.common.loading}</p>
    </section>
  );
};
```

## Uso en client components

Pasa el `locale` como prop desde el server component padre:

```tsx
// page.tsx (server)
const locale = await getActiveLocale();
return <ClientPart locale={locale} />;

// ClientPart.tsx (client)
('use client');
import { getSitesDict } from '@modules/sites/dictionaries';
const ClientPart = ({ locale }: { locale: Locale }) => {
  const dict = getSitesDict(locale);
  // ...
};
```

**Por qué prop y no cookie**: client components no pueden leer cookies sync; pasar como prop es server-rendered y zero-cost.

## Backend recibe el locale automáticamente

`doFetch` inyecta `Accept-Language: <locale>` en cada request. El backend puede usarlo para devolver mensajes localizados (errores, notificaciones).

## Agregar un idioma nuevo

1. Sumar el código a `locales` en `src/i18n/config.ts`:
   ```ts
   export const locales = ['es', 'en', 'pt'] as const;
   ```
2. Crear `src/i18n/dictionaries/pt.json` con la misma forma que `es.json`.
3. Crear `src/modules/{name}/dictionaries/pt.ts` para cada módulo:
   ```ts
   import type { SitesDictionary } from './es';
   export const sitesDictPt: SitesDictionary = {
     /* ... */
   };
   ```
4. Actualizar el `Record<Locale, ...>` en cada `dictionaries/index.ts` del módulo.

El TS te avisa de cada lugar que falta cuando el tipo `Locale` cambia.

## Anti-patterns

| ❌                                                     | ✅                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `<h1>Mis sedes</h1>` (hardcoded)                       | `<h1>{dict.title}</h1>`                                      |
| `if (lang === 'es') return 'Hola'`                     | Diccionario por locale                                       |
| Leer la cookie `NEXT_LOCALE` con `js-cookie` en server | `await getActiveLocale()`                                    |
| Pasar el dict completo como prop a hijos               | Pasar solo `locale` y que el hijo invoque `getXDict(locale)` |
| Detectar locale en runtime via `navigator.language`    | Ya lo hace el proxy una vez                                  |

## Cuándo i18n vuelve a la URL

Si el negocio decide URLs como `/es/...` y `/en/...`, el plan es:

1. Añadir segmento `[lang]` en `src/app/`.
2. Volver a la lógica del proxy con `PROTECTED_PATTERN` que valida locale.
3. La capa de `getDictionary` no cambia.

Pero **por defecto, no está en URL**.
