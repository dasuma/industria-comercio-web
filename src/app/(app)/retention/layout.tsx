import type { ReactNode } from 'react';
import { getActiveLocale } from '@/i18n/getDictionary';
import { RetentionTabs } from '@modules/retention';

interface RetentionLayoutProps {
  children: ReactNode;
}

const RetentionLayout = async ({ children }: RetentionLayoutProps) => {
  const locale = await getActiveLocale();
  return (
    <div className="-mt-5 flex flex-col gap-5">
      <RetentionTabs locale={locale} />
      {children}
    </div>
  );
};

export default RetentionLayout;
