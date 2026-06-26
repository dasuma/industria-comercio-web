'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '../models/auth.interface';

interface AuthState {
  user: AuthUser | null;
  // Flag que indica si la sesión debe quedar persistida en localStorage.
  // Nunca guardamos el token acá — solo el perfil mínimo y este flag, que
  // sirven para hidratar la UI sin esperar a Firebase. El token vive
  // exclusivamente en cookie con expiración.
  persistSession: boolean;
  setUser: (user: AuthUser | null) => void;
  setPersistSession: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      persistSession: false,
      setUser: user => set({ user, persistSession: !!user }),
      setPersistSession: value => set({ persistSession: value }),
      clear: () => set({ user: null, persistSession: false })
    }),
    {
      name: 'pradma_session_profile',
      storage: createJSONStorage(() => localStorage),
      // Persistimos solo el perfil y el flag — explícitamente NUNCA el token.
      partialize: state => ({ user: state.user, persistSession: state.persistSession }),
      skipHydration: true
    }
  )
);

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => !!state.user;
export const selectPersistSession = (state: AuthState) => state.persistSession;
