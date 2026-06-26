import { getActiveLocale } from '@/i18n/getDictionary';
import { SanctionList } from '@modules/pradma';

const SanctionsPage = async () => {
  const locale = await getActiveLocale();

  return <SanctionList locale={locale} />;
};

export default SanctionsPage;
