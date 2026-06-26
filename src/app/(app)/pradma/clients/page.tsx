import { getActiveLocale } from '@/i18n/getDictionary';
import { ClientList } from '@modules/pradma';

const ClientsPage = async () => {
  const locale = await getActiveLocale();

  return <ClientList locale={locale} />;
};

export default ClientsPage;
