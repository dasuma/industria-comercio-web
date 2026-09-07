import { z } from 'zod';

/**
 * Configuración leída del entorno EN RUNTIME (server-side).
 *
 * Ninguna variable lleva prefijo `NEXT_PUBLIC_` a propósito: Next.js inlinea
 * esas en el bundle durante `next build`, y eso obliga a construir una imagen
 * por ciudad. Sin el prefijo, la misma imagen Docker sirve para todas las
 * ciudades y cada App Service de Azure define sus valores como app settings,
 * igual que el backend.
 *
 * El browser NO lee `process.env`: recibe lo que necesita vía
 * `getPublicConfig()` (ver `./publicConfig.ts`), que el root layout inyecta
 * en la página en cada request.
 */
const serverEnvSchema = z.object({
  BACKEND_URL: z.string().url(),
  BLOB_URL: z.string().url().optional(),
  CITY_URL: z.string().url().optional(),
  APP_VERSION: z.string().optional(),
  APP_NAME: z.string().min(1),
  CITY_NAME: z.string().min(1),
  FIREBASE_API_KEY: z.string().min(1),
  FIREBASE_AUTH_DOMAIN: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().min(1),
  FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  FIREBASE_APP_ID: z.string().min(1)
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Lee y valida `process.env` la primera vez que se llama (lazy) y cachea el
 * resultado. Lazy para que `next build` no exija las variables: solo hacen
 * falta cuando el contenedor arranca.
 */
export const getServerEnv = (): ServerEnv => {
  if (cached) return cached;

  if (typeof window !== 'undefined') {
    throw new Error(
      'getServerEnv() solo puede usarse en server. En cliente usá getPublicConfig().'
    );
  }

  const parsed = serverEnvSchema.safeParse({
    BACKEND_URL: process.env.BACKEND_URL,
    BLOB_URL: process.env.BLOB_URL,
    CITY_URL: process.env.CITY_URL,
    APP_VERSION: process.env.APP_VERSION,
    APP_NAME: process.env.APP_NAME,
    CITY_NAME: process.env.CITY_NAME,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID
  });

  if (!parsed.success) {
    console.error(
      '❌ Variables de entorno inválidas:',
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    );
    throw new Error(
      'Variables de entorno inválidas. Revisa .env.local (local) o los app settings del App Service (Azure) contra .env.example.'
    );
  }

  cached = parsed.data;
  return cached;
};
