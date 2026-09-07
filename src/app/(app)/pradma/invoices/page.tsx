import { getActiveLocale } from '@/i18n/getDictionary';
import { InvoiceList } from '@modules/pradma';

// El título lo pone el PageHeader del shell; la page solo monta el listado.
const InvoicesPage = async () => {
  const locale = await getActiveLocale();

  return <InvoiceList locale={locale} />;
};

export default InvoicesPage;
