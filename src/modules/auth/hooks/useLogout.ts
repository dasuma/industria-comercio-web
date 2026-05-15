'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@auth/useAuth';
import { useAuthStore } from '../store/auth.store';

export const useLogout = () => {
  const router = useRouter();
  const { logout: firebaseLogout } = useAuth();
  const clearStore = useAuthStore(state => state.clear);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseLogout();
      clearStore();
      queryClient.clear();
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  }, [firebaseLogout, clearStore, queryClient, router]);

  return { logout, isLoading };
};
