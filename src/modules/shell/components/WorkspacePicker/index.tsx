'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/useAuth';
import { cn } from '@/utils/cn';
import { workspaces } from '../../models/workspaces.config';
import type { WorkspaceKey } from '../../models/nav.types';
import type { ShellDictionary } from '../../dictionaries';

interface WorkspacePickerProps {
  onSelect: (workspaceId: WorkspaceKey) => void;
  dict: ShellDictionary;
  // Si el padre coordina la entrada (ej: morph del card de login), puede
  // pasar `false` para suprimir el stagger interno. Default `true` — el
  // componente entra escalonado por sí solo: header primero, cards en
  // cascada después.
  animate?: boolean;
}

// El header (greeting + título) entra primero con fade + slide-from-top
// (duración 500ms, arrancando a 120ms). Cuando termina, gatillamos la
// cascada del listado con el recipe `bia-accordion-stagger` del DS. La
// secuencia "header → opciones" es explícita para que se lea como dos
// pasos, no como una sola entrada.
const HEADER_DELAY_MS = 120;
const HEADER_DURATION_MS = 500;
const CASCADE_TRIGGER_MS = HEADER_DELAY_MS + HEADER_DURATION_MS - 60;

const firstNameOf = (displayName: string | null | undefined): string | null => {
  if (!displayName) return null;
  const trimmed = displayName.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/)[0] ?? null;
};

export const WorkspacePicker = ({ onSelect, dict, animate = true }: WorkspacePickerProps) => {
  const { user } = useAuth();
  const firstName = firstNameOf(user?.displayName);
  // Frase fija para la sesión del picker — `useState(() => ...)` la
  // selecciona una vez al montar y no cambia en re-renders.
  const [inspiration] = useState(() => {
    const list = dict.picker.inspirations;
    return list[Math.floor(Math.random() * list.length)] ?? '';
  });

  // Hasta que el header termina, los `<li>` quedan con opacity 0 y el
  // `<ul>` no tiene `bia-accordion-stagger`. Al activarse, se aplica la
  // clase del stagger en el mismo render que se quita el `opacity-0`, así
  // la animación arranca limpia desde su `from` (blur+translateY+opacity 0).
  const [cascadeReady, setCascadeReady] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = window.setTimeout(() => setCascadeReady(true), CASCADE_TRIGGER_MS);
    return () => window.clearTimeout(t);
  }, [animate]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div
        className={cn(
          'flex flex-col items-center gap-1 text-center',
          animate && 'animate-in fade-in slide-in-from-top-2'
        )}
        style={
          animate
            ? {
                animationDelay: `${HEADER_DELAY_MS}ms`,
                animationDuration: `${HEADER_DURATION_MS}ms`,
                animationFillMode: 'both'
              }
            : undefined
        }
      >
        <h2 className="text-title-h5 text-text-strong-950 whitespace-pre-line">
          {dict.picker.title}
        </h2>
        {firstName && inspiration && (
          <p className="text-paragraph-sm text-text-sub-600">
            {firstName}, {inspiration}
          </p>
        )}
      </div>

      <ul
        className={cn(
          // 1 card por fila. La cascada usa el recipe `bia-accordion-stagger`
          // del DS (opacity + translateY + blur, con stagger por nth-child) —
          // el mismo que el sidebar al abrir un group. Sólo aplica una vez
          // que el header terminó su entrada.
          'flex flex-col gap-1.5',
          animate && !cascadeReady && '[&>li]:opacity-0',
          animate && cascadeReady && 'bia-accordion-stagger'
        )}
      >
        {workspaces.map(workspace => {
          const Icon = workspace.iconFill;
          return (
            <li key={workspace.id}>
              <button
                type="button"
                onClick={() => onSelect(workspace.id)}
                className={cn(
                  'group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left',
                  'ring-stroke-soft-200 ring-1 outline-none',
                  'transition-[box-shadow] duration-200 ease-out',
                  'hover:ring-stroke-sub-300',
                  'active:scale-[0.99]',
                  'focus-visible:ring-primary-base focus-visible:ring-2 focus-visible:ring-offset-2'
                )}
              >
                {/* Glass-popup overlay — fade in/out al hover. */}
                <span
                  aria-hidden
                  className={cn(
                    'glass-popup pointer-events-none absolute inset-0 rounded-xl',
                    'opacity-0 transition-opacity duration-300 ease-out',
                    'group-hover:opacity-100'
                  )}
                />

                <span className="glass-popup text-text-strong-950 relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-[18px]" />
                </span>

                <span className="text-label-md text-text-strong-950 relative z-10">
                  {dict.workspaces[workspace.id]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
