'use client';

import { useState } from 'react';
import { FancyButton, Modal } from '@biaenergy/ui';
import { RiFlashlightLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getCgmAnalysisDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-analysis.interface';
import { RefillForm } from '../RefillForm';

const FORM_ID = 'refill-form';

interface RefillModalProps {
  locale: Locale;
  contract: Contract;
  onAfterRefill?: () => void;
}

// Mismo guard que CreateReportModal: si el Popover (Radix portal) está
// abierto, una interacción "fuera" del modal debería cerrar SOLO ese
// popover, no el modal completo.
const guardModalInteractOutside = (event: {
  target: EventTarget | null;
  preventDefault: () => void;
}) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest('[data-radix-popper-content-wrapper]')) {
    event.preventDefault();
    return;
  }
  if (document.querySelector('[data-radix-popper-content-wrapper] [data-state="open"]')) {
    event.preventDefault();
  }
};

export const RefillModal = ({ locale, contract, onAfterRefill }: RefillModalProps) => {
  const dict = getCgmAnalysisDict(locale);
  const f = dict.refill;
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <FancyButton.Root type="button" variant="primary" size="xsmall">
          <FancyButton.Icon as={RiFlashlightLine} />
          {f.button}
        </FancyButton.Root>
      </Modal.Trigger>

      <Modal.Content onInteractOutside={guardModalInteractOutside}>
        <Modal.Header title={f.modalTitle} description={contract.name} />
        <Modal.Body>
          <RefillForm
            locale={locale}
            contract={contract}
            formId={FORM_ID}
            onSuccess={() => {
              setOpen(false);
              onAfterRefill?.();
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <FancyButton.Root type="button" variant="basic" size="medium">
              {f.cancel}
            </FancyButton.Root>
          </Modal.Close>
          <FancyButton.Root type="submit" form={FORM_ID} variant="primary" size="medium">
            {f.submit}
          </FancyButton.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
