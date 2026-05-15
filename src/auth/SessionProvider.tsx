'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuthStore } from '@modules/auth';
import { getFirebaseAuth } from './firebase';
import { createSession, destroySession } from './sessionCookies';

interface SessionContextValue {
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue>({ user: null, isLoading: true });

// Tokens de Firebase viven ~60min. Refrescamos a los 50min con `getIdToken(true)`
// para tener siempre un margen sano y que la cookie httpOnly nunca quede
// expirada antes de su próxima rotación. Esta ventana DEBE ser estrictamente
// menor a SESSION_MAX_AGE_SECONDS en /api/auth/session/route.ts.
const REFRESH_INTERVAL_MS = 50 * 60 * 1000;

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setStoreUser = useAuthStore(state => state.setUser);
  const clearStoreUser = useAuthStore(state => state.clear);
  // El interval va por ref para poder limpiarlo sin retriggear effects.
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    const clearRefreshLoop = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async nextUser => {
      setUser(nextUser);
      setIsLoading(false);

      if (!nextUser) {
        clearRefreshLoop();
        clearStoreUser();
        return;
      }

      // Token nuevo en cada onAuthStateChanged (login o sesión restaurada):
      // re-postear al endpoint para sincronizar la cookie httpOnly con el
      // ID token vigente que tiene Firebase.
      try {
        const idToken = await nextUser.getIdToken();
        await createSession({
          idToken,
          userId: nextUser.uid,
          email: nextUser.email ?? ''
        });
      } catch {
        // Si falla, limpiamos para forzar re-login en el próximo request.
        await destroySession();
        return;
      }

      setStoreUser({
        id: nextUser.uid,
        email: nextUser.email ?? '',
        name: nextUser.displayName ?? nextUser.email ?? '',
        photoURL: nextUser.photoURL ?? null
      });

      // Reiniciamos el loop por si veníamos de un user previo. Idempotente.
      clearRefreshLoop();
      refreshIntervalRef.current = setInterval(async () => {
        const current = getFirebaseAuth().currentUser;
        if (!current) return;
        try {
          const refreshed = await current.getIdToken(true);
          await createSession({
            idToken: refreshed,
            userId: current.uid,
            email: current.email ?? ''
          });
        } catch {
          // Refresh fallido: dejamos que el siguiente 401 del backend
          // gatille la limpieza y el redirect a login.
        }
      }, REFRESH_INTERVAL_MS);
    });

    return () => {
      unsubscribe();
      clearRefreshLoop();
    };
  }, [setStoreUser, clearStoreUser]);

  return <SessionContext.Provider value={{ user, isLoading }}>{children}</SessionContext.Provider>;
};

export const useSessionContext = () => useContext(SessionContext);
