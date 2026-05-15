'use client';

import { useState, useTransition, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TabMenuHorizontal } from '@biaenergy/ui';
import { APP_ROUTES } from '@/config/routes';
import type { Locale } from '@/i18n/config';
import { getRetentionDict } from '../../dictionaries';

type TabKey = 'contracts';

interface TabDef {
  key: TabKey;
  href: string;
  labelKey: keyof ReturnType<typeof getRetentionDict>['tabs'];
}

const TABS: readonly TabDef[] = [
  { key: 'contracts', href: APP_ROUTES.retentionContracts, labelKey: 'contracts' }
];

interface RetentionTabsProps {
  locale: Locale;
}

const resolveTabFromPath = (pathname: string): TabKey =>
  TABS.find(tab => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.key ??
  'contracts';

export const RetentionTabs = ({ locale }: RetentionTabsProps) => {
  const dict = getRetentionDict(locale);
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [, startTransition] = useTransition();

  const tabFromPath = resolveTabFromPath(pathname);
  const [optimisticTab, setOptimisticTab] = useState<TabKey | null>(null);
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setOptimisticTab(null);
  }
  const activeTab = optimisticTab ?? tabFromPath;

  const handleTabClick = (event: MouseEvent<HTMLAnchorElement>, tab: TabDef): void => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();
    if (tab.key === activeTab) return;
    setOptimisticTab(tab.key);
    startTransition(() => router.push(tab.href));
  };

  return (
    <TabMenuHorizontal.Root value={activeTab}>
      <TabMenuHorizontal.List className="!border-t-0 pl-3">
        {TABS.map(tab => (
          <TabMenuHorizontal.Trigger key={tab.key} value={tab.key} asChild>
            <Link href={tab.href} prefetch onClick={event => handleTabClick(event, tab)}>
              {dict.tabs[tab.labelKey]}
            </Link>
          </TabMenuHorizontal.Trigger>
        ))}
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  );
};
