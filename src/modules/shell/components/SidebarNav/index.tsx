'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { TabMenuVertical, Tooltip } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import type { ShellDictionary } from '../../dictionaries';
import type { Workspace } from '../../models/nav.interface';
import type { WorkspaceKey } from '../../models/nav.types';
import { workspaces } from '../../models/workspaces.config';
import {
  selectSetMobileNavOpen,
  selectSidebarCollapsed,
  useShellUiStore
} from '../../store/ui.store';
import { useViewport } from '../../hooks/useViewport';

interface SidebarNavProps {
  workspace: Workspace;
  activeHref: string;
  dict: ShellDictionary;
}

const workspaceIndex = new Map<WorkspaceKey, number>(workspaces.map((w, i) => [w.id, i]));

// Replicado del estilo de @biaenergy/ui TabMenuVertical group primitives.
// Necesitamos un AccordionPrimitive.Root controlado por activeHref — el
// wrapper TabMenuVertical.List maneja el estado internamente vía useEffect,
// que en SSR/hydration deja el group cerrado hasta que el client corre el
// auto-open (un frame visible). Con value derivado de la URL el group abre
// sincrónico desde el server-render y no flashea.
const groupTriggerClass = cn(
  'group/tab-item relative isolate w-full rounded-lg px-2 py-1.5 text-left text-label-sm font-sans font-normal text-text-sub-600 outline-none cursor-pointer',
  'grid auto-cols-auto grid-flow-col grid-cols-[auto_minmax(0,1fr)] items-center gap-1.5',
  'transition duration-200 ease-out',
  'hover:bg-neutral-200/70 dark:hover:bg-bg-white-0',
  'focus:outline-none',
  'data-[state=open]:bg-transparent data-[state=open]:text-text-strong-950'
);
// Mismas clases que TabMenuVerticalGroupContent del DS. Agregamos sólo dos
// hints de performance que no alteran la animación:
//   - `[contain:layout]` aísla el reflow del height animado al subárbol
//     (sin esto, cada keyframe invalida layout en ancestros). Usamos `layout`
//     y no `layout paint` — `paint` clipea el box-shadow del glass-popup del
//     item activo cuando está dentro del group abierto.
//   - `[&>*]:[will-change:transform,filter,opacity]` promueve la layer del
//     compositor antes de que arranque el keyframe — evita el costo de
//     alocar layer + filter cache en el primer frame de cada item.
const groupContentClass = cn(
  'overflow-hidden [contain:layout]',
  'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
);
const groupContentInnerClass = cn(
  'bia-accordion-stagger relative ml-4 mt-0.5 space-y-0.5 pl-3 transition-[padding] duration-300 ease-out',
  'before:absolute before:inset-y-0 before:left-[2px] before:w-px before:bg-stroke-soft-200',
  'has-[>[data-state=active]:last-child]:pb-2',
  '[&>*]:[will-change:transform,filter,opacity]'
);

interface MenuTreeProps {
  workspace: Workspace;
  activeHref: string;
  collapsed: boolean;
  dict: ShellDictionary;
  onSelect: (href: string) => void;
}

const deriveOpenGroupId = (workspace: Workspace, activeHref: string): string => {
  for (const entry of workspace.items) {
    if (entry.kind !== 'group') continue;
    if (entry.items.some(c => c.href === activeHref)) return entry.id;
  }
  return '';
};

const MenuTree = ({ workspace, activeHref, collapsed, dict, onSelect }: MenuTreeProps) => {
  // openGroupId es stateful para que el click abra el accordion sincrónicamente
  // sin esperar a que Next resuelva la navegación. Antes era 100% derivado de
  // activeHref → la animación esperaba el route change y se sentía como "tarda
  // en responder". El re-sync con la URL real se hace en render comparando con
  // el valor previo (patrón recomendado por React docs sobre `useEffect` →
  // "you might not need an effect"); evita el cascading render que dispara
  // setState dentro de useEffect.
  const derivedOpenGroupId = deriveOpenGroupId(workspace, activeHref);
  const [prevDerived, setPrevDerived] = useState(derivedOpenGroupId);
  const [openGroupId, setOpenGroupId] = useState(derivedOpenGroupId);
  if (prevDerived !== derivedOpenGroupId) {
    setPrevDerived(derivedOpenGroupId);
    setOpenGroupId(derivedOpenGroupId);
  }

  return (
    <TabMenuVertical.Root value={activeHref} onValueChange={onSelect}>
      <TabsPrimitive.List className="w-full space-y-0.5">
        <AccordionPrimitive.Root
          type="single"
          collapsible
          value={openGroupId}
          onValueChange={setOpenGroupId}
          className="space-y-0.5"
        >
          {workspace.items.map(entry => {
            if (entry.kind === 'item') {
              return (
                <TabMenuVertical.Trigger
                  key={entry.href}
                  value={entry.href}
                  className={cn(collapsed && '!min-h-8 !grid-cols-1 [&>span:last-child]:!hidden')}
                >
                  <Tooltip.Root open={collapsed ? undefined : false}>
                    <Tooltip.Trigger asChild>
                      <span className="inline-flex shrink-0">
                        <TabMenuVertical.Icon as={entry.icon} className="size-[18px]" />
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right" sideOffset={12}>
                      {dict.items[entry.key]}
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <span
                    className={cn(
                      'truncate transition-opacity duration-200',
                      collapsed ? 'opacity-0' : 'opacity-100'
                    )}
                  >
                    {dict.items[entry.key]}
                  </span>
                </TabMenuVertical.Trigger>
              );
            }

            const firstChildHref = entry.items[0]?.href;
            const groupHasActive = entry.items.some(c => c.href === activeHref);

            return (
              <AccordionPrimitive.Item
                key={entry.id}
                value={entry.id}
                className={cn(
                  'space-y-0.5',
                  collapsed &&
                    groupHasActive &&
                    'bg-bg-soft-200/40 dark:bg-bg-soft-200/50 rounded-lg py-0.5'
                )}
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      groupTriggerClass,
                      collapsed && '!min-h-8 !grid-cols-1 [&>span:last-child]:!hidden'
                    )}
                    onClick={event => {
                      // groupHasActive → ya abierto, no se puede colapsar.
                      if (groupHasActive) {
                        event.preventDefault();
                        return;
                      }
                      // Si está cerrado: dejamos que Radix lo abra (vía su
                      // toggle interno → onValueChange={setOpenGroupId}) y en
                      // paralelo disparamos la navegación al primer child.
                      // La animación arranca en el próximo frame; el route
                      // resuelve después sin bloquearla.
                      if (firstChildHref && openGroupId !== entry.id) {
                        onSelect(firstChildHref);
                      }
                    }}
                  >
                    <Tooltip.Root open={collapsed ? undefined : false}>
                      <Tooltip.Trigger asChild>
                        <span className="inline-flex shrink-0">
                          <TabMenuVertical.Icon as={entry.icon} className="size-[18px]" />
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="right" sideOffset={12}>
                        {dict.items[entry.labelKey]}
                      </Tooltip.Content>
                    </Tooltip.Root>
                    <span
                      className={cn(
                        'truncate transition-opacity duration-200',
                        collapsed ? 'opacity-0' : 'opacity-100'
                      )}
                    >
                      {dict.items[entry.labelKey]}
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content
                  className={cn(
                    groupContentClass,
                    collapsed && '[&>div]:!ml-0 [&>div]:!pl-0 [&>div]:before:!hidden'
                  )}
                >
                  <div className={groupContentInnerClass}>
                    {entry.items.map(child => (
                      <TabMenuVertical.SubItem
                        key={child.href}
                        value={child.href}
                        className={cn(
                          collapsed &&
                            '!text-label-xs !mx-auto !flex !size-7 !w-7 !items-center !justify-center !p-0 !font-medium'
                        )}
                      >
                        <Tooltip.Root open={collapsed ? undefined : false}>
                          <Tooltip.Trigger asChild>
                            <span
                              className={cn(
                                collapsed &&
                                  'inline-flex size-full items-center justify-center tracking-tight'
                              )}
                            >
                              {collapsed
                                ? dict.items[child.key].slice(0, 2)
                                : dict.items[child.key]}
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Content side="right" sideOffset={12}>
                            {dict.items[child.key]}
                          </Tooltip.Content>
                        </Tooltip.Root>
                      </TabMenuVertical.SubItem>
                    ))}
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </TabsPrimitive.List>
    </TabMenuVertical.Root>
  );
};

export const SidebarNav = ({ workspace, activeHref, dict }: SidebarNavProps) => {
  const router = useRouter();
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const setMobileNavOpen = useShellUiStore(selectSetMobileNavOpen);
  const { isMobile } = useViewport();
  // `startTransition` baja la prioridad del commit del page nuevo: la
  // animación del accordion (urgent) gana frames; el render del page
  // (transition) cede frames hasta que la animación termina. Sin esto, el
  // commit del nuevo árbol RSC compite con los frames de la animación y se
  // ve como stutter — eso es la diferencia con el DS demo, que no navega.
  const [, startTransition] = useTransition();

  // `activeValue` es optimistic: arranca con la URL real y se actualiza
  // sincrónicamente al click, antes de que Next resuelva la navegación. Sin
  // esto el `data-state="active"` del item nuevo no se prendía hasta que el
  // route resolvía — se sentía como "tarda en marcar dónde clickeaste". El
  // re-sync con la URL externa (back/forward, deep link, redirect) se hace
  // en render comparando contra el prop previo — patrón React docs (evita
  // el `setState` en useEffect, que dispara una render cascade).
  const [prevActiveHref, setPrevActiveHref] = useState(activeHref);
  const [activeValue, setActiveValue] = useState(activeHref);
  if (prevActiveHref !== activeHref) {
    setPrevActiveHref(activeHref);
    setActiveValue(activeHref);
  }

  // Prefetch agresivo de todas las rutas del workspace en mount: sin esto,
  // `router.push` descarga el bundle on-demand y se ve el loading.tsx del
  // segmento (transición lenta/glitchy). Con prefetch, los clicks son
  // instantáneos. `AppShell` ya sincroniza el tab activo cuando cambia el
  // pathname, así que no hace falta tocar el tabs store en cada click.
  useEffect(() => {
    for (const entry of workspace.items) {
      if (entry.kind === 'item') {
        router.prefetch(entry.href);
      } else {
        for (const child of entry.items) router.prefetch(child.href);
      }
    }
  }, [workspace, router]);

  const handleValueChange = useCallback(
    (next: string) => {
      if (!next || next === activeValue) return;
      // Optimistic: el item nuevo marca activo en este frame. La navegación
      // corre como transition (low priority) en paralelo.
      setActiveValue(next);
      startTransition(() => {
        router.push(next);
      });
      if (isMobile) setMobileNavOpen(false);
    },
    [activeValue, router, isMobile, setMobileNavOpen]
  );

  // Side-by-side cross-fade entre workspaces. Cuando cambia el workspace, el
  // menú entrante reemplaza al saliente con bia-page-slide (override slide y
  // blur a 0 — solo fade rápido; el slide se siente excesivo en el sidebar).
  const sectionIndex = workspaceIndex.get(workspace.id) ?? 0;
  const prevSectionIndexRef = useRef(sectionIndex);
  const slotRef = useRef<1 | 2>(1);
  const lastAppliedRef = useRef<WorkspaceKey>(workspace.id);
  const [slot, setSlot] = useState<1 | 2>(1);
  const [slotContent, setSlotContent] = useState<Record<1 | 2, Workspace>>({
    1: workspace,
    2: workspace
  });

  useEffect(() => {
    if (lastAppliedRef.current === workspace.id) return;
    const forward = sectionIndex >= prevSectionIndexRef.current;
    const desired: 1 | 2 = forward ? 2 : 1;
    const current = slotRef.current;
    const nextSlot: 1 | 2 = desired === current ? (current === 1 ? 2 : 1) : desired;
    slotRef.current = nextSlot;
    prevSectionIndexRef.current = sectionIndex;
    lastAppliedRef.current = workspace.id;
    setSlotContent(prev => ({ ...prev, [nextSlot]: workspace }));
    setSlot(nextSlot);
  }, [workspace, sectionIndex]);

  return (
    <div
      className="bia-page-slide relative min-h-0 flex-1"
      data-page={slot}
      style={{
        ['--bia-page-slide-distance' as string]: '0px',
        ['--bia-page-blur' as string]: '0px',
        ['--bia-page-slide-dur' as string]: '120ms',
        ['--bia-page-fade-dur' as string]: '120ms'
      }}
    >
      {([1, 2] as const).map(slotId => {
        const slotWorkspace = slotContent[slotId];
        const isActiveSlot = slotId === slot;
        return (
          <div
            key={slotId}
            className="bia-page overflow-x-hidden overflow-y-auto px-2 pt-3"
            data-page-id={slotId}
            aria-hidden={!isActiveSlot}
          >
            <MenuTree
              workspace={slotWorkspace}
              activeHref={isActiveSlot ? activeValue : ''}
              collapsed={collapsed}
              dict={dict}
              onSelect={handleValueChange}
            />
          </div>
        );
      })}
    </div>
  );
};
