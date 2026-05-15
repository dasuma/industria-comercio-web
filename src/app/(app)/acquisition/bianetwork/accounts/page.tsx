import { getActiveLocale } from '@/i18n/getDictionary';
import { AccountsMain } from '@modules/bianetwork';

const AccountsPage = async () => {
  const locale = await getActiveLocale();
  return <AccountsMain locale={locale} />;
};

export default AccountsPage;
