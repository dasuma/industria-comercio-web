import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth
} from 'firebase/auth';
import { env } from '@/config/env';

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let persistenceConfigured = false;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
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
