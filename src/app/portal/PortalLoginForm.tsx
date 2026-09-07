'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FancyButton,
  Input,
  Label,
  TabMenuHorizontal
} from '@dasuma/pradma-ui';
import {
  RiErrorWarningFill,
  RiEyeLine,
  RiEyeOffLine,
  RiGoogleFill,
  RiShieldKeyholeLine
} from '@dasuma/pradma-ui/icons';
import { useGoogleSignIn, useEmailSignIn } from '@modules/auth';

type Tab = 'login' | 'recover';

const resolveError = (error: string): string => {
  if (error.includes('wrong-password') || error.includes('invalid-credential')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (error.includes('user-not-found')) {
    return 'No existe una cuenta con ese correo.';
  }
  return 'Error al iniciar sesión. Intentá de nuevo.';
};

export const PortalLoginForm = () => {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { signIn: googleSignIn, isLoading: googleLoading, error: googleError } = useGoogleSignIn();
  const { signIn: emailSignIn, isLoading: emailLoading, error: emailError } = useEmailSignIn();

  const isLoading = googleLoading || emailLoading;
  const error = googleError ?? emailError;

  const handleEmailLogin = () => {
    if (!email || !password) return;
    emailSignIn(email, password);
  };

  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 overflow-hidden rounded-2xl ring-1">
      {/* ── Header ── */}
      <div className="border-stroke-soft-200 flex items-center gap-3 border-b px-5 py-5">
        <div className="bg-bg-weak-50 text-text-sub-600 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <RiShieldKeyholeLine className="size-5" />
        </div>
        <div>
          <p className="text-text-soft-400 text-subheading-2xs uppercase">
            Portal del contribuyente
          </p>
          <h2 className="text-text-strong-950 text-label-md">Acceso seguro</h2>
        </div>
      </div>

      {/* ── Tabs + body ── */}
      <TabMenuHorizontal.Root value={tab} onValueChange={v => setTab(v as Tab)}>
        <div className="px-5 pt-4">
          <TabMenuHorizontal.List>
            <TabMenuHorizontal.Trigger value="login">Iniciar sesión</TabMenuHorizontal.Trigger>
            <TabMenuHorizontal.Trigger value="recover">Recuperar</TabMenuHorizontal.Trigger>
          </TabMenuHorizontal.List>
        </div>

        {/* ── Login ── */}
        <TabMenuHorizontal.Content value="login">
          <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
            <Button.Root
              variant="neutral"
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
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
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

            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox.Root checked={remember} onCheckedChange={v => setRemember(v === true)} />
              <span className="text-text-sub-600 text-paragraph-xs">
                Recordarme en este dispositivo
              </span>
            </label>

            {error && (
              <Alert.Root status="error" size="small">
                <Alert.Icon as={RiErrorWarningFill} />
                {resolveError(error)}
              </Alert.Root>
            )}

            <FancyButton.Root
              variant="primary"
              className="mt-1 w-full"
              onClick={handleEmailLogin}
              disabled={isLoading || !email || !password}
            >
              {emailLoading ? 'Ingresando…' : 'Ingresar'}
            </FancyButton.Root>
          </div>
        </TabMenuHorizontal.Content>

        {/* ── Recover ── */}
        <TabMenuHorizontal.Content value="recover">
          <div className="flex flex-col gap-4 px-5 pt-5 pb-6">
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
                    value={recoverEmail}
                    onChange={e => setRecoverEmail(e.target.value)}
                    placeholder="nombre@correo.com"
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <FancyButton.Root variant="primary" className="w-full" disabled={!recoverEmail}>
              Enviar enlace
            </FancyButton.Root>
          </div>
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </div>
  );
};
