import { getActiveLocale } from '@/i18n/getDictionary';
import { DiscountList } from '@modules/pradma';

const DiscountsPage = async () => {
  const locale = await getActiveLocale();

  return <DiscountList locale={locale} />;
};

export default DiscountsPage;
