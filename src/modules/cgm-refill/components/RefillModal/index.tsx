'use client';

import { useState } from 'react';
import { Button, Modal } from '@biaenergy/ui';
import { RiFlashlightLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getCgmRefillDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-refill.interface';
import { RefillForm } from '../RefillForm';

const FORM_ID = 'refill-form';

interface RefillModalProps {
  locale: Locale;
  contract: Contract;
  onAfterRefill?: () => void;
}

export const RefillModal = ({ locale, contract, onAfterRefill }: RefillModalProps) => {
  const dict = getCgmRefillDict(locale);
  const f = dict.form;
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant="primary" mode="filled" size="medium">
          <Button.Icon as={RiFlashlightLine} />
          {f.submit}
        </Button.Root>
      </Modal.Trigger>

      <Modal.Content>
        <Modal.Header title={f.title} description={contract.name} />
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
            <Button.Root variant="neutral" mode="stroke" size="medium">
              {f.cancel}
            </Button.Root>
          </Modal.Close>
          <Button.Root variant="primary" mode="filled" size="medium" type="submit" form={FORM_ID}>
            <Button.Icon as={RiFlashlightLine} />
            {f.submit}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
