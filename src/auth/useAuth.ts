'use client';

import { useCallback } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { getFirebaseAuth, googleProvider } from './firebase';
import { useAuthContext } from './AuthProvider';

export const useAuth = () => {
  const { user, isLoading } = useAuthContext();

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const idToken = await credential.user.getIdToken();
    Cookies.set('bia_session', idToken);
    return { user: credential.user, idToken };
  }, []);

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth());
    Cookies.remove('bia_session');
    Cookies.remove('bia_session_refresh');
  }, []);

  return { user, isLoading, isAuthenticated: !!user, loginWithGoogle, logout };
};
