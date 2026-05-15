'use client';

import { useRouter } from 'next/navigation';
import { Dropdown } from '@biaenergy/ui';
import { RiExpandUpDownLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { firstHrefInWorkspace, workspaces } from '../../models/workspaces.config';
import type { Workspace } from '../../models/nav.interface';
import type { WorkspaceKey } from '../../models/nav.types';
import type { ShellDictionary } from '../../dictionaries';
import { useShellUiStore, selectSidebarCollapsed } from '../../store/ui.store';
import { useTabsStore } from '../../store/tabs.store';

interface WorkspaceSwitcherProps {
  active: Workspace;
  dict: ShellDictionary;
}

export const WorkspaceSwitcher = ({ active, dict }: WorkspaceSwitcherProps) => {
  const router = useRouter();
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const syncActiveRoute = useTabsStore(state => state.syncActiveRoute);

  const ActiveIcon = active.iconFill;

  const handleSelect = (workspaceId: WorkspaceKey) => {
    if (workspaceId === active.id) return;
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace) return;
    const href = firstHrefInWorkspace(workspace);
    syncActiveRoute(workspaceId, href);
    router.push(href);
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          type="button"
          aria-label={dict.switchSection}
          className="group dark:hover:bg-bg-white-0/60 flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-1.5 transition outline-none hover:bg-neutral-200/70"
        >
          <span className="glass-popup text-text-strong-950 inline-flex size-7 shrink-0 items-center justify-center rounded-lg">
            <ActiveIcon className="size-4" />
          </span>
          <span
            className={cn(
              '!text-label-md text-text-strong-950 flex-1 truncate text-left transition-opacity duration-200',
              collapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            {dict.workspaces[active.id]}
          </span>
          <RiExpandUpDownLine
            className={cn(
              'text-text-soft-400 group-hover:text-text-sub-600 size-4 shrink-0 transition-[opacity,color] duration-200',
              collapsed ? 'opacity-0' : 'opacity-100'
            )}
            aria-hidden
          />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content align="start" sideOffset={6} className="min-w-[220px]">
        <Dropdown.Label>{dict.switchSection}</Dropdown.Label>
        {workspaces.map(workspace => (
          <Dropdown.Item key={workspace.id} onSelect={() => handleSelect(workspace.id)}>
            <Dropdown.ItemIcon as={workspace.iconLine} />
            {dict.workspaces[workspace.id]}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
