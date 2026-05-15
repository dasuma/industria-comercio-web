'use client';

import { useState, useTransition, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

const resolveTabFromPath = (pathname: string): TabKey =>
  TABS.find(tab => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.key ?? 'users';

export const BiaNetworkTabs = ({ locale }: BiaNetworkTabsProps) => {
  const dict = getBianetworkDict(locale);
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const counts = useBiaNetworkPendingCounts();
  const [, startTransition] = useTransition();

  // El value de TabMenuHorizontal viene de `pathname`, pero pathname solo se
  // actualiza cuando Next termina la navegación (~200-400ms con prefetch).
  // Para que el indicador del tab se mueva en el mismo frame del click,
  // mantenemos un `optimisticTab` que se setea sincrónicamente en el handler.
  // Cuando el pathname llega al destino, lo descartamos via "setState during
  // render" (patrón canónico de derived-state-from-props — no effect).
  const tabFromPath = resolveTabFromPath(pathname);
  const [optimisticTab, setOptimisticTab] = useState<TabKey | null>(null);
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setOptimisticTab(null);
  }
  const activeTab = optimisticTab ?? tabFromPath;

  const handleTabClick = (event: MouseEvent<HTMLAnchorElement>, tab: TabDef): void => {
    // Modificadores del teclado (cmd/ctrl/middle-click) → dejá que el Link
    // haga su cosa nativa (nueva pestaña).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();
    if (tab.key === activeTab) return;
    setOptimisticTab(tab.key);
    startTransition(() => router.push(tab.href));
  };

  return (
    <TabMenuHorizontal.Root value={activeTab}>
      <TabMenuHorizontal.List className="!border-t-0 pl-3">
        {TABS.map(tab => {
          const count = counts[tab.countKey];
          return (
            <TabMenuHorizontal.Trigger key={tab.key} value={tab.key} asChild>
              <Link
                href={tab.href}
                prefetch
                onClick={event => handleTabClick(event, tab)}
                className="flex items-center gap-2"
              >
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
