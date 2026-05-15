import { getActiveLocale } from '@/i18n/getDictionary';
import { TransactionsMain } from '@modules/bianetwork';

const TransactionsPage = async () => {
  const locale = await getActiveLocale();
  return <TransactionsMain locale={locale} />;
};

export default TransactionsPage;
