'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WorkspaceKey } from '../models/nav.types';

export interface Tab {
  id: number;
  workspace: WorkspaceKey;
  href: string;
}

interface TabsState {
  userId: string | null;
  tabs: Tab[];
  activeTabId: number | null;
  tabIdSeq: number;
  initializedForUser: string | null;
  initialize: (params: { userId: string; workspace: WorkspaceKey; href: string }) => void;
  syncActiveRoute: (workspace: WorkspaceKey, href: string) => void;
  setActiveTab: (id: number) => void;
  closeTab: (id: number) => Tab | null;
  addTab: (workspace: WorkspaceKey, href: string) => Tab;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      userId: null,
      tabs: [],
      activeTabId: null,
      tabIdSeq: 0,
      initializedForUser: null,

      initialize: ({ userId, workspace, href }) =>
        set(state => {
          if (state.initializedForUser === userId) return state;

          // Distinto usuario que el persistido → arranca limpio.
          if (state.userId !== userId) {
            const id = state.tabIdSeq + 1;
            const tab: Tab = { id, workspace, href };
            return {
              userId,
              initializedForUser: userId,
              tabs: [tab],
              activeTabId: tab.id,
              tabIdSeq: id
            };
          }

          // Mismo usuario sin tabs persistidos → primer tab.
          if (state.tabs.length === 0) {
            const id = state.tabIdSeq + 1;
            const tab: Tab = { id, workspace, href };
            return {
              initializedForUser: userId,
              tabs: [tab],
              activeTabId: tab.id,
              tabIdSeq: id
            };
          }

          // Mismo usuario con tabs guardados: si el pathname matchea uno
          // existente, lo activamos; si no, se respeta el deep link agregando
          // un tab nuevo sin pisar los guardados.
          const matching = state.tabs.find(t => t.href === href);
          if (matching) {
            return {
              initializedForUser: userId,
              activeTabId: matching.id
            };
          }
          const id = state.tabIdSeq + 1;
          const tab: Tab = { id, workspace, href };
          return {
            initializedForUser: userId,
            tabs: [...state.tabs, tab],
            activeTabId: id,
            tabIdSeq: id
          };
        }),

      syncActiveRoute: (workspace, href) =>
        set(state => {
          if (state.activeTabId === null) return state;
          const tabs = state.tabs.map(t =>
            t.id === state.activeTabId ? { ...t, workspace, href } : t
          );
          return { tabs };
        }),

      setActiveTab: id => set({ activeTabId: id }),

      closeTab: id => {
        let nextTab: Tab | null = null;
        set(state => {
          const idx = state.tabs.findIndex(t => t.id === id);
          if (idx === -1) return state;
          const remaining = state.tabs.filter(t => t.id !== id);
          if (state.activeTabId === id) {
            const candidate = remaining[Math.min(idx, remaining.length - 1)] ?? null;
            nextTab = candidate;
            return { tabs: remaining, activeTabId: candidate?.id ?? null };
          }
          return { tabs: remaining };
        });
        return nextTab;
      },

      addTab: (workspace, href) => {
        const { tabs, tabIdSeq } = get();
        const id = tabIdSeq + 1;
        const tab: Tab = { id, workspace, href };
        set({ tabs: [...tabs, tab], activeTabId: id, tabIdSeq: id });
        return tab;
      }
    }),
    {
      name: 'shell-tabs-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        userId: state.userId,
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        tabIdSeq: state.tabIdSeq
      }),
      skipHydration: true
    }
  )
);

export const selectTabs = (state: TabsState): Tab[] => state.tabs;
export const selectActiveTabId = (state: TabsState): number | null => state.activeTabId;
export const selectActiveTab = (state: TabsState): Tab | undefined =>
  state.tabs.find(t => t.id === state.activeTabId);
