'use client';

import {
  type KeyboardEvent,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { CompactButton } from '@biaenergy/ui';
import { RiAddLine, RiCloseLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import {
  defaultRoute,
  defaultWorkspace,
  findNavMatch,
  firstHrefInWorkspace,
  getWorkspaceById
} from '../../models/workspaces.config';
import type { ShellDictionary } from '../../dictionaries';
import { selectActiveTabId, selectTabs, useTabsStore, type Tab } from '../../store/tabs.store';

interface TabsStripProps {
  dict: ShellDictionary;
}

// Resuelve el par "section > item" del tab mostrando los 2 niveles más
// profundos disponibles:
//   - Sub-tab de un item (ej. /acquisition/bianetwork/usuarios-pro) →
//     "BiaNetwork > Usuarios Pro" (item > subTab)
//   - Hijo de un grupo (ej. /operations/cgm/report) →
//     "CGM > Reporte CGM" (group > child)
//   - Item suelto → "Growth > BiaNetwork" (workspace > item)
const buildTabLabels = (tab: Tab, dict: ShellDictionary): { section: string; item: string } => {
  const match = findNavMatch(tab.href);
  if (match?.groupKey) {
    return {
      section: dict.items[match.groupKey],
      item: dict.items[match.itemKey]
    };
  }
  const itemKey = match?.itemKey;
  return {
    section: dict.workspaces[tab.workspace],
    item: itemKey ? dict.items[itemKey] : dict.workspaces[tab.workspace]
  };
};

// Text-swap recipe del DS (Foundations → Animations). El `displayed` es el
// label que está VISIBLE actualmente (incluyendo durante is-exit). El phantom
// span del tab usa `displayed` para mantener el ancho sincronizado al label
// visible — sin esto el tab se achica antes de que termine la transición y
// la truncación rtl mete "..." en pleno swap.
const useTextSwap = (
  label: string
): { displayed: string; ref: React.RefObject<HTMLSpanElement | null> } => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayed, setDisplayed] = useState(label);
  const busyRef = useRef(false);

  useEffect(() => {
    if (label === displayed) return;
    const el = ref.current;
    if (!el) {
      setDisplayed(label);
      return;
    }
    if (busyRef.current) {
      setDisplayed(label);
      return;
    }
    busyRef.current = true;
    const dur = 200;
    el.classList.add('is-exit');
    const id = window.setTimeout(() => {
      setDisplayed(label);
      el.classList.remove('is-exit');
      el.classList.add('is-enter-start');
      void el.offsetWidth;
      el.classList.remove('is-enter-start');
      busyRef.current = false;
    }, dur);
    return () => window.clearTimeout(id);
  }, [label, displayed]);

  return { displayed, ref };
};

interface TabPillProps {
  tab: Tab;
  active: boolean;
  showClose: boolean;
  labels: { section: string; item: string };
  closeAriaLabel: string;
  onActivate: (id: number) => void;
  onClose: (id: number, event: MouseEvent) => void;
}

const TabPill = memo(function TabPill({
  tab,
  active,
  showClose,
  labels,
  closeAriaLabel,
  onActivate,
  onClose
}: TabPillProps) {
  const { displayed: displayedItem, ref: itemRef } = useTextSwap(labels.item);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate(tab.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={active ? 'page' : undefined}
      onClick={() => onActivate(tab.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        // leading-tight (no leading-none) — el truncate del overlay con
        // overflow:hidden y line-height:1 corta los descendientes (q/p/g).
        // 1.25 deja ~1.5px debajo del baseline sin romper el centrado.
        'group/tab !text-label-xs focus-visible:ring-stroke-strong-950 relative flex h-7 max-w-[260px] shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 leading-tight transition-[box-shadow,background,color] outline-none focus-visible:ring-2',
        active
          ? 'bg-bg-white-0 text-text-strong-950 shadow-regular-xs ring-stroke-soft-200 ring-1'
          : 'text-text-soft-400 hover:text-text-sub-600 dark:hover:bg-bg-white-0/60 hover:bg-neutral-200/70'
      )}
    >
      {showClose ? (
        <>
          {/* Phantom invisible — fija el ancho al label visible (no al prop
              nuevo) para que durante el text-swap el tab no se contraiga y
              dispare "..." rtl en plena transición. */}
          <span aria-hidden className="invisible whitespace-nowrap">
            {labels.section} › {displayedItem}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-2 left-2 flex items-center justify-center transition-[right] duration-200 group-hover/tab:right-7">
            <span className="block max-w-full truncate text-left" dir="rtl">
              <bdi>
                {labels.section} <span className="text-text-soft-400">›</span>{' '}
                <span ref={itemRef} className="bia-text-swap">
                  {displayedItem}
                </span>
              </bdi>
            </span>
          </span>
          <CompactButton.Root
            variant="ghost"
            size="medium"
            onClick={event => onClose(tab.id, event)}
            aria-label={closeAriaLabel}
            className="!absolute !top-1/2 !right-1 !-translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/tab:opacity-100"
          >
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </>
      ) : (
        <span className="inline-flex h-full min-w-0 flex-1 items-center justify-center gap-1 truncate whitespace-nowrap">
          <span className="truncate">{labels.section}</span>
          <span className="text-text-soft-400">›</span>
          <span ref={itemRef} className="bia-text-swap">
            {displayedItem}
          </span>
        </span>
      )}
    </div>
  );
});

export const TabsStrip = ({ dict }: TabsStripProps) => {
  const router = useRouter();
  const tabs = useTabsStore(selectTabs);
  const activeTabId = useTabsStore(selectActiveTabId);
  const setActiveTab = useTabsStore(state => state.setActiveTab);
  const closeTab = useTabsStore(state => state.closeTab);
  const addTab = useTabsStore(state => state.addTab);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToEndRef = useRef(false);
  const [scrolledLeft, setScrolledLeft] = useState(false);
  const [scrolledRight, setScrolledRight] = useState(false);

  const handleActivate = useCallback(
    (id: number) => {
      const tab = tabs.find(t => t.id === id);
      if (!tab) return;
      setActiveTab(id);
      router.push(tab.href);
    },
    [tabs, setActiveTab, router]
  );

  const handleClose = useCallback(
    (id: number, event: MouseEvent) => {
      event.stopPropagation();
      const next = closeTab(id);
      if (next && next.id !== activeTabId) {
        router.push(next.href);
      }
    },
    [closeTab, activeTabId, router]
  );

  const handleNewTab = useCallback(() => {
    // Crear el nuevo tab dentro del workspace donde estamos parados — si el
    // user está en Growth, el "+" abre otra pestaña de Growth, no salta a
    // Operaciones (que era el `defaultRoute` previo).
    const currentTab = tabs.find(t => t.id === activeTabId);
    const workspace = currentTab
      ? (getWorkspaceById(currentTab.workspace) ?? defaultWorkspace)
      : defaultWorkspace;
    const initialHref = firstHrefInWorkspace(workspace) || defaultRoute;
    const tab = addTab(workspace.id, initialHref);
    shouldScrollToEndRef.current = true;
    router.push(tab.href);
  }, [tabs, activeTabId, addTab, router]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = (): void => {
      setScrolledLeft(el.scrollLeft > 0);
      setScrolledRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [tabs.length]);

  useEffect(() => {
    if (!shouldScrollToEndRef.current) return;
    shouldScrollToEndRef.current = false;
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }, [tabs.length]);

  const showClose = tabs.length > 1;

  return (
    <div className="hidden min-w-0 flex-1 items-center pt-1 pl-2 sm:flex">
      <div
        aria-hidden
        className={cn(
          'h-9 w-px shrink-0 transition-[background-color,margin] duration-200',
          scrolledLeft ? 'bg-stroke-soft-200 mr-2' : 'mr-0 bg-transparent'
        )}
      />
      <div
        ref={scrollerRef}
        className="-m-2 flex min-w-0 items-center gap-2 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onWheel={event => {
          const target = event.currentTarget;
          if (target.scrollWidth <= target.clientWidth) return;
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            target.scrollLeft += event.deltaY;
          }
        }}
      >
        {tabs.map(tab => (
          <TabPill
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            showClose={showClose}
            labels={buildTabLabels(tab, dict)}
            closeAriaLabel={dict.actions.closeTab}
            onActivate={handleActivate}
            onClose={handleClose}
          />
        ))}
      </div>
      <div
        aria-hidden
        className={cn(
          'h-9 w-px shrink-0 transition-[background-color,margin] duration-200',
          scrolledRight ? 'bg-stroke-soft-200 mx-2' : 'mr-0 ml-0.5 bg-transparent'
        )}
      />
      <CompactButton.Root
        variant="ghost"
        size="large"
        onClick={handleNewTab}
        aria-label={dict.actions.newTab}
      >
        <CompactButton.Icon as={RiAddLine} />
      </CompactButton.Root>
    </div>
  );
};
