import { getActiveLocale } from '@/i18n/getDictionary';
import { getPradmaDict, InvoiceList } from '@modules/pradma';

const InvoicesPage = async () => {
  const locale = await getActiveLocale();
  const dict = getPradmaDict(locale);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-text-strong-950 text-xl font-semibold">{dict.invoices.title}</h1>
      </div>
      <InvoiceList locale={locale} />
    </div>
  );
};

export default InvoicesPage;
