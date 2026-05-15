'use client';

import { Button } from '@biaenergy/ui';
import { RiLogoutBoxRLine } from '@biaenergy/ui/icons';
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
    <Button.Root variant="neutral" mode="stroke" size="small" onClick={logout} disabled={isLoading}>
      <Button.Icon as={RiLogoutBoxRLine} />
      {isLoading ? dict.signingOut : dict.logout}
    </Button.Root>
  );
};
