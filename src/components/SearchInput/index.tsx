'use client';

import { useEffect, useRef, useState } from 'react';
import { CompactButton, Input } from '@dasuma/pradma-ui';
import { RiCloseLine, RiSearchLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';

const DEFAULT_DEBOUNCE_MS = 300;

interface SearchInputProps {
  /** Valor confirmado (post-debounce). El input mantiene su propio estado inmediato. */
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  debounceMs?: number;
  inputMode?: 'text' | 'numeric' | 'search';
  className?: string;
  id?: string;
}

// Buscador de listado: escribe sin lag, dispara `onChange` recién cuando el
// usuario deja de tipear (debounce) y ofrece un botón para limpiar. Un solo
// componente para los 9 listados así el comportamiento es idéntico en todos.
export const SearchInput = ({
  value,
  onChange,
  placeholder,
  clearLabel,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  inputMode = 'search',
  className,
  id
}: SearchInputProps) => {
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Re-sync si el padre resetea el valor (ej. "limpiar filtros" externo).
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (draft === value) return;
    const t = window.setTimeout(() => onChangeRef.current(draft), debounceMs);
    return () => window.clearTimeout(t);
  }, [draft, value, debounceMs]);

  const clear = () => {
    setDraft('');
    onChangeRef.current('');
  };

  return (
    <Input.Root className={cn('w-full max-w-sm', className)}>
      <Input.Wrapper>
        <Input.Icon as={RiSearchLine} />
        <Input.Input
          id={id}
          type="search"
          inputMode={inputMode}
          placeholder={placeholder}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape' && draft) clear();
          }}
          className="[&::-webkit-search-cancel-button]:hidden"
        />
        {draft ? (
          <CompactButton.Root variant="ghost" size="medium" onClick={clear} aria-label={clearLabel}>
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        ) : null}
      </Input.Wrapper>
    </Input.Root>
  );
};
