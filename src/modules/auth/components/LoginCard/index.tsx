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
import { cn } from '@/utils/cn';
import { LoginGoogleButton } from '../LoginGoogleButton';

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
const CARD_EXPAND_MS = 760;

// Solid white card — login content + picker live at the same horizontal width.
// Min-heights tuned to natural content sizes at p-10 (padding: 40px):
//   Login: logo(52) + gap(16) + wordmark(16) + title(28) + subtitle(20) + gap-5(20) + button(40) + padding-y(80) ≈ 272px → 17rem
//   Picker: title(28) + sub(20) + gap-5(20) + 1 card × 52px + padding-y(80) → flexible. 34rem allows comfortable content.
const LOGIN_MIN_HEIGHT_REM = '17rem';
const PICKER_MIN_HEIGHT_REM = '36rem';

const SWIFT_OUT = 'cubic-bezier(0.32, 0.72, 0, 1)';

const wait = (ms: number): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

export const LoginCard = ({ locale, homeTitle, homeSubtitle }: LoginCardProps) => {
  const router = useRouter();
  const shellDict = getShellDict(locale);

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
        'relative flex w-full max-w-[440px] flex-col items-center overflow-hidden rounded-2xl px-10 py-10',
        'transform-gpu will-change-[min-height]',
        '[backface-visibility:hidden] [perspective:1000px]',
        'transition-[min-height]'
      )}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.06)',
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
            {/* Logo */}
            <div className="size-[52px]" aria-hidden>
              <svg
                width="52"
                height="52"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="bg"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0a1628" />
                    <stop offset="1" stopColor="#1a2d50" />
                  </linearGradient>
                  <radialGradient id="glow1" cx="8" cy="10" r="6" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(180,210,255,0.45)" />
                    <stop offset="1" stopColor="rgba(180,210,255,0)" />
                  </radialGradient>
                  <radialGradient id="glow2" cx="25" cy="22" r="5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(180,210,255,0.35)" />
                    <stop offset="1" stopColor="rgba(180,210,255,0)" />
                  </radialGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#bg)" />
                <circle cx="8" cy="10" r="6" fill="url(#glow1)" />
                <circle cx="25" cy="22" r="5" fill="url(#glow2)" />
                <rect
                  x="3.5"
                  y="3.5"
                  width="25"
                  height="25"
                  rx="5"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M11 24V8h5.5c1.6 0 2.85.45 3.75 1.35.9.9 1.35 2.1 1.35 3.6 0 1.5-.45 2.7-1.35 3.6-.9.9-2.15 1.35-3.75 1.35H14.2V24H11z M14.2 15.1h2.1c.75 0 1.33-.22 1.73-.65.4-.43.6-1.02.6-1.75s-.2-1.3-.6-1.73c-.4-.43-.98-.65-1.73-.65H14.2v4.78z"
                  fill="white"
                />
              </svg>
            </div>

            {/* App wordmark */}
            <span
              className="text-[10px] font-bold tracking-[0.18em] uppercase"
              style={{ color: '#94a3b8' }}
            >
              PRADMA
            </span>

            {/* Title + subtitle */}
            <div className="flex flex-col gap-1">
              <h1
                className="text-[22px] leading-tight font-bold tracking-tight"
                style={{ color: '#0a1628' }}
              >
                {homeTitle}
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: '#64748b' }}>
                {homeSubtitle}
              </p>
            </div>
          </header>

          {/* ── Divider ── */}
          <div className="w-full border-t" style={{ borderColor: 'rgba(0,0,0,0.07)' }} />

          {/* ── Action ── */}
          <LoginGoogleButton locale={locale} onSuccess={handleLoginSuccess} />
        </div>
      )}

      {phase === 'picker' && <WorkspacePicker dict={shellDict} onSelect={handleSelectWorkspace} />}
    </section>
  );
};
