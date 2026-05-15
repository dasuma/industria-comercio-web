'use client';

import { useState } from 'react';
import { Badge, Button, FancyButton, Modal } from '@biaenergy/ui';
import { showToast } from '@/core/feedback/toast';
import { RiCheckLine, RiCloseLine, RiTimerLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { formatLongDate } from '@/utils/format';
import { useUpdateUserStatus } from '../../data/users/updateUserStatus';
import type { BianetworkDictionary } from '../../dictionaries';
import {
  BIA_NETWORK_PERSON_TYPE,
  BIA_NETWORK_STATUS,
  STATUS_BADGE_COLOR
} from '../../models/shared';
import type { BiaNetworkUser } from '../../models/user';
import { USER_MODAL_ACTION, type UserModalAction } from '../../models/userFilters';

interface UserDetailModalProps {
  isOpen: boolean;
  user: BiaNetworkUser | null;
  onClose: () => void;
  dict: BianetworkDictionary['users'];
}

// Patrón "filtro seleccionado" del DS (Secondary Button → Filtros): replica el
// visual del hover (bg-weak-50 + text-strong-950) + ring un escalón más
// notable (stroke-sub-300). El hover se neutraliza para que el seleccionado
// se sienta "pegado".
const ACTION_SELECTED =
  'bg-bg-weak-50 text-text-strong-950 ring-stroke-sub-300 hover:bg-bg-weak-50 hover:text-text-strong-950 hover:ring-stroke-sub-300';

const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '-';
  if (phone.startsWith('57') && phone.length >= 10) {
    return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
  }
  return phone;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-paragraph-xs text-text-sub-600">{label}</span>
    <span className="text-text-strong-950 text-paragraph-sm font-medium">{children}</span>
  </div>
);

export const UserDetailModal = ({ isOpen, user, onClose, dict }: UserDetailModalProps) => {
  const detail = dict.detail_modal;
  const updateStatus = useUpdateUserStatus();
  const [selectedAction, setSelectedAction] = useState<UserModalAction | null>(null);
  const [reason, setReason] = useState('');

  const resetState = () => {
    setSelectedAction(null);
    setReason('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!user) return null;

  const needsReason =
    selectedAction === USER_MODAL_ACTION.ON_HOLD || selectedAction === USER_MODAL_ACTION.DENIED;

  const isActionDisabled = (action: UserModalAction): boolean => {
    if (user.status === BIA_NETWORK_STATUS.APPROVED) {
      return action === USER_MODAL_ACTION.ON_HOLD || action === USER_MODAL_ACTION.DENIED;
    }
    if (user.status === BIA_NETWORK_STATUS.DENIED) {
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
    if (!selectedAction) return;
    const request = {
      status: selectedAction,
      ...(needsReason ? { note: reason } : {})
    };
    updateStatus.mutate(
      { userId: user.id, request },
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

  const isLegal = user.type === BIA_NETWORK_PERSON_TYPE.LEGAL;
  const title = isLegal ? detail.title_legal : detail.title_natural;

  return (
    <Modal.Root open={isOpen} onOpenChange={open => !open && handleClose()}>
      <Modal.Content className="flex max-h-[90vh] max-w-[493px] flex-col">
        <Modal.Header title={title} />

        <Modal.Body className="flex-1 overflow-y-auto">
          <section className="flex flex-col gap-3 pb-4">
            <h3 className="text-text-strong-950 text-label-md font-semibold">
              {isLegal ? detail.section_legal_representative : detail.section_user_info}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={detail.field_full_name}>{user.fullName || '-'}</Field>
              <Field label={detail.field_status}>
                <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[user.status]}>
                  {dict.status_labels[user.status]}
                </Badge.Root>
              </Field>
              <Field label={detail.field_register_date}>
                {formatLongDate(user.termsAcceptedDate)}
              </Field>
              <Field label={detail.field_email}>{user.email}</Field>
              <Field label={detail.field_id_type}>{user.documentTypeName}</Field>
              <Field label={detail.field_id_number}>{user.documentNumber}</Field>
              <Field label={detail.field_person_type}>{dict.person_type_labels[user.type]}</Field>
              <Field label={detail.field_referral_code}>{user.referralCode || '-'}</Field>
              {!isLegal && (
                <>
                  <Field label={detail.field_earnings}>${user.earningsPerKwh}/kWh</Field>
                  <Field label={detail.field_laft_warning}>{user.laftWarning || '-'}</Field>
                </>
              )}
              {isLegal && user.company && (
                <>
                  <Field label={detail.field_legal_rep_phone}>
                    {formatPhone(user.company.legalRepresentativePhoneNumber)}
                  </Field>
                  <Field label={detail.field_legal_rep_laft}>
                    {user.company.legalRepresentativeLaftWarning || '-'}
                  </Field>
                </>
              )}
            </div>
          </section>

          {isLegal && user.company && (
            <section className="border-stroke-soft-200 flex flex-col gap-3 border-t pt-4">
              <h3 className="text-text-strong-950 text-label-md font-semibold">
                {detail.section_company}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={detail.field_company_name}>{user.company.name}</Field>
                <Field label={detail.field_nit}>{user.company.documentNumber}</Field>
                <Field label={detail.field_laft_warning}>{user.company.laftWarning || '-'}</Field>
                <Field label={detail.field_referral_code}>{user.referralCode || '-'}</Field>
                <Field label={detail.field_earnings}>${user.earningsPerKwh}/kWh</Field>
                {user.company.city && <Field label={detail.field_city}>{user.company.city}</Field>}
                {user.company.address && (
                  <Field label={detail.field_address}>{user.company.address}</Field>
                )}
              </div>
            </section>
          )}
        </Modal.Body>

        <Modal.Footer className="flex flex-col gap-3">
          {/* Acciones de cambio de estado — secondary basic toggleable.
              Cuando una está seleccionada, replica el visual del hover
              (bg-weak-50 + ring-sub-300) — patrón "filtros toggleables" del
              DS aplicado a 1-of-N en lugar de N-of-N. */}
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
              {detail.btn_approve}
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
              {detail.btn_on_hold}
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
              {detail.btn_deny}
            </Button.Root>
          </div>

          {needsReason && (
            <textarea
              className="border-stroke-soft-200 text-text-strong-950 focus:ring-stroke-strong-950 w-full rounded-lg border bg-transparent p-3 text-sm focus:ring-2 focus:outline-none"
              placeholder={detail.reason_placeholder}
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
            />
          )}

          <div className="flex justify-end gap-2">
            <FancyButton.Root variant="basic" size="medium" onClick={handleClose}>
              {detail.btn_cancel}
            </FancyButton.Root>
            <FancyButton.Root
              variant="primary"
              size="medium"
              disabled={!isConfirmEnabled()}
              state={updateStatus.isPending ? 'loading' : 'idle'}
              onClick={handleConfirm}
            >
              {detail.btn_confirm}
            </FancyButton.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
