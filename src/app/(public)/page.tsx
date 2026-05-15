import { defaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { LoginCard } from '@modules/auth';

// Login es pre-auth: el usuario no eligió locale todavía. Forzamos defaultLocale
// (es) para que toda la pantalla sea Spanish-first independientemente del
// accept-language del browser.
const LoginPage = async () => {
  const dict = await getDictionary(defaultLocale);

  return (
    <LoginCard
      locale={defaultLocale}
      homeTitle={dict.home.title}
      homeSubtitle={dict.home.subtitle}
    />
  );
};

export default LoginPage;
