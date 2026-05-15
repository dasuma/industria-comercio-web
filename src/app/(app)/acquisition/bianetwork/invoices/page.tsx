import { getActiveLocale } from '@/i18n/getDictionary';
import { InvoicesMain } from '@modules/bianetwork';

const InvoicesPage = async () => {
  const locale = await getActiveLocale();
  return <InvoicesMain locale={locale} />;
};

export default InvoicesPage;
