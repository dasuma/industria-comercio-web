'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FancyButton, Hint, Input, Label } from '@dasuma/pradma-ui';
import {
  RiErrorWarningFill,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiMailLine
} from '@dasuma/pradma-ui/icons';
import { useEmailSignIn } from '../../hooks/useEmailSignIn';
import { getAuthDict, type AuthDictionary } from '../../dictionaries';
import type { Locale } from '@/i18n/config';
import type { AuthUser } from '../../models/auth.interface';

interface LoginEmailFormProps {
  locale: Locale;
  // Si se pasa, suprime el redirect default tras un signIn exitoso — el caller
  // decide a dónde llevar al usuario (ej: morph al workspace picker).
  onSuccess?: (user: AuthUser) => void | Promise<void>;
}

// `useEmailSignIn` expone el `code` de Firebase (`auth/invalid-credential`, …).
// Mapeamos solo los casos accionables por el usuario; el resto cae en generic
// para no filtrar detalles del proveedor en la UI.
const resolveErrorMessage = (code: string, dict: AuthDictionary): string => {
  if (code.includes('invalid-credential') || code.includes('wrong-password')) {
    return dict.errors.invalidCredentials;
  }
  if (code.includes('user-not-found') || code.includes('invalid-email')) {
    return dict.errors.userNotFound;
  }
  if (code.includes('user-disabled')) return dict.errors.userDisabled;
  if (code.includes('too-many-requests')) return dict.errors.tooManyRequests;
  if (code.includes('network-request-failed')) return dict.errors.network;
  return dict.errors.generic;
};

export const LoginEmailForm = ({ locale, onSuccess }: LoginEmailFormProps) => {
  const dict = getAuthDict(locale);
  const { signIn, isLoading, error } = useEmailSignIn(onSuccess ? { onSuccess } : undefined);
  const [showPassword, setShowPassword] = useState(false);

  // El schema se arma acá (no a nivel módulo) porque los mensajes vienen del
  // dictionary del locale activo.
  const schema = z.object({
    email: z.string().min(1, dict.errors.emailRequired).email(dict.errors.emailInvalid),
    password: z.string().min(1, dict.errors.passwordRequired)
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = handleSubmit(values => signIn(values.email, values.password));

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="login-email">{dict.emailLabel}</Label.Root>
        <Input.Root hasError={Boolean(errors.email)}>
          <Input.Wrapper>
            <Input.Icon as={RiMailLine} />
            <Input.Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder={dict.emailPlaceholder}
              disabled={isLoading}
              {...register('email')}
            />
          </Input.Wrapper>
        </Input.Root>
        {/* [R9] el error va en pareja Input(hasError) + Hint, nunca rojo flotante */}
        {errors.email && (
          <Hint.Root hasError>
            <Hint.Icon as={RiErrorWarningFill} />
            {errors.email.message}
          </Hint.Root>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label.Root htmlFor="login-password">{dict.passwordLabel}</Label.Root>
        <Input.Root hasError={Boolean(errors.password)}>
          <Input.Wrapper>
            <Input.Icon as={RiLockLine} />
            <Input.Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={dict.passwordPlaceholder}
              disabled={isLoading}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="text-text-soft-400 hover:text-text-sub-600 shrink-0 transition-colors"
              aria-label={showPassword ? dict.hidePassword : dict.showPassword}
            >
              {showPassword ? (
                <RiEyeOffLine className="size-5" />
              ) : (
                <RiEyeLine className="size-5" />
              )}
            </button>
          </Input.Wrapper>
        </Input.Root>
        {errors.password && (
          <Hint.Root hasError>
            <Hint.Icon as={RiErrorWarningFill} />
            {errors.password.message}
          </Hint.Root>
        )}
      </div>

      {error && (
        <Hint.Root hasError>
          <Hint.Icon as={RiErrorWarningFill} />
          {resolveErrorMessage(error, dict)}
        </Hint.Root>
      )}

      {/* [R7] el submit es la acción protagonista de la pantalla → FancyButton */}
      <FancyButton.Root
        type="submit"
        size="medium"
        // Loader nativo del DS: bloquea el ancho y oculta el contenido, así no
        // hace falta un texto "Ingresando…".
        state={isLoading ? 'loading' : 'idle'}
        disabled={isLoading}
        className="w-full"
      >
        {dict.submit}
      </FancyButton.Root>
    </form>
  );
};
