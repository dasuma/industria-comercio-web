'use client';

import { cn } from '@/utils/cn';
import type { ShellDictionary } from '../../dictionaries';
import type { Workspace } from '../../models/nav.interface';
import { selectSidebarCollapsed, useShellUiStore } from '../../store/ui.store';
import { HeaderActions } from '../HeaderActions';
import { HeaderControls } from '../HeaderControls';
import { TabsStrip } from '../TabsStrip';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

interface AppHeaderProps {
  workspace: Workspace;
  dict: ShellDictionary;
}

export const AppHeader = ({ workspace, dict }: AppHeaderProps) => {
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const ActiveIcon = workspace.iconFill;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2">
      <div
        className={cn(
          'bia-resize hidden shrink-0 items-center overflow-x-clip px-1.5 pt-1 sm:flex',
          collapsed ? 'w-[52px]' : 'w-60'
        )}
      >
        <WorkspaceSwitcher active={workspace} dict={dict} />
      </div>

      <HeaderControls dict={dict.actions} />

      <TabsStrip dict={dict} />

      <div className="flex min-w-0 flex-1 items-center justify-center pt-1 sm:hidden">
        <span className="glass-popup text-text-strong-950 inline-flex size-7 shrink-0 items-center justify-center rounded-lg">
          <ActiveIcon className="size-4" />
        </span>
      </div>

      <HeaderActions dict={dict.actions} />
    </header>
  );
};
