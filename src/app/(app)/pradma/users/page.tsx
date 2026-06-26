import { getActiveLocale } from '@/i18n/getDictionary';
import { UserList } from '@modules/pradma';

const UsersPage = async () => {
  const locale = await getActiveLocale();

  return <UserList locale={locale} />;
};

export default UsersPage;
