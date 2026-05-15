'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tooltip } from '@biaenergy/ui';
import { useAuthContext } from '@/auth/AuthProvider';
import type { ShellDictionary } from '../../dictionaries';
import { defaultRoute, defaultWorkspace, findItemByHref } from '../../models/workspaces.config';
import { useShellUiStore } from '../../store/ui.store';
import { useTabsStore } from '../../store/tabs.store';
import { AppHeader } from '../AppHeader';
import { AppSidebar } from '../AppSidebar';
import { PageHeader } from '../PageHeader';

interface AppShellProps {
  children: ReactNode;
  dict: ShellDictionary;
}

export const AppShell = ({ children, dict }: AppShellProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();
  const initializeTabs = useTabsStore(state => state.initialize);
  const syncActiveRoute = useTabsStore(state => state.syncActiveRoute);
  const [tabsHydrated, setTabsHydrated] = useState(false);

  const { workspace, activeHref } = useMemo(() => {
    const match = findItemByHref(pathname);
    if (match) return { workspace: match.workspace, activeHref: match.href };
    return { workspace: defaultWorkspace, activeHref: defaultRoute };
  }, [pathname]);

  // El href del tab guarda pathname + search ⇒ al restaurar el tab volvemos
  // exactamente a la URL (filtros, página, sub-tab, etc. que viven en query).
  // El matching del sidebar sigue usando `pathname` puro porque sus rutas no
  // tienen query.
  const tabHref = useMemo(() => {
    const search = searchParams.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    void useShellUiStore.persist.rehydrate();
    void Promise.resolve(useTabsStore.persist.rehydrate()).then(() => setTabsHydrated(true));
  }, []);

  useEffect(() => {
    if (!tabsHydrated || !user) return;
    initializeTabs({ userId: user.uid, workspace: workspace.id, href: tabHref });
  }, [tabsHydrated, user, workspace.id, tabHref, initializeTabs]);

  useEffect(() => {
    if (!tabsHydrated) return;
    syncActiveRoute(workspace.id, tabHref);
  }, [tabsHydrated, syncActiveRoute, workspace.id, tabHref]);

  return (
    <Tooltip.Provider delayDuration={150}>
      <div className="bg-bg-weak-25 text-text-strong-950 relative flex h-screen w-screen flex-col overflow-hidden px-2 pt-0.5 pb-2">
        <AppHeader workspace={workspace} dict={dict} />

        <div className="flex min-h-0 flex-1 pt-1">
          <AppSidebar workspace={workspace} activeHref={activeHref} dict={dict} />

          <main className="flex min-w-0 flex-1 flex-col sm:ml-2">
            <div className="bg-bg-white-0 ring-stroke-soft-200 relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ring-1">
              <div className="min-h-0 flex-1 overflow-auto pb-6">
                <PageHeader workspace={workspace} activeHref={activeHref} dict={dict} />
                <div className="px-6 pt-8">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Tooltip.Provider>
  );
};
