import { getActiveLocale } from '@/i18n/getDictionary';
import { UsersProMain } from '@modules/bianetwork';

const UsersProPage = async () => {
  const locale = await getActiveLocale();
  return <UsersProMain locale={locale} />;
};

export default UsersProPage;
