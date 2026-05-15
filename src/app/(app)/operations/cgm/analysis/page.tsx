import { getActiveLocale } from '@/i18n/getDictionary';
import { ReportTitoView } from '@modules/report-tito';

const CgmAnalysisPage = async () => {
  const locale = await getActiveLocale();
  return <ReportTitoView locale={locale} />;
};

export default CgmAnalysisPage;
