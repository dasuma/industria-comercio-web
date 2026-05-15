'use client';

import { AlertToast, toast } from '@biaenergy/ui';

export type ToastStatus = 'information' | 'success' | 'warning' | 'error' | 'feature';

// Wrapper que usa el renderer del DS (AlertToast.Root) en lugar del default
// de Sonner. Esto da el tratamiento glass-popup + tonos sutiles del lenguaje
// BIA. Para mensajes "echo de acción del usuario" (ej: "Guardado", "Aprobado").
// Si necesitas mensajes persistentes con title + description, usá `notification()`.
//
// Nota: el `toast.custom` del DS aplica `position: "bottom-center"` por default
// (sobrescribe el del <Toaster>). Forzamos "top-right" en el override.
export const showToast = (status: ToastStatus, message: string): string | number =>
  toast.custom(t => <AlertToast.Root t={t} status={status} message={message} />, {
    position: 'top-right'
  });
