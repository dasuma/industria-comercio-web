'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { RiMoonLine, RiSunLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
  /** Aria-label cuando el tema actual es dark (toggle vuelve a light). */
  ariaLabelToLight?: string;
  /** Aria-label cuando el tema actual es light (toggle vuelve a dark). */
  ariaLabelToDark?: string;
}

// Toggle dark↔light usando next-themes. Animación bia-icon-swap del DS:
// fade + blur + scale al cruzar de Moon ↔ Sun. Hasta que monta el cliente
// renderizamos el botón visualmente neutral (data-state="a") para evitar
// hydration mismatch — next-themes resuelve resolvedTheme tras el primer
// efecto, y recién ahí actualizamos el dataset.
export const ThemeToggle = ({
  className,
  ariaLabelToLight = 'Cambiar a modo claro',
  ariaLabelToDark = 'Cambiar a modo oscuro'
}: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Patrón estándar de next-themes para evitar hydration mismatch: en SSR
  // resolvedTheme es undefined, pero en cliente está disponible tras montar.
  // Renderizamos data-state neutral hasta que monta. La regla del linter
  // sobre setState-in-effect aplica a sincronización con state remoto, no
  // a este "did mount" puro — disable local justificado.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? ariaLabelToLight : ariaLabelToDark}
      className={cn(
        'text-text-sub-600 hover:text-text-strong-950 focus-visible:ring-stroke-strong-950 dark:hover:bg-bg-white-0/60 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition outline-none hover:bg-neutral-200/70 focus-visible:ring-2',
        className
      )}
    >
      <span className="bia-icon-swap" data-state={isDark ? 'b' : 'a'}>
        <span className="bia-icon-swap-item" data-icon="a">
          <RiMoonLine className="size-[18px]" />
        </span>
        <span className="bia-icon-swap-item" data-icon="b">
          <RiSunLine className="size-[18px]" />
        </span>
      </span>
    </button>
  );
};
