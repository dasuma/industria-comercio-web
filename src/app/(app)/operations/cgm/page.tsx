import { getActiveLocale } from '@/i18n/getDictionary';
import { getShellDict } from '@modules/shell';

const CgmPage = async () => {
  const locale = await getActiveLocale();
  const dict = getShellDict(locale);

  return (
    <section className="space-y-2">
      <h1 className="text-title-h5 text-text-strong-950">{dict.items.cgm}</h1>
      <p className="text-paragraph-sm text-text-sub-600">
        {dict.workspaces.operations} · {dict.items.cgm}
      </p>
    </section>
  );
};

export default CgmPage;
