import { getActiveLocale } from '@/i18n/getDictionary';
import { getPradmaDict, MigrationsWizard } from '@modules/pradma';

const MigrationsPage = async () => {
  const locale = await getActiveLocale();
  const dict = getPradmaDict(locale);

  return <MigrationsWizard dict={dict} />;
};

export default MigrationsPage;
