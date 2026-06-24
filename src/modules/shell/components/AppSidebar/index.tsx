'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import type { ShellDictionary } from '../../dictionaries';
import type { Workspace } from '../../models/nav.interface';
import { useViewport } from '../../hooks/useViewport';
import {
  selectMobileNavOpen,
  selectSetMobileNavOpen,
  selectSetSidebarCollapsed,
  selectSidebarCollapsed,
  useShellUiStore
} from '../../store/ui.store';
import { SearchButton } from '../SearchButton';
import { SidebarNav } from '../SidebarNav';
import { UserMenu } from '../UserMenu';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

interface AppSidebarProps {
  workspace: Workspace;
  activeHref: string;
  dict: ShellDictionary;
}

export const AppSidebar = ({ workspace, activeHref, dict }: AppSidebarProps) => {
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const setSidebarCollapsed = useShellUiStore(selectSetSidebarCollapsed);
  const mobileNavOpen = useShellUiStore(selectMobileNavOpen);
  const setMobileNavOpen = useShellUiStore(selectSetMobileNavOpen);
  const { isMobile, isCompact } = useViewport();
  const isCompactOnly = isCompact && !isMobile;

  // Al entrar al rango compact-only auto-colapsamos el sidebar (1 sola vez
  // por entrada). El usuario sigue pudiendo reabrirlo con el toggle.
  useEffect(() => {
    if (isCompactOnly) setSidebarCollapsed(true);
  }, [isCompactOnly, setSidebarCollapsed]);

  // En mobile el drawer siempre se muestra expandido (con labels). Si venimos
  // de compact con collapsed=true, lo restauramos al entrar a mobile para que
  // el drawer no aparezca colapsado.
  useEffect(() => {
    if (isMobile) setSidebarCollapsed(false);
  }, [isMobile, setSidebarCollapsed]);

  // Habilita la transition del drawer mobile sólo después del primer commit
  // post-cambio a mobile, para evitar que el navegador anime un slide-out
  // desde la posición in-flow previa cuando isMobile pasa a true.
  const [drawerCanAnimate, setDrawerCanAnimate] = useState(false);
  useEffect(() => {
    if (!isMobile) return;
    let cancelled = false;
    const r1 = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) setDrawerCanAnimate(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(r1);
      setDrawerCanAnimate(false);
    };
  }, [isMobile]);

  // Si pasamos de mobile a desktop con el drawer abierto, lo cerramos.
  useEffect(() => {
    if (!isMobile && mobileNavOpen) setMobileNavOpen(false);
  }, [isMobile, mobileNavOpen, setMobileNavOpen]);

  // Escape cierra el drawer mobile.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileNavOpen, setMobileNavOpen]);

  return (
    <>
      {mobileNavOpen && (
        <button
          type="button"
          aria-label={dict.actions.closeNav}
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-30 cursor-default bg-black/30 backdrop-blur-[2px] sm:hidden"
        />
      )}

      <aside
        data-sidebar
        className={cn(
          'dark',
          isMobile
            ? cn(
                'fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-hidden bg-[#0a1628] px-1.5 pt-1 ring-1 ring-white/10',
                drawerCanAnimate && 'transition-transform duration-300',
                mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
              )
            : cn(
                'bia-resize flex shrink-0 flex-col overflow-hidden rounded-2xl bg-[#0a1628]',
                collapsed ? 'w-[52px]' : 'w-60'
              )
        )}
      >
        {isMobile && (
          <div className="flex shrink-0 items-center px-1.5 pt-1 pb-1 sm:hidden">
            <WorkspaceSwitcher active={workspace} dict={dict} />
          </div>
        )}

        <SearchButton dict={dict.search} />
        <SidebarNav workspace={workspace} activeHref={activeHref} dict={dict} />
        <UserMenu dict={dict.user} />
      </aside>
    </>
  );
};
