'use client';

import { Kbd, Tooltip } from '@biaenergy/ui';
import { RiSearchLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { ShellDictionary } from '../../dictionaries';
import { selectSetSearchOpen, selectSidebarCollapsed, useShellUiStore } from '../../store/ui.store';

interface SearchButtonProps {
  dict: ShellDictionary['search'];
}

export const SearchButton = ({ dict }: SearchButtonProps) => {
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const setSearchOpen = useShellUiStore(selectSetSearchOpen);

  return (
    <div className="flex h-10 shrink-0 items-center px-2">
      <Tooltip.Root open={collapsed ? undefined : false}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={dict.label}
            className="group bg-bg-white-0 text-paragraph-sm shadow-regular-xs ring-stroke-soft-200 hover:ring-stroke-sub-300/60 focus-visible:ring-stroke-strong-950 flex h-8 w-full cursor-pointer items-center gap-1.5 rounded-lg px-2 ring-1 transition-shadow outline-none ring-inset"
          >
            <RiSearchLine className="text-text-soft-400 group-hover:text-text-sub-600 size-5 shrink-0 transition-colors" />
            <span
              className={cn(
                'text-text-soft-400 group-hover:text-text-sub-600 flex-1 truncate text-left transition-[opacity,color] duration-200',
                collapsed ? 'opacity-0' : 'opacity-100'
              )}
            >
              {dict.placeholder}
            </span>
            <span
              className={cn(
                'shrink-0 transition-opacity duration-200',
                collapsed ? 'opacity-0' : 'opacity-100'
              )}
            >
              <Kbd.Root>{dict.shortcut}</Kbd.Root>
            </span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={8}>
          {`${dict.label} (${dict.shortcut})`}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};
