import { getActiveLocale } from '@/i18n/getDictionary';
import { getPradmaDict } from '@modules/pradma';

const UsersPage = async () => {
  const locale = await getActiveLocale();
  const dict = getPradmaDict(locale);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-text-strong-950 text-3xl font-semibold">{dict.users.title}</h1>
        <p className="text-text-sub-600">{dict.description}</p>
      </header>
    </section>
  );
};

export default UsersPage;
