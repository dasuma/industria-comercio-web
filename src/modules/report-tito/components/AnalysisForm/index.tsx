'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Label, Hint, Input, Datepicker, Popover, Select } from '@biaenergy/ui';
import { RiCalendarLine, RiBarChartLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { REPORT_PERIODS } from '../../models/report-tito.interface';
import type { ReportPeriod } from '../../models/report-tito.interface';
import { getReportTitoDict } from '../../dictionaries';
import type { Contract } from '@modules/cgm-refill';

const schema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    period: z.enum(REPORT_PERIODS)
  })
  .refine(d => d.endDate >= d.startDate, {
    message: 'La fecha fin debe ser posterior o igual a la fecha inicio',
    path: ['endDate']
  });

type FormValues = z.infer<typeof schema>;

interface AnalysisFormProps {
  locale: Locale;
  contract: Contract;
  onSubmit: (values: { startDate: Date; endDate: Date; period: ReportPeriod }) => void;
  isPending: boolean;
}

const toDateStr = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const AnalysisForm = ({
  locale,
  contract: _contract,
  onSubmit,
  isPending
}: AnalysisFormProps) => {
  const dict = getReportTitoDict(locale);
  const f = dict.form;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { period: '15m' }
  });

  const handleValid = (values: FormValues) => onSubmit(values);

  return (
    <div className="bg-bg-white-0 border-stroke-soft-200 rounded-xl border p-4">
      <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
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
                      disabled={{ after: new Date() }}
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
                      disabled={{ after: new Date() }}
                    />
                  </Popover.Content>
                </Popover.Root>
              )}
            />
            {errors.endDate && <Hint.Root hasError>{errors.endDate.message}</Hint.Root>}
          </div>
        </div>

        <div>
          <Label.Root htmlFor="period">
            {f.periodLabel}
            <Label.Asterisk />
          </Label.Root>
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
                      {f.periods[p]}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button.Root
            type="submit"
            variant="primary"
            mode="filled"
            size="medium"
            disabled={isPending}
          >
            <Button.Icon as={RiBarChartLine} />
            {f.submit}
          </Button.Root>
        </div>
      </form>
    </div>
  );
};

export { toDateStr };
