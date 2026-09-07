'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  firstHrefInWorkspace,
  getShellDict,
  getWorkspaceById,
  WorkspacePicker
} from '@modules/shell';
import type { WorkspaceKey } from '@modules/shell';
import type { Locale } from '@/i18n/config';
import { PradmaLogo } from '@/components/PradmaLogo';
import { cn } from '@/utils/cn';
import { LoginGoogleButton } from '../LoginGoogleButton';
import { LoginEmailForm } from '../LoginEmailForm';
import { getAuthDict } from '../../dictionaries';

interface LoginCardProps {
  locale: Locale;
  homeTitle: string;
  homeSubtitle: string;
}

// Phase machine — same 4-phase morph as before.
//   login → fading → expanding → picker
type Phase = 'login' | 'fading' | 'expanding' | 'picker';

const POST_AUTH_HOLD_MS = 2000;
const LOGIN_FADE_OUT_MS = 220;
// Desde que el login es email+password, el bloque de credenciales mide casi lo
// mismo que el picker: el card ya no crece al morphear, así que la fase de
// expansión es un beat corto de crossfade y no una animación de altura larga
// (con los 760ms originales quedaba un card vacío en pantalla).
const CARD_EXPAND_MS = 320;

// Solid white card — login content + picker live at the same horizontal width.
// Min-heights tuned to natural content sizes at p-10 (padding: 40px):
//   Login: brand(148) + divider + form(2 campos × 64 + submit 40 + gaps) +
//   divider "o"(17) + Google(40) + padding-y(80) ≈ 580px → 36rem
//   Picker: title(28) + sub(20) + gap-5(20) + 1 card × 52px + padding-y(80) → flexible. 36rem allows comfortable content.
// Ambos comparten altura para que el card quede estable durante el morph.
const LOGIN_MIN_HEIGHT_REM = '36rem';
const PICKER_MIN_HEIGHT_REM = '36rem';

const SWIFT_OUT = 'cubic-bezier(0.32, 0.72, 0, 1)';

const wait = (ms: number): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

export const LoginCard = ({ locale, homeTitle, homeSubtitle }: LoginCardProps) => {
  const router = useRouter();
  const shellDict = getShellDict(locale);
  const authDict = getAuthDict(locale);

  const [phase, setPhase] = useState<Phase>('login');

  const handleLoginSuccess = useCallback(async () => {
    await wait(POST_AUTH_HOLD_MS);
    setPhase('fading');
    await wait(LOGIN_FADE_OUT_MS);
    setPhase('expanding');
    await wait(CARD_EXPAND_MS);
    setPhase('picker');
  }, []);

  const handleSelectWorkspace = useCallback(
    (workspaceId: WorkspaceKey) => {
      const workspace = getWorkspaceById(workspaceId);
      if (!workspace) return;
      router.replace(firstHrefInWorkspace(workspace));
    },
    [router]
  );

  const isExpanded = phase === 'expanding' || phase === 'picker';
  const loginRendered = phase !== 'picker';
  const loginVisible = phase === 'login';

  return (
    <section
      aria-busy={phase === 'fading' || phase === 'expanding'}
      className={cn(
        'bg-bg-white-0 ring-stroke-soft-200 relative flex w-full max-w-[440px] flex-col items-center overflow-hidden rounded-2xl px-10 py-10 ring-1',
        'transform-gpu will-change-[min-height]',
        '[backface-visibility:hidden] [perspective:1000px]',
        'transition-[min-height]'
      )}
      style={{
        boxShadow:
          '0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.32)',
        minHeight: isExpanded ? PICKER_MIN_HEIGHT_REM : LOGIN_MIN_HEIGHT_REM,
        transitionDuration: `${CARD_EXPAND_MS}ms`,
        transitionTimingFunction: SWIFT_OUT
      }}
    >
      {loginRendered && (
        <div
          className={cn(
            'flex w-full flex-col items-center gap-6',
            'transform-gpu will-change-[opacity,transform]',
            'transition-[opacity,transform]',
            loginVisible ? 'scale-100 opacity-100' : 'pointer-events-none scale-[0.96] opacity-0'
          )}
          style={{
            transitionDuration: `${LOGIN_FADE_OUT_MS}ms`,
            transitionTimingFunction: SWIFT_OUT
          }}
          aria-hidden={!loginVisible}
        >
          {/* ── Brand mark ── */}
          <header className="flex w-full flex-col items-center gap-4 text-center">
            <PradmaLogo size={52} />

            {/* App wordmark */}
            <span className="text-text-soft-400 text-[10px] font-bold tracking-[0.18em] uppercase">
              PRADMA
            </span>

            {/* Title + subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="text-text-strong-950 text-[22px] leading-tight font-bold tracking-tight">
                {homeTitle}
              </h1>
              <p className="text-text-sub-600 text-[13px] leading-relaxed">{homeSubtitle}</p>
            </div>
          </header>

          {/* ── Divider ── */}
          <div className="border-stroke-soft-200 w-full border-t" />

          {/* ── Actions ── */}
          <LoginEmailForm locale={locale} onSuccess={handleLoginSuccess} />

          {/* ── "o" divider entre credenciales y proveedor externo ── */}
          <div className="flex w-full items-center gap-3">
            <div className="bg-stroke-soft-200 h-px flex-1" />
            <span className="text-text-soft-400 text-[11px] uppercase">
              {authDict.googleDivider}
            </span>
            <div className="bg-stroke-soft-200 h-px flex-1" />
          </div>

          <LoginGoogleButton locale={locale} onSuccess={handleLoginSuccess} />
        </div>
      )}

      {phase === 'picker' && <WorkspacePicker dict={shellDict} onSelect={handleSelectWorkspace} />}
    </section>
  );
};
