import { getActiveLocale } from '@/i18n/getDictionary';
import { ExampleForm, ExampleList, getExampleDict } from '@modules/example';

const ExamplesPage = async () => {
  const locale = await getActiveLocale();
  const dict = getExampleDict(locale);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-text-strong-950 text-3xl font-semibold">{dict.title}</h1>
        <p className="text-text-sub-600">{dict.description}</p>
      </header>

      <ExampleForm locale={locale} />

      <ExampleList locale={locale} />
    </section>
  );
};

export default ExamplesPage;
