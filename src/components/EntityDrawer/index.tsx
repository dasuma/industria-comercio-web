'use client';

import type { ReactNode } from 'react';
import { Button, Drawer, FancyButton } from '@dasuma/pradma-ui';

interface EntityDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Slot izquierdo del footer (ej. botón Eliminar). */
  footerStart?: ReactNode;
  cancelLabel: string;
  submitLabel: string;
  onSubmit: () => void;
  /** Muestra el loader nativo del DS en el submit (P6) y bloquea el cierre. */
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  /** Reemplaza el body (ej. skeleton mientras carga la entidad a editar). */
  loading?: boolean;
  loadingSlot?: ReactNode;
}

// Drawer canónico de crear/editar entidad. Usa el `Drawer` del DS (R1) — Escape,
// focus trap, overlay y animación vienen del componente; acá solo va la
// composición Header + Body(form) + Footer(cancel/submit).
export const EntityDrawer = ({
  open,
  onClose,
  title,
  description,
  children,
  footerStart,
  cancelLabel,
  submitLabel,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  loading = false,
  loadingSlot
}: EntityDrawerProps) => (
  <Drawer.Root open={open} onClose={onClose} width="md" closeOnOverlayClick={!isSubmitting}>
    <Drawer.Header>
      <h2 className="text-label-lg text-text-strong-950">{title}</h2>
      {description ? (
        <p className="text-paragraph-sm text-text-sub-600 mt-0.5">{description}</p>
      ) : null}
    </Drawer.Header>
    <Drawer.Body>{loading ? loadingSlot : children}</Drawer.Body>
    <Drawer.Footer className="flex items-center justify-between gap-3">
      <div>{footerStart}</div>
      <div className="flex items-center gap-3">
        {/* [R7] Cancelar = secondary basic; guardar = FancyButton default */}
        <Button.Root variant="basic" onClick={onClose} disabled={isSubmitting}>
          {cancelLabel}
        </Button.Root>
        <FancyButton.Root
          onClick={onSubmit}
          state={isSubmitting ? 'loading' : 'idle'}
          disabled={loading || submitDisabled || isSubmitting}
        >
          {submitLabel}
        </FancyButton.Root>
      </div>
    </Drawer.Footer>
  </Drawer.Root>
);
