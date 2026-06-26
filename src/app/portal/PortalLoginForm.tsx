'use client';

import { useState } from 'react';
import { useGoogleSignIn, useEmailSignIn } from '@modules/auth';

type Tab = 'login' | 'recover';

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const inputClass =
  'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all';
const inputStyle = { borderColor: '#e2e8f0', background: '#f8fafc' };

const useInputFocus = () => ({
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#1e4799';
    e.target.style.boxShadow = '0 0 0 3px rgba(30,71,153,0.1)';
    e.target.style.background = '#fff';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#f8fafc';
  }
});

export const PortalLoginForm = () => {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const inputFocus = useInputFocus();

  const { signIn: googleSignIn, isLoading: googleLoading, error: googleError } = useGoogleSignIn();
  const { signIn: emailSignIn, isLoading: emailLoading, error: emailError } = useEmailSignIn();

  const isLoading = googleLoading || emailLoading;
  const error = googleError ?? emailError;

  const handleEmailLogin = () => {
    if (!email || !password) return;
    emailSignIn(email, password);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'login', label: 'Iniciar sesión' },
    { key: 'recover', label: 'Recuperar contraseña' }
  ];

  return (
    <div
      className="w-full overflow-hidden rounded-2xl"
      style={{
        background: '#ffffff',
        boxShadow:
          '0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 32px -4px rgba(0,0,0,0.12)'
      }}
    >
      {/* ── Brand strip ── */}
      <div
        className="relative overflow-hidden px-7 pt-7 pb-6"
        style={{ background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-300">Portal del contribuyente</p>
            <h2 className="text-base font-bold text-white">Acceso seguro</h2>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="px-5 pt-5">
        <div className="flex rounded-xl p-1" style={{ background: '#f1f5f9' }}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="relative flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200"
              style={
                tab === key
                  ? {
                      background: '#ffffff',
                      color: '#1e4799',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                    }
                  : { color: '#64748b' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pt-5 pb-6">
        {tab === 'login' && (
          <div className="flex flex-col gap-4">
            {/* Google */}
            <button
              type="button"
              onClick={googleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-60"
              style={{ borderColor: '#e2e8f0' }}
            >
              <GoogleIcon />
              {googleLoading ? 'Conectando…' : 'Continuar con Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: '#e2e8f0' }} />
              <span className="text-xs text-slate-400">o continúa con correo</span>
              <div className="h-px flex-1" style={{ background: '#e2e8f0' }} />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="p-email" className="text-xs font-semibold text-slate-600">
                Correo electrónico
              </label>
              <input
                id="p-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className={inputClass}
                style={inputStyle}
                {...inputFocus}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="p-password" className="text-xs font-semibold text-slate-600">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="p-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
                  placeholder="••••••••"
                  className={inputClass}
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  {...inputFocus}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex cursor-pointer items-center gap-2.5">
              <div
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all"
                style={{
                  background: remember ? '#1e4799' : '#fff',
                  border: remember ? '2px solid #1e4799' : '2px solid #cbd5e1'
                }}
                onClick={() => setRemember(v => !v)}
              >
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-slate-500">Recordarme en este dispositivo</span>
            </label>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg px-3 py-2 text-xs text-red-700"
                style={{ background: '#fef2f2' }}
              >
                {error.includes('wrong-password') || error.includes('invalid-credential')
                  ? 'Correo o contraseña incorrectos.'
                  : error.includes('user-not-found')
                    ? 'No existe una cuenta con ese correo.'
                    : 'Error al iniciar sesión. Intentá de nuevo.'}
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleEmailLogin}
              disabled={isLoading || !email || !password}
              className="mt-1 w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)',
                boxShadow: '0 4px 14px rgba(30,71,153,0.35)'
              }}
            >
              {emailLoading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </div>
        )}

        {tab === 'recover' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-slate-500">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="p-recover-email" className="text-xs font-semibold text-slate-600">
                Correo electrónico
              </label>
              <input
                id="p-recover-email"
                type="email"
                value={recoverEmail}
                onChange={e => setRecoverEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className={inputClass}
                style={inputStyle}
                {...inputFocus}
              />
            </div>
            <button
              type="button"
              disabled={!recoverEmail}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)',
                boxShadow: '0 4px 14px rgba(30,71,153,0.35)'
              }}
            >
              Enviar enlace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
