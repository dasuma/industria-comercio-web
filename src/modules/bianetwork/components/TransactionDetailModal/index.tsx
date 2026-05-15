'use client';

import { useState } from 'react';
import { Badge, Button, FancyButton, Modal } from '@biaenergy/ui';
import { showToast } from '@/core/feedback/toast';
import { RiCheckLine, RiCloseLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { formatCurrency, formatLongDate } from '@/utils/format';
import { useUpdateTransactionStatus } from '../../data/transactions/updateTransactionStatus';
import type { BianetworkDictionary } from '../../dictionaries';
import { BIA_NETWORK_STATUS, STATUS_BADGE_COLOR } from '../../models/shared';
import type { BiaNetworkTransaction } from '../../models/transaction';
import { USER_MODAL_ACTION, type UserModalAction } from '../../models/userFilters';

interface TransactionDetailModalProps {
  isOpen: boolean;
  transaction: BiaNetworkTransaction | null;
  onClose: () => void;
  dict: BianetworkDictionary['transactions'];
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

export const TransactionDetailModal = ({
  isOpen,
  transaction,
  onClose,
  dict,
  sharedDict
}: TransactionDetailModalProps) => {
  const detail = dict.detail_modal;
  const updateStatus = useUpdateTransactionStatus();
  const [selectedAction, setSelectedAction] = useState<UserModalAction | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  if (!transaction) return null;

  // Transactions only support Approved (→ IN_TRANSIT) and Denied actions in
  // the source product; ON_HOLD is not part of the workflow.
  const needsReason = selectedAction === USER_MODAL_ACTION.DENIED;

  const isActionDisabled = (action: UserModalAction): boolean => {
    if (action === USER_MODAL_ACTION.ON_HOLD) return true;
    if (transaction.status === BIA_NETWORK_STATUS.APPROVED) return true;
    if (transaction.status === BIA_NETWORK_STATUS.IN_TRANSIT) return true;
    if (transaction.status === BIA_NETWORK_STATUS.DENIED) return true;
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
        transactionId: transaction.id,
        request: {
          status: selectedAction,
          ...(needsReason ? { rejected_reason: reason } : {})
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
            <Field label={detail.field_full_name}>{transaction.fullName || '-'}</Field>
            <Field label={detail.field_status}>
              <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[transaction.status]}>
                {sharedDict.status_labels[transaction.status]}
              </Badge.Root>
            </Field>
            <Field label={detail.field_email}>{transaction.email}</Field>
            <Field label={detail.field_phone}>{transaction.phone ?? '-'}</Field>
            <Field label={detail.field_amount}>{formatCurrency(transaction.amount)}</Field>
            <Field label={detail.field_referral_code}>{transaction.referralCode || '-'}</Field>
            <Field label={detail.field_date}>{formatLongDate(transaction.date)}</Field>
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
              placeholder={sharedDict.reason_placeholder}
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
