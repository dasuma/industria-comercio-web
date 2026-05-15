'use client';

import { useEffect, useRef, useState } from 'react';
import type { ShellDictionary } from '../../dictionaries';
import type { Workspace } from '../../models/nav.interface';
import { findItemByHref, workspaces } from '../../models/workspaces.config';
import type { NavItemKey, WorkspaceKey } from '../../models/nav.types';

interface PageHeaderProps {
  workspace: Workspace;
  activeHref: string;
  dict: ShellDictionary;
}

const resolveItemKey = (workspace: Workspace, href: string): NavItemKey | undefined => {
  for (const entry of workspace.items) {
    if (entry.kind === 'item' && entry.href === href) return entry.key;
    if (entry.kind === 'group') {
      const child = entry.items.find(c => c.href === href);
      if (child) return child.key;
    }
  }
  return undefined;
};

const buildPageContent = (
  workspace: Workspace,
  activeHref: string,
  dict: ShellDictionary
): { label: string; description: string } => {
  const match = findItemByHref(activeHref);
  const href = match?.href ?? activeHref;
  const key = resolveItemKey(workspace, href);
  const label = key ? dict.items[key] : dict.workspaces[workspace.id];
  const description = dict.descriptions[workspace.id];
  return { label, description };
};

const workspaceIndex = new Map<WorkspaceKey, number>(workspaces.map((w, i) => [w.id, i]));

export const PageHeader = ({ workspace, activeHref, dict }: PageHeaderProps) => {
  const content = buildPageContent(workspace, activeHref, dict);
  const sectionIndex = workspaceIndex.get(workspace.id) ?? 0;

  const prevSectionIndexRef = useRef(sectionIndex);
  const slotRef = useRef<1 | 2>(1);
  const lastAppliedRef = useRef({ label: content.label, description: content.description });
  const [slot, setSlot] = useState<1 | 2>(1);
  const [pageContent, setPageContent] = useState<
    Record<1 | 2, { label: string; description: string }>
  >({
    1: { label: content.label, description: content.description },
    2: { label: '', description: '' }
  });

  useEffect(() => {
    const last = lastAppliedRef.current;
    if (last.label === content.label && last.description === content.description) return;
    const prevSection = prevSectionIndexRef.current;
    prevSectionIndexRef.current = sectionIndex;
    lastAppliedRef.current = { label: content.label, description: content.description };

    // Mismo workspace, distinto page: actualizar in-place sin slide. El slide
    // de 200ms+blur entre páginas del mismo workspace se acumulaba con el
    // accordion del sidebar y se sentía laggy. Lo reservamos para cambios de
    // workspace, que es donde el side-by-side aporta sentido espacial.
    if (sectionIndex === prevSection) {
      const currentSlot = slotRef.current;
      setPageContent(prev => ({
        ...prev,
        [currentSlot]: { label: content.label, description: content.description }
      }));
      return;
    }

    const forward = sectionIndex >= prevSection;
    const desired: 1 | 2 = forward ? 2 : 1;
    const current = slotRef.current;
    const nextSlot: 1 | 2 = desired === current ? (current === 1 ? 2 : 1) : desired;
    slotRef.current = nextSlot;
    setPageContent(prev => ({
      ...prev,
      [nextSlot]: { label: content.label, description: content.description }
    }));
    setSlot(nextSlot);
  }, [sectionIndex, content.label, content.description]);

  return (
    <div className="flex shrink-0 flex-col px-6 pt-5.5">
      <div className="bia-page-slide relative h-14" data-page={slot}>
        {([1, 2] as const).map(id => (
          <section key={id} className="bia-page" data-page-id={id} aria-hidden={slot !== id}>
            <div className="text-title-h5 text-text-strong-950">{pageContent[id].label}</div>
            <p className="text-paragraph-sm text-text-sub-600 mt-1 max-w-2xl">
              {pageContent[id].description}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
};
