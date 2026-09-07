'use client';

import { PradmaLogo } from '@/components/PradmaLogo';
import { cn } from '@/utils/cn';
import { selectSidebarCollapsed, useShellUiStore } from '../../store/ui.store';

// Marca de producto en la cabecera del sidebar. Es identidad, no navegación:
// el WorkspaceSwitcher del top bar dice en qué workspace estás ("Industria y
// Comercio"), esto dice de qué app se trata. Van en zonas distintas, así que
// no compiten.
export const SidebarBrand = () => {
  const collapsed = useShellUiStore(selectSidebarCollapsed);

  return (
    <div className="flex h-10 shrink-0 items-center gap-2 px-2">
      <PradmaLogo size={22} tone="glass" />
      {/* Colapso silencioso: el wordmark se desvanece con opacity, no se
          desmonta — el logo no se mueve (invariante 3 del shell). */}
      <span
        className={cn(
          'text-text-soft-400 truncate text-[10px] font-bold tracking-[0.18em] uppercase transition-opacity duration-200',
          collapsed ? 'opacity-0' : 'opacity-100'
        )}
      >
        PRADMA
      </span>
    </div>
  );
};
