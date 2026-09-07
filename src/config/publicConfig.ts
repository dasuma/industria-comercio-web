import { getServerEnv, type ServerEnv } from './env';

/**
 * Subconjunto de la configuración que el browser necesita. Se arma en el
 * servidor en cada request y viaja al cliente como `window.__PUBLIC_CONFIG__`
 * (inyectado por el root layout), así la misma imagen Docker sirve para
 * cualquier ciudad sin rebuild.
 *
 * Todo lo que va acá es visible en el HTML: no poner secretos. La API key
 * de Firebase es pública por diseño.
 */
export interface PublicConfig {
  appName: string;
  appVersion?: string;
  cityName: string;
  cityUrl?: string;
  blobUrl?: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

export const PUBLIC_CONFIG_GLOBAL = '__PUBLIC_CONFIG__';

declare global {
  interface Window {
    __PUBLIC_CONFIG__?: PublicConfig;
  }
}

export const toPublicConfig = (env: ServerEnv): PublicConfig => ({
  appName: env.APP_NAME,
  appVersion: env.APP_VERSION,
  cityName: env.CITY_NAME,
  cityUrl: env.CITY_URL,
  blobUrl: env.BLOB_URL,
  firebase: {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID
  }
});

/**
 * Accesor universal: en server lee `process.env` (validado), en cliente lee
 * lo que el layout inyectó. Usar en código que corre en ambos lados
 * (http_client, firebase, utils).
 */
export const getPublicConfig = (): PublicConfig => {
  if (typeof window === 'undefined') return toPublicConfig(getServerEnv());

  const config = window[PUBLIC_CONFIG_GLOBAL];
  if (!config) {
    throw new Error(
      'PublicConfig no disponible en el cliente. El root layout debe renderizar <PublicConfigScript />.'
    );
  }
  return config;
};

/**
 * Serializa la config para un <script> inline. Escapamos `<` para que un
 * valor no pueda cerrar el tag (`</script>`) e inyectar HTML.
 */
export const serializePublicConfig = (config: PublicConfig): string =>
  `window.${PUBLIC_CONFIG_GLOBAL}=${JSON.stringify(config).replace(/</g, '\\u003c')};`;
