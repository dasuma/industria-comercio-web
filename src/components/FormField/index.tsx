import type { ReactNode } from 'react';
import { Hint, Label } from '@biaenergy/ui';

interface FormFieldProps {
  id?: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

// Espaciado label → input → hint que usa CreateReportModal. Candidato a
// promoverlo al DS si validamos el patrón con más formularios.
export const FormField = ({ id, label, required, error, hint, children }: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <Label.Root htmlFor={id}>
      {label}
      {required ? <Label.Asterisk /> : null}
    </Label.Root>
    {children}
    {error ? <Hint.Root hasError>{error}</Hint.Root> : hint ? <Hint.Root>{hint}</Hint.Root> : null}
  </div>
);
