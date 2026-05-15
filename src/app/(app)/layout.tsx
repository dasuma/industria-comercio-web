import type { ReactNode } from 'react';
import { getActiveLocale } from '@/i18n/getDictionary';
import { AppShell, getShellDict } from '@modules/shell';

const AppLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getActiveLocale();
  const dict = getShellDict(locale);

  return <AppShell dict={dict}>{children}</AppShell>;
};

export default AppLayout;
