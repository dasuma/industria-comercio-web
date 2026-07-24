import type { ReactNode } from 'react';
import { RiGovernmentLine } from '@dasuma/pradma-ui/icons';

interface PortalChromeProps {
  /** Ancho máximo del contenido (coincide con el main de cada página). */
  maxWidth: 'max-w-3xl' | 'max-w-5xl';
  /** Slot a la derecha del header (badge de año, link de volver, etc.). */
  headerRight?: ReactNode;
  children: ReactNode;
}

const currentYear = new Date().getFullYear();

/**
 * Chrome compartido del portal público (header + footer). Usa solo tokens del
 * DS — frame `bg-bg-weak-25`, superficies `bg-bg-white-0` — para mantener el
 * look estándar del design system en las páginas públicas.
 */
export const PortalChrome = ({ maxWidth, headerRight, children }: PortalChromeProps) => (
  <div className="bg-bg-weak-25 flex min-h-screen flex-col">
    <header className="bg-bg-white-0 border-stroke-soft-200 border-b">
      <div className={`mx-auto flex w-full ${maxWidth} items-center gap-4 px-6 py-4`}>
        <div className="bg-bg-weak-50 text-text-sub-600 flex size-11 shrink-0 items-center justify-center rounded-xl">
          <RiGovernmentLine className="size-6" />
        </div>

        <div className="flex flex-col">
          <span className="text-text-strong-950 text-label-sm">
            Alcaldía de Nemocon — Cundinamarca
          </span>
          <span className="text-text-soft-400 text-subheading-2xs uppercase">
            Portal de Industria y Comercio
          </span>
        </div>

        {headerRight ? <div className="ml-auto">{headerRight}</div> : null}
      </div>
    </header>

    <main className={`mx-auto flex w-full ${maxWidth} flex-1 flex-col gap-4 p-6 lg:p-10`}>
      {children}
    </main>

    <footer className="bg-bg-white-0 border-stroke-soft-200 text-text-soft-400 text-paragraph-xs border-t px-6 py-4 text-center">
      © {currentYear} Alcaldía de Nemocon — Cundinamarca · Secretaría de Hacienda
    </footer>
  </div>
);
