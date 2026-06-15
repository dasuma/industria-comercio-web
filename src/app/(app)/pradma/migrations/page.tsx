import { getActiveLocale } from '@/i18n/getDictionary';
import { getPradmaDict, MigrationsWizard } from '@modules/pradma';

const MigrationsPage = async () => {
  const locale = await getActiveLocale();
  const dict = getPradmaDict(locale);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-text-strong-950 text-3xl font-semibold">{dict.migrations.title}</h1>
        <p className="text-text-sub-600">{dict.description}</p>
      </header>

      <MigrationsWizard dict={dict} />
    </section>
  );
};

export default MigrationsPage;
