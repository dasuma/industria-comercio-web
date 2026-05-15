'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@auth/useAuth';
import { DEFAULT_AUTHED_ROUTE } from '@/config/routes';
import { useAuthStore } from '../store/auth.store';
import type { AuthUser } from '../models/auth.interface';

interface UseGoogleSignInOptions {
  // Callback opcional invocado tras un signIn exitoso. Si está presente,
  // suprime el redirect automático a DEFAULT_AUTHED_ROUTE — el caller decide
  // a dónde llevar al usuario (ej: abrir un workspace picker primero).
  // Puede devolver una Promise: el hook awaitea antes de bajar isLoading,
  // así el caller puede mantener el loader visible (ej: delay deliberado
  // antes de un morph) sin parpadeos del botón.
  onSuccess?: (user: AuthUser) => void | Promise<void>;
}

export const useGoogleSignIn = (options?: UseGoogleSignInOptions) => {
  const router = useRouter();
  const { loginWithGoogle: firebaseLogin } = useAuth();
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSuccess = options?.onSuccess;

  const signIn = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { user } = await firebaseLogin();
      const authUser: AuthUser = {
        id: user.uid,
        email: user.email ?? '',
        name: user.displayName ?? user.email ?? '',
        photoURL: user.photoURL ?? null
      };
      setUser(authUser);
      if (onSuccess) {
        await onSuccess(authUser);
      } else {
        router.replace(DEFAULT_AUTHED_ROUTE);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [firebaseLogin, router, setUser, onSuccess]);

  return { signIn, isLoading, error };
};
