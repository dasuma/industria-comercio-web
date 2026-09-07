'use client';

import { Button } from '@dasuma/pradma-ui';
import { RiGoogleFill } from '@dasuma/pradma-ui/icons';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { getAuthDict } from '../../dictionaries';
import type { Locale } from '@/i18n/config';
import type { AuthUser } from '../../models/auth.interface';

interface LoginGoogleButtonProps {
  locale: Locale;
  // Si se pasa, suprime el redirect default tras un signIn exitoso. El caller
  // decide qué hacer con el usuario autenticado (ej: morph a un picker).
  onSuccess?: (user: AuthUser) => void;
  disabled?: boolean;
}

export const LoginGoogleButton = ({ locale, onSuccess, disabled }: LoginGoogleButtonProps) => {
  const dict = getAuthDict(locale);
  const { signIn, isLoading, error } = useGoogleSignIn(onSuccess ? { onSuccess } : undefined);

  return (
    <div className="flex w-full flex-col gap-2">
      {/* [R7] el protagonista del login ahora es el submit email+password
          (FancyButton); Google pasa a acción secundaria → Button stroke. */}
      <Button.Root
        variant="neutral"
        mode="stroke"
        size="medium"
        onClick={signIn}
        disabled={isLoading || disabled}
        className="w-full"
      >
        <Button.Icon as={RiGoogleFill} />
        {dict.loginWithGoogle}
      </Button.Root>
      {error && <p className="text-error-base text-paragraph-sm">{dict.loginError}</p>}
    </div>
  );
};
