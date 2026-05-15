'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FancyButton, Hint, Input, Label, Modal, Popover, Select, toast } from '@biaenergy/ui';
import { RiAddLine, RiCalendarLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { SmallCalendar } from '@components/SmallCalendar';
import { getCgmReportDict } from '../../dictionaries';
import { useCreateReport } from '../../data';
import { REPORT_KINDS } from '../../models/cgm-report.interface';

const schema = z.object({
  contractIds: z
    .string()
    .min(1, 'Required')
    .transform(v =>
      v
        .split(',')
        .map(s => Number(s.trim()))
        .filter(n => !isNaN(n) && n > 0)
    )
    .refine(arr => arr.length > 0, 'Ingresá al menos un ID válido'),
  kind: z.enum(REPORT_KINDS),
  date: z.date()
});

type FormValues = z.infer<typeof schema>;

interface CreateReportModalProps {
  locale: Locale;
}

export const CreateReportModal = ({ locale }: CreateReportModalProps) => {
  const dict = getCgmReportDict(locale);
  const [open, setOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const { mutate, isPending } = useCreateReport();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractIds: '' as unknown as number[],
      kind: undefined,
      date: undefined
    }
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        contractIds: values.contractIds,
        type: 'DAILY',
        kind: values.kind,
        date: values.date.toISOString().split('T')[0] ?? ''
      },
      {
        onSuccess: () => {
          toast.success(dict.modal.success);
          reset();
          setOpen(false);
        },
        onError: () => {
          toast.error(dict.modal.error);
        }
      }
    );
  };

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <FancyButton.Root type="button" variant="primary" size="xsmall">
          <FancyButton.Icon as={RiAddLine} />
          {dict.createReport}
        </FancyButton.Root>
      </Modal.Trigger>
      <Modal.Content
        // Radix Popover/Select renderiza su Content en un portal — al clickear
        // ahí adentro o afuera estando abierto, el `onInteractOutside` del
        // Dialog se dispara y cerraría el modal. Dos guardas:
        //   1) Si el target está dentro del portal del popper → cancelamos
        //      (click dentro del propio popup).
        //   2) Si hay ALGÚN popper abierto en el DOM (data-state="open") →
        //      la primera interacción afuera debe cerrar solo ese popper, no
        //      el modal. El popper se cierra por su propio handler — nosotros
        //      sólo evitamos que el modal también se cierre.
        onInteractOutside={event => {
          const target = event.target as HTMLElement | null;
          if (target?.closest('[data-radix-popper-content-wrapper]')) {
            event.preventDefault();
            return;
          }
          if (document.querySelector('[data-radix-popper-content-wrapper] [data-state="open"]')) {
            event.preventDefault();
          }
        }}
      >
        <Modal.Header title={dict.modal.title} description={dict.modal.description} />
        <Modal.Body>
          <form
            id="create-report-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="contractIds">
                {dict.modal.contractIdsLabel}
                <Label.Asterisk />
              </Label.Root>
              <Input.Root hasError={!!errors.contractIds}>
                <Input.Wrapper>
                  <Input.Input
                    id="contractIds"
                    placeholder={dict.modal.contractIdsPlaceholder}
                    {...register('contractIds')}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.contractIds ? (
                <Hint.Root hasError>{errors.contractIds.message}</Hint.Root>
              ) : (
                <Hint.Root>{dict.modal.contractIdsHint}</Hint.Root>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="type">{dict.modal.typeLabel}</Label.Root>
              <Select.Root value="DAILY" disabled>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="DAILY">{dict.reportTypes.DAILY}</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="kind">
                {dict.modal.kindLabel}
                <Label.Asterisk />
              </Label.Root>
              <Controller
                control={control}
                name="kind"
                render={({ field }) => (
                  <Select.Root value={field.value ?? ''} onValueChange={field.onChange}>
                    <Select.Trigger>
                      <Select.Value placeholder={dict.modal.kindPlaceholder} />
                    </Select.Trigger>
                    <Select.Content>
                      {REPORT_KINDS.map(k => (
                        <Select.Item key={k} value={k}>
                          {dict.reportKinds[k]}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.kind && <Hint.Root hasError>{errors.kind.message}</Hint.Root>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="date">
                {dict.modal.dateLabel}
                <Label.Asterisk />
              </Label.Root>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover.Root open={isDateOpen} onOpenChange={setIsDateOpen}>
                    <Popover.Trigger asChild>
                      <Input.Root
                        hasError={!!errors.date}
                        className="cursor-pointer"
                        // Bypass del toggle nativo de Popover.Trigger: el
                        // <label> de Input.Wrapper dispatcha una click
                        // sintética sobre el input cuando se clickea el
                        // ícono y Radix tooglea dos veces. Hacemos el open
                        // idempotente; cerrar se delega al outside-click y
                        // al onSelect del día.
                        onClick={e => {
                          e.preventDefault();
                          setIsDateOpen(true);
                        }}
                      >
                        <Input.Wrapper>
                          <Input.Input
                            id="date"
                            readOnly
                            placeholder={dict.modal.dateLabel}
                            value={field.value ? formatDate(field.value, locale) : ''}
                            className="cursor-pointer"
                          />
                          <Input.Icon as={RiCalendarLine} />
                        </Input.Wrapper>
                      </Input.Root>
                    </Popover.Trigger>
                    <Popover.Content align="start" className="p-0">
                      <SmallCalendar
                        mode="single"
                        selected={field.value}
                        onSelect={date => {
                          field.onChange(date);
                          // Cerramos el popover apenas se elige un día —
                          // patrón de "single picker" donde la elección es
                          // implícitamente la confirmación.
                          if (date) setIsDateOpen(false);
                        }}
                        disabled={{ after: new Date() }}
                      />
                    </Popover.Content>
                  </Popover.Root>
                )}
              />
              {errors.date && <Hint.Root hasError>{errors.date.message}</Hint.Root>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <FancyButton.Root type="button" variant="basic" size="medium">
              {dict.modal.cancel}
            </FancyButton.Root>
          </Modal.Close>
          <FancyButton.Root
            variant="primary"
            size="medium"
            type="submit"
            form="create-report-form"
            disabled={isPending}
          >
            {dict.modal.submit}
          </FancyButton.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
