'use client';

import { Button, FancyButton, Modal } from '@dasuma/pradma-ui';
import { RiDeleteBinLine } from '@dasuma/pradma-ui/icons';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  destructive?: boolean;
}

// Modal canónico de confirmación (P3). Para eliminar: FancyButton destructive
// + Button basic para cancelar (R7).
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isPending = false,
  destructive = true
}: ConfirmDialogProps) => (
  <Modal.Root open={open} onOpenChange={isPending ? undefined : onOpenChange}>
    <Modal.Content className="max-w-md">
      <Modal.Header
        icon={destructive ? RiDeleteBinLine : undefined}
        title={title}
        description={description}
      />
      <Modal.Footer>
        <Button.Root
          variant="basic"
          className="w-full"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          {cancelLabel}
        </Button.Root>
        <FancyButton.Root
          variant={destructive ? 'destructive' : undefined}
          className="w-full"
          onClick={onConfirm}
          state={isPending ? 'loading' : 'idle'}
          disabled={isPending}
        >
          {confirmLabel}
        </FancyButton.Root>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Root>
);
