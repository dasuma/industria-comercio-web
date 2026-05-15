import { getActiveLocale } from '@/i18n/getDictionary';
import { getShellDict } from '@modules/shell';

const EnergyPage = async () => {
  const locale = await getActiveLocale();
  const dict = getShellDict(locale);
  return (
    <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
      {dict.workspaces.energy} · {dict.picker.comingSoon}
    </div>
  );
};

export default EnergyPage;
