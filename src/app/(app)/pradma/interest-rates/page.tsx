import { getActiveLocale } from '@/i18n/getDictionary';
import { InterestRateList } from '@modules/pradma';

const InterestRatesPage = async () => {
  const locale = await getActiveLocale();

  return <InterestRateList locale={locale} />;
};

export default InterestRatesPage;
