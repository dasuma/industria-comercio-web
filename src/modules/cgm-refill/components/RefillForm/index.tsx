'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label, Hint, Input, Datepicker, Popover, Checkbox, toast } from '@biaenergy/ui';
import { RiCalendarLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { useRefill } from '../../data';
import { getCgmRefillDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-refill.interface';

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

const schema = z
  .object({
    startDate: z
      .date()
      .refine(
        d => startOfDay(d) <= yesterday(),
        'La fecha inicio no puede ser hoy ni una fecha futura'
      ),
    endDate: z
      .date()
      .refine(d => startOfDay(d) <= today(), 'La fecha fin no puede ser una fecha futura'),
    reason: z.string().min(1, 'Required'),
    deleteOnly: z.boolean()
  })
  .refine(data => data.endDate >= data.startDate, {
    message: 'La fecha fin debe ser posterior o igual a la fecha inicio',
    path: ['endDate']
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
  const dict = getCgmRefillDict(locale);
  const f = dict.form;
  const { mutate } = useRefill();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deleteOnly: false }
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        contract_ids: [contract.id],
        start_date: toApiDatetime(values.startDate),
        end_date: toApiDatetime(values.endDate),
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

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label.Root htmlFor="startDate">
            {f.startDateLabel}
            <Label.Asterisk />
          </Label.Root>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Input.Root hasError={!!errors.startDate} className="cursor-pointer">
                    <Input.Wrapper>
                      <Input.Input
                        id="startDate"
                        readOnly
                        placeholder={f.startDateLabel}
                        value={field.value ? formatDate(field.value, locale) : ''}
                        className="cursor-pointer"
                      />
                      <Input.Icon as={RiCalendarLine} />
                    </Input.Wrapper>
                  </Input.Root>
                </Popover.Trigger>
                <Popover.Content align="start" className="p-0">
                  <Datepicker.Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{ after: yesterday() }}
                  />
                </Popover.Content>
              </Popover.Root>
            )}
          />
          {errors.startDate && <Hint.Root hasError>{errors.startDate.message}</Hint.Root>}
        </div>

        <div>
          <Label.Root htmlFor="endDate">
            {f.endDateLabel}
            <Label.Asterisk />
          </Label.Root>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Input.Root hasError={!!errors.endDate} className="cursor-pointer">
                    <Input.Wrapper>
                      <Input.Input
                        id="endDate"
                        readOnly
                        placeholder={f.endDateLabel}
                        value={field.value ? formatDate(field.value, locale) : ''}
                        className="cursor-pointer"
                      />
                      <Input.Icon as={RiCalendarLine} />
                    </Input.Wrapper>
                  </Input.Root>
                </Popover.Trigger>
                <Popover.Content align="start" className="p-0">
                  <Datepicker.Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{ after: today() }}
                  />
                </Popover.Content>
              </Popover.Root>
            )}
          />
          {errors.endDate && <Hint.Root hasError>{errors.endDate.message}</Hint.Root>}
        </div>
      </div>

      <div>
        <Label.Root htmlFor="reason">
          {f.reasonLabel}
          <Label.Asterisk />
        </Label.Root>
        <Input.Root hasError={!!errors.reason}>
          <Input.Wrapper>
            <Input.Input id="reason" placeholder={f.reasonPlaceholder} {...register('reason')} />
          </Input.Wrapper>
        </Input.Root>
        {errors.reason && <Hint.Root hasError>{errors.reason.message}</Hint.Root>}
      </div>

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
