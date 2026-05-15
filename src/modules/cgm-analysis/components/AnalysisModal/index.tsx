'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FancyButton, Input, Popover, Select, Modal } from '@biaenergy/ui';
import { RiCalendarLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { FormField } from '@components/FormField';
import { SmallCalendar } from '@components/SmallCalendar';
import {
  REPORT_PERIODS,
  type Contract,
  type ReportPeriod
} from '../../models/cgm-analysis.interface';
import { getCgmAnalysisDict } from '../../dictionaries';

const FORM_ID = 'analysis-form';

// react-day-picker's DateRange exige `from: Date | undefined`. RHF maneja
// el shape laxo `{ from?, to? }`, así que tenemos los dos tipos y
// normalizamos al pasar el valor al calendario.
type RangeValue = { from?: Date; to?: Date };

const schema = z.object({
  range: z
    .object({
      from: z.date().optional(),
      to: z.date().optional()
    })
    .refine(r => !!r.from && !!r.to, { message: 'rangeRequired' }),
  period: z.enum(REPORT_PERIODS)
});

type FormValues = z.infer<typeof schema>;

interface AnalysisModalProps {
  locale: Locale;
  contract: Contract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { startDate: Date; endDate: Date; period: ReportPeriod }) => void;
  isPending: boolean;
}

// Radix Popover/Select renderiza su Content en un portal — al clickear
// adentro o afuera estando abierto, el `onInteractOutside` del Dialog
// se dispara y cerraría el modal. Replicamos el guard de CreateReportModal.
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

export const AnalysisModal = ({
  locale,
  contract,
  open,
  onOpenChange,
  onSubmit,
  isPending
}: AnalysisModalProps) => {
  const dict = getCgmAnalysisDict(locale);
  const a = dict.analysis;
  const [isRangeOpen, setRangeOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { period: '15m', range: { from: undefined, to: undefined } }
  });

  useEffect(() => {
    if (!open) {
      reset({ period: '15m', range: { from: undefined, to: undefined } });
      // Sync popover state al unmount del modal: si quedó abierto al cerrar
      // el modal (ej. usuario apretó Esc con el calendario visible),
      // queremos que vuelva a aparecer cerrado la próxima vez.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRangeOpen(false);
    }
  }, [open, reset]);

  const submit = (values: FormValues) => {
    onSubmit({
      startDate: values.range.from!,
      endDate: values.range.to!,
      period: values.period
    });
  };

  const formatRange = (range: RangeValue | undefined): string => {
    if (!range?.from) return '';
    if (!range.to) return formatDate(range.from, locale);
    return `${formatDate(range.from, locale)} – ${formatDate(range.to, locale)}`;
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content onInteractOutside={guardModalInteractOutside}>
        <Modal.Header title={a.modalTitle} description={contract.name} />
        <Modal.Body>
          <form id={FORM_ID} onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
            <FormField
              id="range"
              label={a.dateRangeLabel}
              required
              error={errors.range ? a.rangeError : undefined}
            >
              <Controller
                control={control}
                name="range"
                render={({ field }) => {
                  const value = field.value as RangeValue | undefined;
                  return (
                    <Popover.Root open={isRangeOpen} onOpenChange={setRangeOpen}>
                      <Popover.Trigger asChild>
                        <Input.Root
                          hasError={!!errors.range}
                          className="cursor-pointer"
                          // Bypass del toggle nativo de Popover.Trigger: el
                          // `<label>` de Input.Wrapper dispatcha una click
                          // sintética sobre el input cuando se clickea el
                          // ícono, y Radix tooglea dos veces (abre y cierra).
                          // En vez de luchar con el evento, hacemos el open
                          // idempotente: cualquier click abre, cerrar se
                          // delega al outside-click y al onSelect del día.
                          onClick={e => {
                            e.preventDefault();
                            setRangeOpen(true);
                          }}
                        >
                          <Input.Wrapper>
                            <Input.Input
                              id="range"
                              readOnly
                              placeholder={a.dateRangePlaceholder}
                              value={formatRange(value)}
                              className="cursor-pointer"
                            />
                            <Input.Icon as={RiCalendarLine} />
                          </Input.Wrapper>
                        </Input.Root>
                      </Popover.Trigger>
                      <Popover.Content align="start" className="p-0">
                        <SmallCalendar
                          mode="range"
                          selected={value?.from ? { from: value.from, to: value.to } : undefined}
                          onSelect={range => {
                            field.onChange(range);
                            if (range?.from && range.to) setRangeOpen(false);
                          }}
                          disabled={{ after: new Date() }}
                          numberOfMonths={2}
                        />
                      </Popover.Content>
                    </Popover.Root>
                  );
                }}
              />
            </FormField>

            <FormField id="period" label={a.periodLabel} required>
              <Controller
                control={control}
                name="period"
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger id="period">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {REPORT_PERIODS.map(p => (
                        <Select.Item key={p} value={p}>
                          {a.periods[p]}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </FormField>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <FancyButton.Root type="button" variant="basic" size="medium">
              {a.cancel}
            </FancyButton.Root>
          </Modal.Close>
          <FancyButton.Root
            type="submit"
            form={FORM_ID}
            variant="primary"
            size="medium"
            disabled={isPending}
          >
            {a.submit}
          </FancyButton.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
