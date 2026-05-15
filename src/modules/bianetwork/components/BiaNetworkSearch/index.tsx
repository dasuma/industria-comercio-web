'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CompactButton, FancyButton, Input } from '@biaenergy/ui';
import { RiCloseLine, RiSearchLine } from '@biaenergy/ui/icons';
import { APP_ROUTES } from '@/config/routes';
import type { Locale } from '@/i18n/config';
import { cn } from '@/utils/cn';
import { getBianetworkDict } from '../../dictionaries';

interface BiaNetworkSearchProps {
  locale: Locale;
}

const TABS_WITH_SEARCH: { href: string; tabKey: 'users' | 'users_pro' }[] = [
  { href: APP_ROUTES.users, tabKey: 'users' },
  { href: APP_ROUTES.usersPro, tabKey: 'users_pro' }
];

const SEARCH_PARAM = 'ref';
// Match this con la duración del `slide-in-from-right-2 fade-in duration-200`
// — el input se queda montado durante la salida hasta cumplir este timeout.
const ANIMATION_MS = 200;

export const BiaNetworkSearch = ({ locale }: BiaNetworkSearchProps) => {
  const dict = getBianetworkDict(locale);
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matchedTab = TABS_WITH_SEARCH.find(
    t => pathname === t.href || pathname.startsWith(`${t.href}/`)
  );
  const visible = Boolean(matchedTab);
  const currentValue = searchParams?.get(SEARCH_PARAM) ?? '';

  const [draft, setDraft] = useState(currentValue);
  // `inputMounted` controla si el form se renderiza. Cuando el user cierra,
  // setamos `closing=true` y mantenemos `inputMounted=true` durante el
  // ANIMATION_MS para que la animación de salida se vea, después unmount.
  const [inputMounted, setInputMounted] = useState(currentValue !== '');
  const [closing, setClosing] = useState(false);
  const [lastSyncedValue, setLastSyncedValue] = useState(currentValue);
  const [lastSyncedPath, setLastSyncedPath] = useState(pathname);

  if (lastSyncedPath !== pathname) {
    // Cambio de tab → reset al estado inicial del nuevo tab.
    setLastSyncedPath(pathname);
    setLastSyncedValue(currentValue);
    setDraft(currentValue);
    setInputMounted(currentValue !== '');
    setClosing(false);
  } else if (lastSyncedValue !== currentValue) {
    // Mismo tab, cambió el ?ref= externamente — sincronizamos draft pero
    // dejamos que el user controle visibilidad.
    setLastSyncedValue(currentValue);
    setDraft(currentValue);
  }

  const handleClose = () => {
    if (!inputMounted || closing) return;
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setInputMounted(false);
      setClosing(false);
      closeTimerRef.current = null;
    }, ANIMATION_MS);
  };

  const handleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosing(false);
    setInputMounted(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Cleanup del timer si el componente desmonta mid-animación.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Click outside con input vacío → cerrar con animación.
  useEffect(() => {
    if (!inputMounted || closing || draft.trim()) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
    // handleClose es estable (closure sobre setState refs), evitamos meterlo
    // en deps para no re-bindear el listener en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMounted, closing, draft]);

  if (!visible) return null;

  const placeholder = dict.search.placeholder.replace(
    '{tab}',
    matchedTab ? dict.tabs[matchedTab.tabKey] : ''
  );

  const submit = (next: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    const trimmed = next.trim();
    if (trimmed) params.set(SEARCH_PARAM, trimmed);
    else params.delete(SEARCH_PARAM);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const clear = () => {
    setDraft('');
    submit('');
    handleClose();
  };

  return (
    <div ref={containerRef} className="flex items-center">
      {inputMounted ? (
        <form
          onSubmit={handleSubmit}
          className={cn(
            'w-72 duration-200 ease-out',
            closing
              ? 'animate-out slide-out-to-right-2 fade-out fill-mode-forwards'
              : 'animate-in slide-in-from-right-2 fade-in'
          )}
        >
          <Input.Root size="xsmall">
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                ref={inputRef}
                placeholder={placeholder}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') clear();
                }}
                aria-label={placeholder}
                disabled={closing}
              />
              {draft && !closing && (
                <CompactButton.Root
                  type="button"
                  variant="ghost"
                  size="medium"
                  onClick={clear}
                  aria-label={dict.search.open_label}
                >
                  <CompactButton.Icon as={RiCloseLine} />
                </CompactButton.Root>
              )}
            </Input.Wrapper>
          </Input.Root>
        </form>
      ) : (
        <FancyButton.Root
          type="button"
          variant="basic"
          size="xsmall"
          onClick={handleOpen}
          aria-label={dict.search.open_label}
          aria-expanded={false}
          className="animate-in fade-in duration-150"
        >
          <FancyButton.Icon as={RiSearchLine} />
        </FancyButton.Root>
      )}
    </div>
  );
};
