import { getActiveLocale } from '@/i18n/getDictionary';
import { UsersMain } from '@modules/bianetwork';

const UsersPage = async () => {
  const locale = await getActiveLocale();
  return <UsersMain locale={locale} />;
};

export default UsersPage;
