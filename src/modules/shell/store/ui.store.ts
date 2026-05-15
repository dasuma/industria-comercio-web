'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useShellUiStore = create<UIState>()(
  persist(
    set => ({
      sidebarCollapsed: false,
      searchOpen: false,
      mobileNavOpen: false,
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
      setSearchOpen: open => set({ searchOpen: open }),
      setMobileNavOpen: open => set({ mobileNavOpen: open })
    }),
    {
      name: 'shell-ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ sidebarCollapsed: state.sidebarCollapsed }),
      skipHydration: true
    }
  )
);

export const selectSidebarCollapsed = (state: UIState): boolean => state.sidebarCollapsed;
export const selectSearchOpen = (state: UIState): boolean => state.searchOpen;
export const selectMobileNavOpen = (state: UIState): boolean => state.mobileNavOpen;
export const selectToggleSidebar = (state: UIState): UIState['toggleSidebar'] =>
  state.toggleSidebar;
export const selectSetSidebarCollapsed = (state: UIState): UIState['setSidebarCollapsed'] =>
  state.setSidebarCollapsed;
export const selectSetSearchOpen = (state: UIState): UIState['setSearchOpen'] =>
  state.setSearchOpen;
export const selectSetMobileNavOpen = (state: UIState): UIState['setMobileNavOpen'] =>
  state.setMobileNavOpen;
