'use client';

import { useState } from 'react';
import { Input } from '@dasuma/pradma-ui';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';

interface CurrencyInputProps {
  id?: string;
  /** Dígitos crudos ("1500000"). El padre guarda el string sin formato. */
  value: string;
  onChange: (digits: string) => void;
  hasError?: boolean;
  className?: string;
  inputClassName?: string;
  'aria-label'?: string;
}

const onlyDigits = (v: string): string => v.replace(/\D/g, '');

// Input de moneda sin saltos de cursor: mientras tiene foco muestra los
// dígitos crudos (el usuario tipea libre); al perder foco muestra el valor
// formateado con separadores de miles. El padre siempre recibe dígitos.
export const CurrencyInput = ({
  id,
  value,
  onChange,
  hasError,
  className,
  inputClassName,
  'aria-label': ariaLabel
}: CurrencyInputProps) => {
  const [focused, setFocused] = useState(false);
  const displayValue = focused ? value : value ? formatNumber(Number(value)) : '';

  return (
    <Input.Root hasError={hasError} className={className}>
      <Input.Wrapper>
        <span className="text-text-soft-400 text-paragraph-sm shrink-0 select-none">$</span>
        <Input.Input
          id={id}
          type="text"
          inputMode="numeric"
          aria-label={ariaLabel}
          value={displayValue}
          placeholder="0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => onChange(onlyDigits(e.target.value))}
          className={cn('text-right tabular-nums', inputClassName)}
        />
      </Input.Wrapper>
    </Input.Root>
  );
};
