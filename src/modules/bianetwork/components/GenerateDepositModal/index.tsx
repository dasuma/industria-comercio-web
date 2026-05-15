'use client';

import { useState } from 'react';
import { Modal, SegmentedControl } from '@biaenergy/ui';
import type { BianetworkDictionary } from '../../dictionaries';
import { ExcelDepositUpload } from './ExcelDepositUpload';
import { ManualDepositForm } from './ManualDepositForm';

type Mode = 'manual' | 'excel';

interface GenerateDepositModalProps {
  isOpen: boolean;
  initialMode?: Mode;
  onClose: () => void;
  dict: BianetworkDictionary['generate_deposit_modal'];
  sharedDict: BianetworkDictionary['shared'];
}

export const GenerateDepositModal = ({
  isOpen,
  initialMode = 'manual',
  onClose,
  dict,
  sharedDict
}: GenerateDepositModalProps) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <Modal.Root
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
        else setMode(initialMode);
      }}
    >
      <Modal.Content className="flex max-h-[90vh] max-w-[640px] flex-col">
        <Modal.Header title={dict.title} description={dict.description} />
        <Modal.Body className="flex flex-col gap-4 overflow-y-auto">
          <SegmentedControl.Root value={mode} onValueChange={value => setMode(value as Mode)}>
            <SegmentedControl.List>
              <SegmentedControl.Trigger value="manual">{dict.tab_manual}</SegmentedControl.Trigger>
              <SegmentedControl.Trigger value="excel">{dict.tab_excel}</SegmentedControl.Trigger>
            </SegmentedControl.List>
          </SegmentedControl.Root>

          {mode === 'manual' ? (
            <ManualDepositForm dict={dict} sharedDict={sharedDict} onSuccess={onClose} />
          ) : (
            <ExcelDepositUpload dict={dict} sharedDict={sharedDict} onSuccess={onClose} />
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
