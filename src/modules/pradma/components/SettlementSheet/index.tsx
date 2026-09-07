'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  FancyButton,
  Modal,
  SegmentedControl,
  Table,
  Tooltip
} from '@dasuma/pradma-ui';
import { RiDownloadLine, RiInformationLine, RiRefreshLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumericDate } from '@/utils/format';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Establishment } from '../../models/establishment.interface';
import type { Invoice } from '../../models/invoice.interface';
import type { SettlementActivityResponse, SettlementResponse } from '../../types/settlement.types';
import type { PradmaDictionary } from '../../dictionaries';
import { InvoiceStatusBadge } from '../InvoiceStatusBadge';

/* ── Helpers ── */

const TOTAL_KINDS = new Set(['gross_total', 'balance_due', 'amount_payable', 'total_payable']);
const SUBTOTAL_KINDS = new Set(['subtotal_tax']);

interface DisplayRow {
  id: string;
  number?: number;
  kind: string;
  name: string;
  value: number;
  description?: string;
}

/* ── Props ── */

export type SettlementSheetProps = {
  onClose: () => void;
  dict: PradmaDictionary;
  establishment: Establishment;
} & (
  | {
      mode: 'draft';
      data: SettlementResponse;
      isSaving: boolean;
      onSave: () => void;
      saveLabel: string;
      newLabel: string;
    }
  | {
      mode: 'saved';
      invoice: Invoice;
    }
);

type View = 'detail' | 'pdf';

/* ── SettlementSheet ── */

// Detalle de una liquidación (borrador recién calculado o factura guardada).
// Usa el Modal del DS: Escape, focus trap y overlay vienen de ahí (R1/R10).
export const SettlementSheet = (props: SettlementSheetProps) => {
  const [view, setView] = useState<View>('detail');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const isDraft = props.mode === 'draft';
  const sheet = props.dict.invoices.sheet;
  const statusLabels = props.dict.invoices.status;

  const title = props.establishment.name;
  let subtitle = '';
  let pdfUrl: string | undefined;
  let rows: DisplayRow[] = [];
  let activities: SettlementActivityResponse[] | null = null;

  if (props.mode === 'draft') {
    const { data } = props;
    subtitle = `${formatNumericDate(data.start_date)} – ${formatNumericDate(data.end_date)} · ${data.settlement_months} ${sheet.months}`;
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
    const { invoice } = props;
    subtitle = String(invoice.year);
    pdfUrl = invoice.pdfUrl;
    rows = invoice.details.map(d => ({
      id: String(d.id),
      kind: d.kind,
      name: d.name || d.kind,
      value: d.amount,
      description: d.description
    }));
  }

  // En borrador el cierre descarta el cálculo → pedimos confirmación.
  const requestClose = () => {
    if (isDraft && !props.isSaving) {
      setConfirmDiscard(true);
      return;
    }
    if (!isDraft) props.onClose();
  };

  return (
    <>
      <Modal.Root
        open
        onOpenChange={open => {
          if (!open) requestClose();
        }}
      >
        <Modal.Content
          className="flex max-h-[90vh] w-[calc(100vw-2rem)] !max-w-5xl flex-col overflow-hidden p-0"
          onEscapeKeyDown={event => {
            event.preventDefault();
            requestClose();
          }}
        >
          {/* ── Header ── */}
          <div className="border-stroke-soft-200 flex shrink-0 flex-wrap items-center gap-2 border-b py-3 pr-12 pl-5">
            <div className="flex min-w-0 flex-1 flex-col">
              <Modal.Title className="text-label-md text-text-strong-950 truncate">
                {title}
              </Modal.Title>
              <Modal.Description className="text-paragraph-xs text-text-sub-600 tabular-nums">
                {subtitle}
              </Modal.Description>
            </div>

            {props.mode === 'saved' ? (
              <InvoiceStatusBadge
                status={props.invoice.status}
                label={
                  statusLabels[props.invoice.status as keyof typeof statusLabels] ??
                  props.invoice.status
                }
              />
            ) : (
              <Badge.Root variant="light" color="blue">
                {sheet.draft}
              </Badge.Root>
            )}

            {pdfUrl ? (
              <SegmentedControl.Root value={view} onValueChange={v => setView(v as View)}>
                <SegmentedControl.List>
                  <SegmentedControl.Trigger value="detail">{sheet.detail}</SegmentedControl.Trigger>
                  <SegmentedControl.Trigger value="pdf">{sheet.pdf}</SegmentedControl.Trigger>
                </SegmentedControl.List>
              </SegmentedControl.Root>
            ) : null}
          </div>

          {/* ── Body ── */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {view === 'pdf' && pdfUrl ? (
              <iframe
                src={`/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`}
                className="h-[70vh] w-full border-0"
                title={sheet.pdfTitle}
              />
            ) : (
              <div className="flex flex-col gap-5 p-5">
                {activities && activities.length > 0 ? (
                  <section className="flex flex-col gap-2">
                    <p className="text-subheading-2xs text-text-sub-600 uppercase">
                      {sheet.activities}
                    </p>
                    <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.Head>{sheet.activity}</Table.Head>
                            <Table.Head className="text-right">{sheet.tariff}</Table.Head>
                            <Table.Head className="text-right">{sheet.ica}</Table.Head>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {activities.map(a => (
                            <Table.Row key={a.activity_code}>
                              <Table.Cell>
                                <span className="text-text-strong-950 font-medium">
                                  {a.activity_code}
                                </span>
                                <span className="text-text-soft-400 ml-1.5">{a.activity_name}</span>
                              </Table.Cell>
                              <Table.Cell className="text-text-sub-600 text-right tabular-nums">
                                {a.tariff_rate}
                              </Table.Cell>
                              <Table.Cell className="text-text-strong-950 text-right font-medium tabular-nums">
                                {formatCurrency(a.tax)}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </div>
                  </section>
                ) : null}

                <section className="flex flex-col gap-2">
                  {activities && activities.length > 0 ? (
                    <p className="text-subheading-2xs text-text-sub-600 uppercase">
                      {sheet.settlement}
                    </p>
                  ) : null}
                  <Tooltip.Provider>
                    <div className="ring-stroke-soft-200 divide-stroke-soft-200 divide-y overflow-hidden rounded-xl ring-1">
                      {rows.map(row => {
                        const isTotal = TOTAL_KINDS.has(row.kind);
                        const isSubtotal = SUBTOTAL_KINDS.has(row.kind);
                        return (
                          <div
                            key={row.id}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2.5',
                              isTotal && 'bg-success-lighter',
                              isSubtotal && 'bg-bg-weak-50'
                            )}
                          >
                            {row.number !== undefined ? (
                              <span
                                className={cn(
                                  'text-label-xs w-5 shrink-0 text-center tabular-nums',
                                  isTotal ? 'text-success-dark' : 'text-text-soft-400'
                                )}
                              >
                                {row.number}
                              </span>
                            ) : null}
                            <span className="flex min-w-0 flex-1 items-center gap-1.5">
                              <span
                                className={cn(
                                  'text-paragraph-xs leading-snug',
                                  isTotal ? 'text-success-dark font-medium' : 'text-text-sub-600'
                                )}
                              >
                                {row.name}
                              </span>
                              {row.description && row.description !== row.name ? (
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <span className="text-text-soft-400 hover:text-text-sub-600 shrink-0 cursor-default">
                                      <RiInformationLine className="size-3.5" />
                                    </span>
                                  </Tooltip.Trigger>
                                  <Tooltip.Content size="small" className="max-w-56">
                                    {row.description}
                                  </Tooltip.Content>
                                </Tooltip.Root>
                              ) : null}
                            </span>
                            <span
                              className={cn(
                                'shrink-0 text-right tabular-nums',
                                isTotal
                                  ? 'text-label-sm text-success-dark'
                                  : 'text-label-xs text-text-strong-950',
                                row.value === 0 && !isTotal && 'text-text-soft-400 font-normal'
                              )}
                            >
                              {row.value === 0
                                ? props.dict.common.notAvailable
                                : formatCurrency(row.value)}
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

          {/* ── Footer — solo borrador ── */}
          {props.mode === 'draft' ? (
            <div className="border-stroke-soft-200 flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3">
              <Button.Root
                variant="basic"
                size="medium"
                onClick={requestClose}
                disabled={props.isSaving}
              >
                <Button.Icon as={RiRefreshLine} />
                {props.newLabel}
              </Button.Root>
              {/* [R7] guardar es la acción protagonista del sheet */}
              <FancyButton.Root
                size="medium"
                onClick={props.onSave}
                state={props.isSaving ? 'loading' : 'idle'}
                disabled={props.isSaving}
              >
                <FancyButton.Icon as={RiDownloadLine} />
                {props.saveLabel}
              </FancyButton.Root>
            </div>
          ) : null}
        </Modal.Content>
      </Modal.Root>

      {isDraft ? (
        <ConfirmDialog
          open={confirmDiscard}
          onOpenChange={setConfirmDiscard}
          destructive={false}
          title={props.dict.settle.result.discardTitle}
          description={props.dict.settle.result.discardDescription}
          confirmLabel={props.dict.settle.result.discardConfirm}
          cancelLabel={props.dict.common.cancel}
          onConfirm={() => {
            setConfirmDiscard(false);
            props.onClose();
          }}
        />
      ) : null}
    </>
  );
};
