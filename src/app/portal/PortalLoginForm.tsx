'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  FancyButton,
  Input,
  Label,
  LinkButton,
  TabMenuHorizontal,
  toast
} from '@dasuma/pradma-ui';
import {
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiEyeLine,
  RiEyeOffLine,
  RiGoogleFill,
  RiShieldKeyholeLine,
  RiUserFollowLine
} from '@dasuma/pradma-ui/icons';
import { useAuth } from '@/auth/useAuth';
import { useGoogleSignIn, useEmailSignIn, useLogout, usePasswordReset } from '@modules/auth';

type Tab = 'login' | 'recover';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resolveError = (error: string): string => {
  if (error.includes('wrong-password') || error.includes('invalid-credential')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (error.includes('user-not-found')) {
    return 'No existe una cuenta con ese correo.';
  }
  return 'Error al iniciar sesión. Intentá de nuevo.';
};

const PortalHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="border-stroke-soft-200 flex items-center gap-3 border-b px-5 py-5">
    <div className="bg-bg-weak-50 text-text-sub-600 flex size-10 shrink-0 items-center justify-center rounded-xl">
      <RiShieldKeyholeLine className="size-5" />
    </div>
    <div>
      <p className="text-text-soft-400 text-subheading-2xs uppercase">{subtitle}</p>
      <h2 className="text-text-strong-950 text-label-md">{title}</h2>
    </div>
  </div>
);

// Card que reemplaza al form cuando ya hay sesión. El portal no tiene área
// privada todavía, así que el login no redirige a ningún lado: confirma la
// sesión y ofrece el simulador y cerrar sesión.
const SignedInCard = ({ email }: { email: string }) => {
  const { logout, isLoading } = useLogout();
  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 overflow-hidden rounded-2xl ring-1">
      <PortalHeader subtitle="Portal del contribuyente" title="Sesión iniciada" />
      <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
        <Alert.Root status="success" size="small">
          <Alert.Icon as={RiUserFollowLine} />
          <span className="truncate">{email}</span>
        </Alert.Root>
        <LinkButton.Root variant="primary" asChild>
          <Link href="/portal/simular">
            Ir al simulador de liquidación
            <RiArrowRightLine className="size-4" />
          </Link>
        </LinkButton.Root>
        <Button.Root
          variant="basic"
          className="w-full"
          onClick={() => void logout()}
          disabled={isLoading}
        >
          {isLoading ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </Button.Root>
      </div>
    </div>
  );
};

export const PortalLoginForm = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sin redirect: el ciudadano se queda en el portal (antes caía en el admin).
  const onSuccess = () => {
    toast.success('Sesión iniciada correctamente.');
  };
  const {
    signIn: googleSignIn,
    isLoading: googleLoading,
    error: googleError
  } = useGoogleSignIn({ onSuccess });
  const {
    signIn: emailSignIn,
    isLoading: emailLoading,
    error: emailError
  } = useEmailSignIn({ onSuccess });
  const {
    sendReset,
    isLoading: resetLoading,
    isSent: resetSent,
    error: resetError
  } = usePasswordReset();

  const isLoading = googleLoading || emailLoading;
  const error = googleError ?? emailError;
  const recoverEmailValid = EMAIL_RE.test(recoverEmail.trim());

  if (user?.email) return <SignedInCard email={user.email} />;

  const handleEmailLogin = () => {
    if (!email || !password) return;
    emailSignIn(email, password);
  };

  const handleReset = () => {
    if (!recoverEmailValid) return;
    void sendReset(recoverEmail.trim());
  };

  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 overflow-hidden rounded-2xl ring-1">
      <PortalHeader subtitle="Portal del contribuyente" title="Acceso seguro" />

      <TabMenuHorizontal.Root value={tab} onValueChange={v => setTab(v as Tab)}>
        <div className="px-5 pt-4">
          <TabMenuHorizontal.List>
            <TabMenuHorizontal.Trigger value="login">Iniciar sesión</TabMenuHorizontal.Trigger>
            <TabMenuHorizontal.Trigger value="recover">Recuperar</TabMenuHorizontal.Trigger>
          </TabMenuHorizontal.List>
        </div>

        {/* ── Login ── */}
        <TabMenuHorizontal.Content value="login">
          <form
            className="flex flex-col gap-4 px-5 pt-5 pb-6"
            noValidate
            onSubmit={e => {
              e.preventDefault();
              handleEmailLogin();
            }}
          >
            <Button.Root
              type="button"
              variant="basic"
              mode="stroke"
              className="w-full"
              onClick={googleSignIn}
              disabled={isLoading}
            >
              <Button.Icon as={RiGoogleFill} />
              {googleLoading ? 'Conectando…' : 'Continuar con Google'}
            </Button.Root>

            <div className="flex items-center gap-3">
              <div className="bg-stroke-soft-200 h-px flex-1" />
              <span className="text-text-soft-400 text-paragraph-xs">o continúa con correo</span>
              <div className="bg-stroke-soft-200 h-px flex-1" />
            </div>

            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="p-email">Correo electrónico</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="p-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="p-password">Contraseña</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="p-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="text-text-soft-400 hover:text-text-sub-600 shrink-0 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="size-5" />
                    ) : (
                      <RiEyeLine className="size-5" />
                    )}
                  </button>
                </Input.Wrapper>
              </Input.Root>
            </div>

            {error && (
              <Alert.Root status="error" size="small">
                <Alert.Icon as={RiErrorWarningFill} />
                {resolveError(error)}
              </Alert.Root>
            )}

            {/* [R7] única primary del card */}
            <FancyButton.Root
              type="submit"
              className="mt-1 w-full"
              state={emailLoading ? 'loading' : 'idle'}
              disabled={isLoading || !email || !password}
            >
              Ingresar
            </FancyButton.Root>
          </form>
        </TabMenuHorizontal.Content>

        {/* ── Recover ── */}
        <TabMenuHorizontal.Content value="recover">
          <form
            className="flex flex-col gap-4 px-5 pt-5 pb-6"
            noValidate
            onSubmit={e => {
              e.preventDefault();
              handleReset();
            }}
          >
            <p className="text-text-sub-600 text-paragraph-xs leading-relaxed">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="p-recover-email">Correo electrónico</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="p-recover-email"
                    type="email"
                    autoComplete="email"
                    value={recoverEmail}
                    onChange={e => setRecoverEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            {resetSent && (
              <Alert.Root status="success" size="small">
                <Alert.Icon as={RiCheckboxCircleFill} />
                Te enviamos un enlace a tu correo. Revisá también la carpeta de spam.
              </Alert.Root>
            )}
            {resetError && (
              <Alert.Root status="error" size="small">
                <Alert.Icon as={RiErrorWarningFill} />
                No pudimos enviar el enlace. Verificá el correo e intentá de nuevo.
              </Alert.Root>
            )}

            <FancyButton.Root
              type="submit"
              className="w-full"
              state={resetLoading ? 'loading' : 'idle'}
              disabled={!recoverEmailValid || resetLoading}
            >
              Enviar enlace
            </FancyButton.Root>
          </form>
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </div>
  );
};
