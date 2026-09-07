'use client';

import { Button } from '@dasuma/pradma-ui';
import { RiLogoutBoxRLine } from '@dasuma/pradma-ui/icons';
import { useLogout } from '../../hooks/useLogout';
import { getAuthDict } from '../../dictionaries';
import type { Locale } from '@/i18n/config';

interface LogoutButtonProps {
  locale: Locale;
}

export const LogoutButton = ({ locale }: LogoutButtonProps) => {
  const dict = getAuthDict(locale);
  const { logout, isLoading } = useLogout();

  return (
    <Button.Root variant="basic" size="small" onClick={logout} disabled={isLoading}>
      <Button.Icon as={RiLogoutBoxRLine} />
      {isLoading ? dict.signingOut : dict.logout}
    </Button.Root>
  );
};
