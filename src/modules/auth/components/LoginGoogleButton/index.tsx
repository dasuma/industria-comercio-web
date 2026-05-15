'use client';

import { FancyButton } from '@biaenergy/ui';
import { RiGoogleFill } from '@biaenergy/ui/icons';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { getAuthDict } from '../../dictionaries';
import type { Locale } from '@/i18n/config';
import type { AuthUser } from '../../models/auth.interface';

interface LoginGoogleButtonProps {
  locale: Locale;
  // Si se pasa, suprime el redirect default tras un signIn exitoso. El caller
  // decide qué hacer con el usuario autenticado (ej: morph a un picker).
  onSuccess?: (user: AuthUser) => void;
}

export const LoginGoogleButton = ({ locale, onSuccess }: LoginGoogleButtonProps) => {
  const dict = getAuthDict(locale);
  const { signIn, isLoading, error } = useGoogleSignIn(onSuccess ? { onSuccess } : undefined);

  return (
    <div className="flex w-full flex-col gap-2">
      <FancyButton.Root
        variant="primary"
        size="medium"
        // Loader nativo del DS: superpone un spinner cuando state='loading',
        // bloquea el ancho del botón (no salta) y oculta el contenido. No
        // necesitamos un texto "Iniciando sesión…": el spinner ya comunica
        // progreso con menos ruido visual.
        state={isLoading ? 'loading' : 'idle'}
        onClick={signIn}
        disabled={isLoading}
        className="w-full"
      >
        <FancyButton.Icon as={RiGoogleFill} />
        {dict.loginWithGoogle}
      </FancyButton.Root>
      {error && <p className="text-error-base text-paragraph-sm">{dict.loginError}</p>}
    </div>
  );
};
