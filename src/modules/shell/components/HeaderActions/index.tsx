'use client';

import { CompactButton, FancyButton } from '@biaenergy/ui';
import { RiHistoryLine, RiSparkling2Fill } from '@biaenergy/ui/icons';
import type { ShellDictionary } from '../../dictionaries';

interface HeaderActionsProps {
  dict: ShellDictionary['actions'];
}

export const HeaderActions = ({ dict }: HeaderActionsProps) => {
  return (
    <div className="flex shrink-0 items-center gap-2 pt-1 pl-1">
      <CompactButton.Root
        variant="ghost"
        size="large"
        aria-label={dict.history}
        disabled
        className="!text-text-soft-400 hover:!text-text-sub-600 !hidden sm:!inline-flex"
      >
        <CompactButton.Icon as={RiHistoryLine} />
      </CompactButton.Root>
      <FancyButton.Root
        variant="basic"
        size="xxsmall"
        aria-label={dict.aiAssistant}
        className="group mr-1.5 !w-7 !px-0"
      >
        <FancyButton.Icon
          as={RiSparkling2Fill}
          className="!size-[18px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.45,0.64,1)] group-hover:scale-125 group-hover:rotate-[20deg]"
        />
      </FancyButton.Root>
    </div>
  );
};
