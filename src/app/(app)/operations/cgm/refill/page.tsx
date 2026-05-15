import { getActiveLocale } from '@/i18n/getDictionary';
import { CgmRefillView } from '@modules/cgm-refill';

const CgmRefillPage = async () => {
  const locale = await getActiveLocale();

  return <CgmRefillView locale={locale} />;
};

export default CgmRefillPage;
