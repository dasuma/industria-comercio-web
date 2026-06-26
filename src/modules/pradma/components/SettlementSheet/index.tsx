'use client';

import { useState } from 'react';
import { Button, CompactButton, FancyButton, Tooltip } from '@biaenergy/ui';
import {
  RiArrowRightSLine,
  RiCloseLine,
  RiDownloadLine,
  RiInformationLine,
  RiRefreshLine
} from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { Establishment } from '../../models/establishment.interface';
import type { Invoice } from '../../models/invoice.interface';
import type { SettlementActivityResponse, SettlementResponse } from '../../types/settlement.types';

/* ── Helpers ── */

const TOTAL_KINDS = new Set(['gross_total', 'balance_due', 'amount_payable', 'total_payable']);
const SUBTOTAL_KINDS = new Set(['subtotal_tax']);

const formatCop = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(v);

const formatDateShort = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  return iso.slice(0, 10); // yyyy-mm-dd
};

/* ── Normalized row ── */

interface DisplayRow {
  id: string;
  number?: number;
  kind: string;
  name: string;
  value: number;
  description?: string;
}

/* ── Status ── */

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-bg-weak-50 text-text-sub-600',
  created: 'bg-bg-weak-50 text-text-sub-600',
  pending: 'bg-warning-lighter text-warning-dark',
  paid: 'bg-success-lighter text-success-dark',
  overdue: 'bg-error-lighter text-error-dark',
  expired: 'bg-error-lighter text-error-dark'
};

/* ── Props ── */

export type SettlementSheetProps = {
  onClose: () => void;
} & (
  | {
      mode: 'draft';
      data: SettlementResponse;
      establishment: Establishment;
      isSaving: boolean;
      onSave: () => void;
      saveLabel: string;
      newLabel: string;
    }
  | {
      mode: 'saved';
      invoice: Invoice;
      establishment: Establishment;
      statusLabels: Record<string, string>;
    }
);

/* ── SettlementSheet ── */

export const SettlementSheet = (props: SettlementSheetProps) => {
  const [view, setView] = useState<'detail' | 'pdf'>('detail');
  const isDraft = props.mode === 'draft';

  /* Derive display data from either source */
  const title = isDraft ? props.data.establishment_name : props.establishment.name;
  let subtitle = '';
  let invoiceStatus: string | null = null;
  let pdfUrl: string | undefined;
  let rows: DisplayRow[] = [];
  let activities: SettlementActivityResponse[] | null = null;

  if (props.mode === 'draft') {
    const { data } = props;
    subtitle = `${formatDateShort(data.start_date)} — ${formatDateShort(data.end_date)} · ${data.settlement_months} meses`;
    rows = data.rows.map(r => ({
      id: String(r.number),
      number: r.number,
      kind: r.kind,
      name: r.name,
      value: r.value,
      description: r.description || undefined
    }));
    activities = data.activities;
  } else {
    const { invoice, statusLabels } = props;
    subtitle = String(invoice.year);
    invoiceStatus = statusLabels[invoice.status] ?? invoice.status;
    pdfUrl = invoice.pdfUrl;
    rows = invoice.details.map(d => ({
      id: String(d.id),
      kind: d.kind,
      name: d.name || d.kind,
      value: d.amount,
      description: d.description
    }));
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      onClick={!isDraft ? props.onClose : undefined}
    >
      <div className="absolute inset-0 bg-black/50" />

      {/* Sheet container */}
      <div
        className={cn(
          'bg-bg-white-0 relative flex w-full flex-col overflow-hidden shadow-2xl',
          'rounded-t-2xl sm:max-w-5xl sm:rounded-2xl',
          'h-[96dvh] sm:h-[95vh]'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header — single compact row ── */}
        <div className="border-stroke-soft-200 shrink-0 border-b px-3 py-2">
          <div className="flex items-center gap-2">
            {/* Title */}
            <p className="text-text-strong-950 min-w-0 flex-1 truncate text-sm font-semibold">
              {title}
            </p>

            {/* Subtitle + badges */}
            <span className="text-text-sub-600 shrink-0 text-xs">{subtitle}</span>
            {invoiceStatus && props.mode === 'saved' && (
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  STATUS_STYLES[props.invoice.status] ?? STATUS_STYLES.pending
                )}
              >
                {invoiceStatus}
              </span>
            )}
            {isDraft && (
              <span className="bg-information-lighter text-information-dark shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                Borrador
              </span>
            )}

            {/* Detalle / PDF toggle */}
            {pdfUrl && (
              <div className="ring-stroke-soft-200 flex shrink-0 overflow-hidden rounded-lg ring-1">
                <button
                  type="button"
                  onClick={() => setView('detail')}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-semibold transition-colors',
                    view === 'detail'
                      ? 'bg-text-strong-950 text-bg-white-0'
                      : 'text-text-sub-600 hover:bg-bg-weak-50'
                  )}
                >
                  Detalle
                </button>
                <button
                  type="button"
                  onClick={() => setView('pdf')}
                  className={cn(
                    'border-stroke-soft-200 border-l px-2.5 py-1 text-[11px] font-semibold transition-colors',
                    view === 'pdf'
                      ? 'bg-text-strong-950 text-bg-white-0'
                      : 'text-text-sub-600 hover:bg-bg-weak-50'
                  )}
                >
                  PDF
                </button>
              </div>
            )}

            {/* Close */}
            <CompactButton.Root
              variant="ghost"
              size="medium"
              onClick={props.onClose}
              className="-mr-1 shrink-0"
            >
              <CompactButton.Icon as={RiCloseLine} />
            </CompactButton.Root>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {view === 'pdf' && pdfUrl ? (
            <iframe
              src={`/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`}
              className="h-full w-full border-0"
              title="Liquidación PDF"
            />
          ) : (
            <div className="flex flex-col gap-5 p-4 pb-6">
              {/* Activities table — draft only */}
              {activities && activities.length > 0 && (
                <section>
                  <p className="text-text-sub-600 mb-2 text-[11px] font-semibold tracking-wider uppercase">
                    Actividades
                  </p>
                  <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-bg-weak-50 border-stroke-soft-200 border-b">
                          <th className="text-text-sub-600 px-3 py-2 text-left font-semibold">
                            Actividad
                          </th>
                          <th className="text-text-sub-600 px-3 py-2 text-right font-semibold">
                            Tarifa ‰
                          </th>
                          <th className="text-text-sub-600 px-3 py-2 text-right font-semibold">
                            ICA
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-stroke-soft-200 divide-y">
                        {activities.map(a => (
                          <tr key={a.activity_code}>
                            <td className="px-3 py-2">
                              <span className="text-text-strong-950 font-medium">
                                {a.activity_code}
                              </span>
                              <span className="text-text-soft-400 ml-1">{a.activity_name}</span>
                            </td>
                            <td className="text-text-sub-600 px-3 py-2 text-right">
                              {a.tariff_rate}
                            </td>
                            <td className="text-text-strong-950 px-3 py-2 text-right font-semibold">
                              {formatCop(a.tax)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Settlement rows */}
              <section>
                {activities && activities.length > 0 && (
                  <p className="text-text-sub-600 mb-2 text-[11px] font-semibold tracking-wider uppercase">
                    Liquidación
                  </p>
                )}
                <Tooltip.Provider>
                  <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
                    {rows.map(row => {
                      const isTotal = TOTAL_KINDS.has(row.kind);
                      const isSubtotal = SUBTOTAL_KINDS.has(row.kind);
                      return (
                        <div
                          key={row.id}
                          className={cn(
                            'border-stroke-soft-200 flex items-center gap-3 border-b px-4 py-2.5 last:border-0',
                            isTotal && 'bg-success-lighter',
                            isSubtotal && 'bg-bg-weak-50'
                          )}
                        >
                          {row.number !== undefined && (
                            <span
                              className={cn(
                                'w-5 shrink-0 text-center text-[11px] font-bold',
                                isTotal ? 'text-success-dark' : 'text-text-soft-400'
                              )}
                            >
                              {row.number}
                            </span>
                          )}
                          <span className="flex min-w-0 flex-1 items-center gap-1.5">
                            <span
                              className={cn(
                                'text-xs leading-snug',
                                isTotal ? 'text-success-dark font-medium' : 'text-text-sub-600'
                              )}
                            >
                              {row.name}
                            </span>
                            {row.description && row.description !== row.name && (
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <span className="text-text-soft-400 hover:text-text-sub-600 shrink-0 cursor-default">
                                    <RiInformationLine className="h-3.5 w-3.5" />
                                  </span>
                                </Tooltip.Trigger>
                                <Tooltip.Content size="small" className="max-w-56">
                                  {row.description}
                                </Tooltip.Content>
                              </Tooltip.Root>
                            )}
                          </span>
                          <span
                            className={cn(
                              'shrink-0 text-right text-xs font-semibold tabular-nums',
                              isTotal ? 'text-success-dark text-sm' : 'text-text-strong-950',
                              row.value === 0 && !isTotal && 'text-text-soft-400 font-normal'
                            )}
                          >
                            {row.value === 0 ? '—' : formatCop(row.value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Tooltip.Provider>
              </section>
            </div>
          )}
        </div>

        {/* ── Footer — draft only ── */}
        {props.mode === 'draft' && (
          <div className="border-stroke-soft-200 flex shrink-0 items-center justify-between gap-3 border-t px-4 py-3">
            <Button.Root variant="neutral" mode="ghost" size="medium" onClick={props.onClose}>
              <Button.Icon as={RiRefreshLine} />
              {props.newLabel}
            </Button.Root>
            <FancyButton.Root
              variant="primary"
              size="medium"
              onClick={props.onSave}
              disabled={props.isSaving}
            >
              <FancyButton.Icon as={RiDownloadLine} />
              {props.isSaving ? 'Guardando PDF…' : props.saveLabel}
            </FancyButton.Root>
          </div>
        )}
      </div>

      {/* Hint for saved: click outside */}
      {!isDraft && (
        <button
          type="button"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden"
          onClick={props.onClose}
          aria-label="Cerrar"
        >
          <div className="bg-bg-white-0/30 h-1 w-10 rounded-full" />
        </button>
      )}
    </div>
  );
};

/* ── Compact invoice row for lists ── */

interface InvoiceRowProps {
  year: number;
  status: string;
  total: number;
  statusLabel: string;
  expirationDate?: string | null;
  expirationLabel?: string;
  onClick: () => void;
}

export const InvoiceRow = ({
  year,
  status,
  total,
  statusLabel,
  expirationDate,
  expirationLabel = 'Vence',
  onClick
}: InvoiceRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="hover:bg-bg-weak-50 ring-stroke-soft-200 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ring-1 transition-colors"
  >
    <span className="text-text-strong-950 w-10 shrink-0 text-sm font-bold">{year}</span>
    <span
      className={cn(
        'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      )}
    >
      {statusLabel}
    </span>
    <span className="min-w-0 flex-1" />
    {expirationDate && (
      <span className="text-text-soft-400 shrink-0 text-xs">
        {expirationLabel} {formatDateShort(expirationDate)}
      </span>
    )}
    <span className="text-text-strong-950 shrink-0 text-sm font-semibold tabular-nums">
      {new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }).format(total)}
    </span>
    <span className="text-text-soft-400 shrink-0">
      <RiArrowRightSLine className="h-4 w-4" />
    </span>
  </button>
);
