import { getActiveLocale } from '@/i18n/getDictionary';
import { ContractsView } from '@modules/retention';

const RetentionContractsPage = async () => {
  const locale = await getActiveLocale();
  return <ContractsView locale={locale} />;
};

export default RetentionContractsPage;
