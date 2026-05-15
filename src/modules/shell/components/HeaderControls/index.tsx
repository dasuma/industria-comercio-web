'use client';

import { CompactButton } from '@biaenergy/ui';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMenuLine,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine
} from '@biaenergy/ui/icons';
import type { ShellDictionary } from '../../dictionaries';
import {
  selectSetMobileNavOpen,
  selectSidebarCollapsed,
  selectToggleSidebar,
  useShellUiStore
} from '../../store/ui.store';
import { useViewport } from '../../hooks/useViewport';

interface HeaderControlsProps {
  dict: ShellDictionary['actions'];
}

export const HeaderControls = ({ dict }: HeaderControlsProps) => {
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const toggleSidebar = useShellUiStore(selectToggleSidebar);
  const setMobileNavOpen = useShellUiStore(selectSetMobileNavOpen);
  const { isMobile } = useViewport();

  const ToggleIcon = isMobile ? RiMenuLine : collapsed ? RiSidebarUnfoldLine : RiSidebarFoldLine;
  const toggleAriaLabel = isMobile
    ? dict.openNav
    : collapsed
      ? dict.sidebarExpand
      : dict.sidebarCollapse;

  return (
    <div className="flex shrink-0 items-center gap-0.5 pt-1">
      <CompactButton.Root
        variant="ghost"
        size="large"
        onClick={() => {
          if (isMobile) setMobileNavOpen(true);
          else toggleSidebar();
        }}
        aria-label={toggleAriaLabel}
        className="!text-text-soft-400 hover:!text-text-sub-600"
      >
        <CompactButton.Icon as={ToggleIcon} />
      </CompactButton.Root>
      <CompactButton.Root
        variant="ghost"
        size="large"
        aria-label={dict.back}
        disabled
        className="!text-text-soft-400 hover:!text-text-sub-600 !hidden sm:!inline-flex"
      >
        <CompactButton.Icon as={RiArrowLeftSLine} />
      </CompactButton.Root>
      <CompactButton.Root
        variant="ghost"
        size="large"
        aria-label={dict.forward}
        disabled
        className="!text-text-soft-400 hover:!text-text-sub-600 !hidden sm:!inline-flex"
      >
        <CompactButton.Icon as={RiArrowRightSLine} />
      </CompactButton.Root>
    </div>
  );
};
