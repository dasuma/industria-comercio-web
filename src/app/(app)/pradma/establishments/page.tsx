import { getActiveLocale } from '@/i18n/getDictionary';
import { EstablishmentList } from '@modules/pradma';

const EstablishmentsPage = async () => {
  const locale = await getActiveLocale();

  return <EstablishmentList locale={locale} />;
};

export default EstablishmentsPage;
