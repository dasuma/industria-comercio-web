import { getActiveLocale } from '@/i18n/getDictionary';
import { CgmAnalysisView } from '@modules/cgm-analysis';

const CgmAnalysisPage = async () => {
  const locale = await getActiveLocale();
  return <CgmAnalysisView locale={locale} />;
};

export default CgmAnalysisPage;
