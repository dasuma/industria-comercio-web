import { getActiveLocale } from '@/i18n/getDictionary';
import { CgmReportView } from '@modules/cgm-report';

const CgmReportPage = async () => {
  const locale = await getActiveLocale();

  return <CgmReportView locale={locale} />;
};

export default CgmReportPage;
