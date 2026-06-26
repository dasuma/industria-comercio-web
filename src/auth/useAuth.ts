'use client';

import { useCallback } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseAuth, googleProvider } from './firebase';
import { useSessionContext } from './SessionProvider';
import { createSession, destroySession } from './sessionCookies';

export const useAuth = () => {
  const { user, isLoading } = useSessionContext();

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const idToken = await credential.user.getIdToken();
    // Postear el token al endpoint garantiza que apenas vuelve la popup las
    // requests siguientes ya tengan la cookie httpOnly seteada, sin
    // depender del timing del listener onAuthStateChanged en SessionProvider.
    await createSession({
      idToken,
      userId: credential.user.uid,
      email: credential.user.email ?? ''
    });
    return { user: credential.user, idToken };
  }, []);

  const loginWithEmailPassword = useCallback(async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    const idToken = await credential.user.getIdToken();
    await createSession({
      idToken,
      userId: credential.user.uid,
      email: credential.user.email ?? ''
    });
    return { user: credential.user, idToken };
  }, []);

  const logout = useCallback(async () => {
    // Limpiamos cookies ANTES de signOut: si Firebase falla por red, la
    // sesión local ya queda invalidada y el proxy patea al login en el
    // próximo render. El orden inverso dejaría cookies huérfanas.
    await destroySession();
    await signOut(getFirebaseAuth());
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithEmailPassword,
    logout
  };
};
