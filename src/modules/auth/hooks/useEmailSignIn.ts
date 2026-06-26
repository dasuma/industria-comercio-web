'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@auth/useAuth';
import { DEFAULT_AUTHED_ROUTE } from '@/config/routes';
import { useAuthStore } from '../store/auth.store';
import type { AuthUser } from '../models/auth.interface';

interface UseEmailSignInOptions {
  onSuccess?: (user: AuthUser) => void | Promise<void>;
}

export const useEmailSignIn = (options?: UseEmailSignInOptions) => {
  const router = useRouter();
  const { loginWithEmailPassword } = useAuth();
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSuccess = options?.onSuccess;

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const { user } = await loginWithEmailPassword(email, password);
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
    },
    [loginWithEmailPassword, router, setUser, onSuccess]
  );

  return { signIn, isLoading, error };
};
