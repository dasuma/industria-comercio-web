'use client';

import { FancyButton, Modal } from '@biaenergy/ui';
import type { BianetworkDictionary } from '../../dictionaries';
import type { BiaNetworkUser } from '../../models/user';

interface UpgradeToProModalProps {
  isOpen: boolean;
  user: BiaNetworkUser | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dict: BianetworkDictionary['users'];
}

export const UpgradeToProModal = ({
  isOpen,
  user,
  loading,
  onClose,
  onConfirm,
  dict
}: UpgradeToProModalProps) => {
  return (
    <Modal.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Modal.Content className="max-w-[336px]">
        <Modal.Header title={dict.upgrade_modal.title} />
        <Modal.Body>
          <p className="text-paragraph-sm text-text-sub-600">
            {dict.upgrade_modal.description.replace('{name}', user?.fullName ?? '—')}
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <FancyButton.Root variant="basic" size="medium" onClick={onClose}>
            {dict.upgrade_modal.btn_cancel}
          </FancyButton.Root>
          <FancyButton.Root
            variant="primary"
            size="medium"
            state={loading ? 'loading' : 'idle'}
            onClick={onConfirm}
          >
            {dict.upgrade_modal.btn_confirm}
          </FancyButton.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
