'use client';

import { useState } from 'react';
import { Alert, FancyButton } from '@dasuma/pradma-ui';
import { RiArrowRightSLine, RiCalendarCheckLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { INTL_LOCALES } from '@/i18n/config';
import { interpolate } from '@/utils/format';
import { useSettleYears } from '../../hooks/useSettleYears';
import type { Establishment } from '../../models/establishment.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { EstablishmentInvoices } from '../EstablishmentInvoices';
import { EstablishmentSettle } from '../EstablishmentSettle';

interface EstablishmentSettlementsProps {
  establishment: Establishment;
  locale: Locale;
  dict: PradmaDictionary;
}

type Mode = 'list' | 'settle';

// Tab "Liquidaciones": historial + llamado a liquidar los años pendientes.
// Liquidar es una acción, no una sección: reemplaza la lista in-place y
// vuelve a ella al guardar o cancelar.
export const EstablishmentSettlements = ({
  establishment,
  locale,
  dict
}: EstablishmentSettlementsProps) => {
  const [mode, setMode] = useState<Mode>('list');
  const { years, isReady } = useSettleYears(establishment.id);
  const d = dict.settle;

  if (mode === 'settle') {
    return (
      <EstablishmentSettle
        establishment={establishment}
        locale={locale}
        dict={dict}
        onBack={() => setMode('list')}
        onSaved={() => setMode('list')}
      />
    );
  }

  const yearList = new Intl.ListFormat(INTL_LOCALES[locale], { type: 'conjunction' }).format(
    years.map(String)
  );

  return (
    <div className="flex flex-col gap-4">
      {isReady && years.length > 0 ? (
        <div className="bg-bg-weak-50 ring-stroke-soft-200 flex flex-wrap items-center gap-4 rounded-xl px-4 py-3.5 ring-1">
          <div
            className="bg-primary-alpha-10 text-primary-base rounded-10 flex size-10 shrink-0 items-center justify-center"
            aria-hidden
          >
            <RiCalendarCheckLine className="size-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-label-sm text-text-strong-950">
              {years.length === 1
                ? d.pending.one
                : interpolate(d.pending.many, { count: years.length })}
            </p>
            <p className="text-paragraph-xs text-text-sub-600">
              {interpolate(d.pending.description, { years: yearList })}
            </p>
          </div>
          {/* [R7] la única primary de la pantalla: liquidar el año más antiguo */}
          <FancyButton.Root size="medium" onClick={() => setMode('settle')}>
            {interpolate(d.pending.cta, { year: years[0] })}
            <FancyButton.Icon as={RiArrowRightSLine} />
          </FancyButton.Root>
        </div>
      ) : null}

      {isReady && years.length === 0 ? (
        <Alert.Root status="success" size="small">
          {d.noYearAvailable}
        </Alert.Root>
      ) : null}

      <EstablishmentInvoices establishment={establishment} dict={dict} />
    </div>
  );
};
