import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth
} from 'firebase/auth';
import { getPublicConfig } from '@/config/publicConfig';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let persistenceConfigured = false;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    // Config resuelta en runtime (no en build) para que la misma imagen
    // sirva a cualquier ciudad/proyecto de Firebase.
    app = getApps()[0] ?? initializeApp(getPublicConfig().firebase);
  }
  return app;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  // Session persistence vive solo en memoria del tab — al cerrar el tab el
  // user de Firebase se va, y la persistencia del lado de la app queda a
  // cargo de las cookies (pradma_session*). Persistence solo aplica en
  // browser; en SSR Firebase falla si lo intentamos.
  if (!persistenceConfigured && typeof window !== 'undefined') {
    persistenceConfigured = true;
    void setPersistence(auth, browserSessionPersistence);
  }
  return auth;
};

export const googleProvider = new GoogleAuthProvider();
