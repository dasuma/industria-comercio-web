'use client';

import { useState } from 'react';
import { Badge, Button, FancyButton, Modal } from '@biaenergy/ui';
import { showToast } from '@/core/feedback/toast';
import { RiCheckLine, RiCloseLine, RiExternalLinkLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { formatCurrency, formatLongDate } from '@/utils/format';
import { useUpdateInvoiceStatus } from '../../data/invoices/updateInvoiceStatus';
import type { BianetworkDictionary } from '../../dictionaries';
import { BIA_NETWORK_STATUS, STATUS_BADGE_COLOR } from '../../models/shared';
import type { BiaNetworkInvoice } from '../../models/invoice';
import { USER_MODAL_ACTION, type UserModalAction } from '../../models/userFilters';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  invoice: BiaNetworkInvoice | null;
  onClose: () => void;
  dict: BianetworkDictionary['invoices'];
  sharedDict: BianetworkDictionary['shared'];
}

const ACTION_SELECTED =
  'bg-bg-weak-50 text-text-strong-950 ring-stroke-sub-300 hover:bg-bg-weak-50 hover:text-text-strong-950 hover:ring-stroke-sub-300';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-paragraph-xs text-text-sub-600">{label}</span>
    <span className="text-text-strong-950 text-paragraph-sm font-medium">{children}</span>
  </div>
);

export const InvoiceDetailModal = ({
  isOpen,
  invoice,
  onClose,
  dict,
  sharedDict
}: InvoiceDetailModalProps) => {
  const detail = dict.detail_modal;
  const updateStatus = useUpdateInvoiceStatus();
  const [selectedAction, setSelectedAction] = useState<UserModalAction | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  if (!invoice) return null;

  const needsReason = selectedAction === USER_MODAL_ACTION.DENIED;

  const isActionDisabled = (action: UserModalAction): boolean => {
    if (action === USER_MODAL_ACTION.ON_HOLD) return true;
    if (invoice.status === BIA_NETWORK_STATUS.APPROVED) return true;
    if (invoice.status === BIA_NETWORK_STATUS.DENIED) return true;
    return false;
  };

  const isConfirmEnabled = (): boolean => {
    if (!selectedAction) return false;
    if (selectedAction === USER_MODAL_ACTION.APPROVED) return true;
    return reason.trim().length > 0;
  };

  const handleConfirm = () => {
    if (!selectedAction) return;
    updateStatus.mutate(
      {
        invoiceId: invoice.id,
        request: {
          status: selectedAction,
          ...(needsReason ? { denied_reason: reason } : {})
        }
      },
      {
        onSuccess: () => {
          showToast('success', detail.success);
          handleClose();
        },
        onError: e => {
          showToast('error', e instanceof Error ? e.message : detail.error);
        }
      }
    );
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={open => !open && handleClose()}>
      <Modal.Content className="flex max-h-[90vh] max-w-[493px] flex-col">
        <Modal.Header title={detail.title} />
        <Modal.Body className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={detail.field_full_name}>{invoice.fullName || '-'}</Field>
            <Field label={detail.field_status}>
              <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[invoice.status]}>
                {sharedDict.status_labels[invoice.status]}
              </Badge.Root>
            </Field>
            <Field label={detail.field_company}>{invoice.companyName ?? '-'}</Field>
            <Field label={detail.field_nit}>{invoice.nit ?? '-'}</Field>
            <Field label={detail.field_amount}>{formatCurrency(invoice.amount)}</Field>
            <Field label={detail.field_referral_code}>{invoice.referralCode || '-'}</Field>
            <Field label={detail.field_date}>{formatLongDate(invoice.createdAt)}</Field>
            <Field label={detail.field_document}>
              {invoice.invoiceDocumentUrl ? (
                <a
                  href={invoice.invoiceDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-base hover:text-primary-darker inline-flex items-center gap-1 underline"
                >
                  {detail.field_view_document}
                  <RiExternalLinkLine className="size-4" />
                </a>
              ) : (
                '-'
              )}
            </Field>
            {invoice.deniedReason && (
              <Field label={detail.field_denied_reason}>{invoice.deniedReason}</Field>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button.Root
              type="button"
              variant="basic"
              size="xsmall"
              disabled={isActionDisabled(USER_MODAL_ACTION.APPROVED)}
              onClick={() => setSelectedAction(USER_MODAL_ACTION.APPROVED)}
              className={cn(selectedAction === USER_MODAL_ACTION.APPROVED && ACTION_SELECTED)}
            >
              <Button.Icon as={RiCheckLine} />
              {sharedDict.btn_approve}
            </Button.Root>
            <Button.Root
              type="button"
              variant="basic"
              size="xsmall"
              disabled={isActionDisabled(USER_MODAL_ACTION.DENIED)}
              onClick={() => setSelectedAction(USER_MODAL_ACTION.DENIED)}
              className={cn(selectedAction === USER_MODAL_ACTION.DENIED && ACTION_SELECTED)}
            >
              <Button.Icon as={RiCloseLine} />
              {sharedDict.btn_deny}
            </Button.Root>
          </div>

          {needsReason && (
            <textarea
              className="border-stroke-soft-200 text-text-strong-950 focus:ring-stroke-strong-950 w-full rounded-lg border bg-transparent p-3 text-sm focus:ring-2 focus:outline-none"
              placeholder={detail.denied_reason_placeholder}
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
            />
          )}

          <div className="flex justify-end gap-2">
            <FancyButton.Root variant="basic" size="medium" onClick={handleClose}>
              {sharedDict.btn_cancel}
            </FancyButton.Root>
            <FancyButton.Root
              variant="primary"
              size="medium"
              disabled={!isConfirmEnabled()}
              state={updateStatus.isPending ? 'loading' : 'idle'}
              onClick={handleConfirm}
            >
              {sharedDict.btn_confirm}
            </FancyButton.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
