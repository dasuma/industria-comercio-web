'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label, Input, Popover, Checkbox, toast } from '@biaenergy/ui';
import { RiCalendarLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { FormField } from '@components/FormField';
import { SmallCalendar } from '@components/SmallCalendar';
import { useRefill } from '../../data';
import { getCgmAnalysisDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-analysis.interface';

type RangeValue = { from?: Date; to?: Date };

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const today = () => startOfDay(new Date());
const yesterday = () => {
  const d = today();
  d.setDate(d.getDate() - 1);
  return d;
};

const schema = z.object({
  range: z
    .object({
      from: z.date().optional(),
      to: z.date().optional()
    })
    .refine(r => !!r.from && !!r.to, { message: 'rangeRequired' })
    .refine(r => !r.from || startOfDay(r.from) <= yesterday(), {
      message: 'La fecha inicio no puede ser hoy ni una fecha futura'
    })
    .refine(r => !r.to || startOfDay(r.to) <= today(), {
      message: 'La fecha fin no puede ser una fecha futura'
    }),
  reason: z.string().min(1, 'Required'),
  deleteOnly: z.boolean()
});

type FormValues = z.infer<typeof schema>;

/** Formats a Date as "YYYY-MM-DD 00:00:00" required by the API */
const toApiDatetime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 00:00:00`;
};

interface RefillFormProps {
  locale: Locale;
  contract: Contract;
  onSuccess?: () => void;
  formId?: string;
}

export const RefillForm = ({
  locale,
  contract,
  onSuccess,
  formId = 'refill-form'
}: RefillFormProps) => {
  const dict = getCgmAnalysisDict(locale);
  const f = dict.refill;
  const a = dict.analysis;
  const { mutate } = useRefill();
  const [isRangeOpen, setRangeOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { range: { from: undefined, to: undefined }, deleteOnly: false }
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        contract_ids: [contract.id],
        start_date: toApiDatetime(values.range.from!),
        end_date: toApiDatetime(values.range.to!),
        delete_only: values.deleteOnly,
        reason: values.reason
      },
      {
        onSuccess: () => {
          toast.success(f.success);
          reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error(f.error);
        }
      }
    );
  };

  const formatRange = (range: RangeValue | undefined): string => {
    if (!range?.from) return '';
    if (!range.to) return formatDate(range.from, locale);
    return `${formatDate(range.from, locale)} – ${formatDate(range.to, locale)}`;
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField
        id="range"
        label={a.dateRangeLabel}
        required
        error={errors.range ? (errors.range.message ?? a.rangeError) : undefined}
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
                    // Bypass del toggle nativo de Popover.Trigger: el <label>
                    // de Input.Wrapper dispatcha una click sintética sobre el
                    // input cuando se clickea el ícono y Radix tooglea dos
                    // veces. Hacemos el open idempotente; cerrar se delega
                    // al outside-click y al onSelect del rango.
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
                    disabled={{ after: today() }}
                    numberOfMonths={2}
                  />
                </Popover.Content>
              </Popover.Root>
            );
          }}
        />
      </FormField>

      <FormField id="reason" label={f.reasonLabel} required error={errors.reason?.message}>
        <Input.Root hasError={!!errors.reason}>
          <Input.Wrapper>
            <Input.Input id="reason" placeholder={f.reasonPlaceholder} {...register('reason')} />
          </Input.Wrapper>
        </Input.Root>
      </FormField>

      <Controller
        control={control}
        name="deleteOnly"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox.Root id="deleteOnly" checked={field.value} onCheckedChange={field.onChange} />
            <Label.Root htmlFor="deleteOnly" className="cursor-pointer">
              {f.deleteOnlyLabel}
            </Label.Root>
          </div>
        )}
      />
    </form>
  );
};
