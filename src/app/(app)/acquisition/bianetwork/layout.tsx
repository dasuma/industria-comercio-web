import type { ReactNode } from 'react';
import { getActiveLocale } from '@/i18n/getDictionary';
import { BiaNetworkTabs } from '@modules/bianetwork';

interface BiaNetworkLayoutProps {
  children: ReactNode;
}

const BiaNetworkLayout = async ({ children }: BiaNetworkLayoutProps) => {
  const locale = await getActiveLocale();
  return (
    // gap-5 (20px) — espaciado simétrico arriba y abajo de la fila de
    // filtros, mismo valor que el inner gap de UsersMain etc.
    <div className="-mt-5 flex flex-col gap-5">
      <BiaNetworkTabs locale={locale} />
      {children}
    </div>
  );
};

export default BiaNetworkLayout;
