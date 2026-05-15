'use client';

import { useState } from 'react';
import { Badge, Button, FancyButton, Modal } from '@biaenergy/ui';
import { showToast } from '@/core/feedback/toast';
import { RiCheckLine, RiCloseLine, RiTimerLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { useGetAccountDetail } from '../../data/accounts/getAccountDetail';
import { useUpdateAccountStatus } from '../../data/accounts/updateAccountStatus';
import type { BianetworkDictionary } from '../../dictionaries';
import { BIA_NETWORK_STATUS, STATUS_BADGE_COLOR } from '../../models/shared';
import { USER_MODAL_ACTION, type UserModalAction } from '../../models/userFilters';

interface AccountDetailModalProps {
  isOpen: boolean;
  accountId: string | null;
  onClose: () => void;
  dict: BianetworkDictionary['accounts'];
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

export const AccountDetailModal = ({
  isOpen,
  accountId,
  onClose,
  dict,
  sharedDict
}: AccountDetailModalProps) => {
  const detail = dict.detail_modal;
  const { data: account, isLoading } = useGetAccountDetail(isOpen ? accountId : null);
  const updateStatus = useUpdateAccountStatus();
  const [selectedAction, setSelectedAction] = useState<UserModalAction | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  const needsReason =
    selectedAction === USER_MODAL_ACTION.ON_HOLD || selectedAction === USER_MODAL_ACTION.DENIED;

  const isActionDisabled = (action: UserModalAction): boolean => {
    if (!account) return true;
    if (account.status === BIA_NETWORK_STATUS.APPROVED) {
      return action === USER_MODAL_ACTION.ON_HOLD || action === USER_MODAL_ACTION.DENIED;
    }
    if (account.status === BIA_NETWORK_STATUS.DENIED) {
      return action === USER_MODAL_ACTION.ON_HOLD || action === USER_MODAL_ACTION.APPROVED;
    }
    return false;
  };

  const isConfirmEnabled = (): boolean => {
    if (!selectedAction) return false;
    if (selectedAction === USER_MODAL_ACTION.APPROVED) return true;
    return reason.trim().length > 0;
  };

  const handleConfirm = () => {
    if (!selectedAction || !account) return;
    updateStatus.mutate(
      {
        accountId: account.id,
        request: {
          status: selectedAction,
          ...(needsReason ? { note: reason } : {})
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
          {isLoading || !account ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-bg-weak-50 h-8 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <section className="flex flex-col gap-3 pb-4">
                <h3 className="text-text-strong-950 text-label-md font-semibold">
                  {detail.section_user}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={detail.field_full_name}>{account.fullName || '-'}</Field>
                  <Field label={detail.field_status}>
                    <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[account.status]}>
                      {sharedDict.status_labels[account.status]}
                    </Badge.Root>
                  </Field>
                  <Field label={detail.field_email}>{account.email}</Field>
                  <Field label={detail.field_phone}>{account.phone ?? '-'}</Field>
                  <Field label={detail.field_id_type}>{account.documentType}</Field>
                  <Field label={detail.field_id_number}>{account.documentNumber}</Field>
                  <Field label={detail.field_referral_code}>{account.referralCode || '-'}</Field>
                  {account.laftWarning && (
                    <Field label={detail.field_laft_warning}>{account.laftWarning}</Field>
                  )}
                </div>
              </section>

              <section className="border-stroke-soft-200 flex flex-col gap-3 border-t pt-4">
                <h3 className="text-text-strong-950 text-label-md font-semibold">
                  {detail.section_bank}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={detail.field_bank}>{account.bankName ?? '-'}</Field>
                  <Field label={detail.field_account_type}>{account.bankAccountType ?? '-'}</Field>
                  <Field label={detail.field_account_number}>
                    {account.bankAccountNumber ?? '-'}
                  </Field>
                  <Field label={detail.field_city}>{account.city ?? '-'}</Field>
                  <Field label={detail.field_address}>{account.address ?? '-'}</Field>
                  {account.notes && <Field label={detail.field_notes}>{account.notes}</Field>}
                </div>
              </section>
            </>
          )}
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
              disabled={isActionDisabled(USER_MODAL_ACTION.ON_HOLD)}
              onClick={() => setSelectedAction(USER_MODAL_ACTION.ON_HOLD)}
              className={cn(selectedAction === USER_MODAL_ACTION.ON_HOLD && ACTION_SELECTED)}
            >
              <Button.Icon as={RiTimerLine} />
              {sharedDict.btn_on_hold}
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
