'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, TabMenuHorizontal } from '@biaenergy/ui';
import { APP_ROUTES } from '@/config/routes';
import type { Locale } from '@/i18n/config';
import { getBianetworkDict } from '../../dictionaries';
import { useBiaNetworkPendingCounts } from '../../data/pendingCounts/useBiaNetworkPendingCounts';

type TabKey = 'users' | 'usersPro' | 'accounts' | 'transactions' | 'invoices';

interface TabDef {
  key: TabKey;
  href: string;
  labelKey: keyof ReturnType<typeof getBianetworkDict>['tabs'];
  countKey: keyof ReturnType<typeof useBiaNetworkPendingCounts>;
}

const TABS: readonly TabDef[] = [
  { key: 'users', href: APP_ROUTES.users, labelKey: 'users', countKey: 'users' },
  { key: 'usersPro', href: APP_ROUTES.usersPro, labelKey: 'users_pro', countKey: 'usersPro' },
  { key: 'accounts', href: APP_ROUTES.accounts, labelKey: 'accounts', countKey: 'accounts' },
  {
    key: 'transactions',
    href: APP_ROUTES.transactions,
    labelKey: 'transactions',
    countKey: 'transactions'
  },
  { key: 'invoices', href: APP_ROUTES.invoices, labelKey: 'invoices', countKey: 'invoices' }
];

interface BiaNetworkTabsProps {
  locale: Locale;
}

export const BiaNetworkTabs = ({ locale }: BiaNetworkTabsProps) => {
  const dict = getBianetworkDict(locale);
  const pathname = usePathname() ?? '';
  const counts = useBiaNetworkPendingCounts();

  const activeTab =
    TABS.find(tab => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.key ?? 'users';

  return (
    <TabMenuHorizontal.Root value={activeTab}>
      <TabMenuHorizontal.List className="!border-t-0 pl-3">
        {TABS.map(tab => {
          const count = counts[tab.countKey];
          return (
            <TabMenuHorizontal.Trigger key={tab.key} value={tab.key} asChild>
              <Link href={tab.href} prefetch className="flex items-center gap-2">
                <span>{dict.tabs[tab.labelKey]}</span>
                {count > 0 && (
                  <Badge.Root variant="lighter" color="orange" size="small">
                    {count}
                  </Badge.Root>
                )}
              </Link>
            </TabMenuHorizontal.Trigger>
          );
        })}
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  );
};
