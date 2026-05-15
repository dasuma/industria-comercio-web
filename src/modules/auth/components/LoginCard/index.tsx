'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  // Strings del dict global (home.title / home.subtitle). Las recibimos por
  // prop desde el server para evitar resolver el dict en client.
  homeTitle: string;
  homeSubtitle: string;
}

// Phase machine. Cada paso disparado por su timeout — la separación en 4
// fases (en vez de 2) es lo que hace el morph "smooth": el resize ocurre
// con el contenido del login todavía montado pero invisible (acolcha la
// altura) y el picker no monta hasta que el card está estable. Sin eso, el
// grid del picker reflowea durante el resize y se ve glitchy.
//
//   login     → contenido de login visible, card 24rem
//   fading    → contenido de login con opacity 0 (todavía montado), card 24rem
//   expanding → card crece a 38rem × 22rem, login sigue montado (invisible)
//               como "shim" de altura para que la transición no salte
//   picker    → swap final: login unmount, picker mount con su stagger
type Phase = 'login' | 'fading' | 'expanding' | 'picker';

// Tiempos del morph. POST_AUTH_HOLD_MS se siente como "verificando…" — el
// hook `useGoogleSignIn` awaitea el callback, así el botón mantiene
// `state='loading'` durante todo el hold y los fades.
const POST_AUTH_HOLD_MS = 2000;
const LOGIN_FADE_OUT_MS = 220;
const CARD_EXPAND_MS = 760;

// Anclamos los dos extremos de la transición a la altura natural de cada
// fase, así `actual = max(contenido, min-height)` queda dominado por el
// min-height interpolado y la altura crece de manera continua (sin meseta
// inicial ni snap final).
//
// Login natural (~232px): logo 48 + heading + botón + paddings p-8.
// Picker natural (~540px): título 2 líneas (64) + gap-1 (4) + frase
//   inspiradora 1 línea (~20, puede wrap a 2 líneas con nombres largos),
//   gap-5 (20) y lista de 6 cards de 56px cada uno + 5 gaps × 6 = 366,
//   paddings p-8 (64). 35rem (560px) deja holgura para que el browser
//   nunca tenga que crecer la altura más allá del min-height interpolado
//   — sin esa holgura el último frame del resize hace snap visible
//   cuando el contenido natural supera al min-height. Subdimensionar
//   PICKER_MIN_HEIGHT_REM era el origen del "brinco" final del morph.
const LOGIN_MIN_HEIGHT_REM = '14.5rem';
const PICKER_MIN_HEIGHT_REM = '35rem';

// Easing del DS — la misma curva swift-out que usan modal/popover. Aplicarla
// consistente en card + fade hace que el morph se sienta como una sola
// animación coherente y no como tres efectos sumados con curvas distintas.
const SWIFT_OUT = 'cubic-bezier(0.32, 0.72, 0, 1)';

const wait = (ms: number): Promise<void> => new Promise(resolve => window.setTimeout(resolve, ms));

export const LoginCard = ({ locale, homeTitle, homeSubtitle }: LoginCardProps) => {
  const router = useRouter();
  const shellDict = getShellDict(locale);

  const [phase, setPhase] = useState<Phase>('login');

  // Awaited por el hook → mantiene `isLoading=true` (loader visible en el
  // botón) durante todo el morph hasta que arranca el fade-out. Sin este
  // await el botón vuelve a "Continuar con Google" un instante antes y se
  // ve un flicker.
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
        'glass-popup relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-2xl p-8',
        // Compositing hints — promovemos el card a su propia capa GPU
        // para que el resize no gatille reflows de pintado en el root.
        'transform-gpu will-change-[min-height]',
        // backface-visibility: hidden + perspective evita un sub-pixel
        // jitter que aparece cuando una capa promovida se redimensiona
        // en safari.
        '[backface-visibility:hidden] [perspective:1000px]',
        'transition-[min-height]'
      )}
      style={{
        // El picker es vertical (1 card por fila) — mismo ancho que el
        // login. El morph solo crece en altura, sin reflow horizontal.
        minHeight: isExpanded ? PICKER_MIN_HEIGHT_REM : LOGIN_MIN_HEIGHT_REM,
        transitionDuration: `${CARD_EXPAND_MS}ms`,
        transitionTimingFunction: SWIFT_OUT
      }}
    >
      {loginRendered && (
        <div
          className={cn(
            'flex w-full flex-col items-center gap-5',
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
          <header className="flex flex-col items-center text-center">
            <div className="ring-stroke-soft-200 shadow-regular-md relative mb-3 size-12 overflow-hidden rounded-xl ring-1">
              <Image
                src="/olibia-logo.png"
                alt=""
                aria-hidden
                fill
                priority
                sizes="48px"
                className="object-cover"
              />
            </div>
            <h1 className="text-title-h5 text-text-strong-950">{homeTitle}</h1>
            <p className="text-paragraph-sm text-text-sub-600">{homeSubtitle}</p>
          </header>

          <LoginGoogleButton locale={locale} onSuccess={handleLoginSuccess} />
        </div>
      )}

      {phase === 'picker' && <WorkspacePicker dict={shellDict} onSelect={handleSelectWorkspace} />}
    </section>
  );
};
