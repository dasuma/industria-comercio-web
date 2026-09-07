'use client';

import { useState, type ReactNode } from 'react';
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, Hint, Input, Label, Skeleton, toast } from '@dasuma/pradma-ui';
import { RiDeleteBinLine, RiInformationLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { EntityDrawer } from '@/components/EntityDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { getPradmaDict } from '../../dictionaries';
import {
  useGetInterestRate,
  useCreateInterestRate,
  useUpdateInterestRate,
  useDeleteInterestRate
} from '../../data';

interface InterestRatePanelProps {
  locale: Locale;
  interestRateId: number | null;
  onClose: () => void;
}

interface FormValues {
  year: string;
  startDate: string;
  endDate: string;
  rateValue1: string;
  rateValue2: string;
  rateValue3: string;
  percentage: string;
  surchargePercentage: string;
  interestPercentage: string;
}

type DecimalField = Exclude<keyof FormValues, 'year' | 'startDate' | 'endDate'>;

const EMPTY_VALUES: FormValues = {
  year: '',
  startDate: '',
  endDate: '',
  rateValue1: '',
  rateValue2: '',
  rateValue3: '',
  percentage: '',
  surchargePercentage: '',
  interestPercentage: ''
};

const PanelSkeleton = () => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <Skeleton.Root className="h-3 w-24" />
        <Skeleton.Root className="h-9 w-full" />
      </div>
    ))}
  </div>
);

// Bloque con subtítulo: agrupa los 9 campos en 3 secciones legibles.
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h3 className="text-subheading-2xs text-text-sub-600 uppercase">{title}</h3>
    {children}
  </section>
);

interface DecimalFieldProps {
  name: DecimalField;
  label: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

const DecimalInput = ({ name, label, register, errors }: DecimalFieldProps) => (
  <FormField id={`ir-${name}`} label={label} required error={errors[name]?.message}>
    <Input.Root hasError={Boolean(errors[name])}>
      <Input.Wrapper>
        <Input.Input id={`ir-${name}`} inputMode="decimal" {...register(name)} />
      </Input.Wrapper>
    </Input.Root>
  </FormField>
);

export const InterestRatePanel = ({ locale, interestRateId, onClose }: InterestRatePanelProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.interestRates;
  const isEditing = interestRateId !== null;
  const { data: interestRate } = useGetInterestRate(interestRateId);
  const { mutate: createInterestRate, isPending: isCreating } = useCreateInterestRate();
  const { mutate: updateInterestRate, isPending: isUpdating } = useUpdateInterestRate();
  const { mutate: deleteInterestRate, isPending: isDeleting } = useDeleteInterestRate();
  const isPending = isCreating || isUpdating;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const numericString = (msg: string) =>
    z
      .string()
      .min(1, msg)
      .regex(/^\d+(\.\d+)?$/, msg);

  const schema = z
    .object({
      year: z.string().min(1, d.form.errors.yearRequired).regex(/^\d+$/, d.form.errors.yearInvalid),
      startDate: z.string().min(1, d.form.errors.startDateRequired),
      endDate: z.string().min(1, d.form.errors.endDateRequired),
      rateValue1: numericString(d.form.errors.percentageInvalid),
      rateValue2: numericString(d.form.errors.percentageInvalid),
      rateValue3: numericString(d.form.errors.percentageInvalid),
      percentage: numericString(d.form.errors.percentageInvalid),
      surchargePercentage: numericString(d.form.errors.percentageInvalid),
      interestPercentage: numericString(d.form.errors.percentageInvalid)
    })
    .refine(v => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
      message: d.form.errors.endDateBeforeStart,
      path: ['endDate']
    });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    values:
      isEditing && interestRate
        ? {
            year: String(interestRate.year),
            startDate: interestRate.startDate,
            endDate: interestRate.endDate,
            rateValue1: String(interestRate.rateValue1),
            rateValue2: String(interestRate.rateValue2),
            rateValue3: String(interestRate.rateValue3),
            percentage: String(interestRate.percentage),
            surchargePercentage: String(interestRate.surchargePercentage),
            interestPercentage: String(interestRate.interestPercentage)
          }
        : EMPTY_VALUES
  });

  const onSubmit = handleSubmit(values => {
    const payload = {
      year: Number(values.year),
      start_date: values.startDate,
      end_date: values.endDate,
      rate_value_1: Number(values.rateValue1),
      rate_value_2: Number(values.rateValue2),
      rate_value_3: Number(values.rateValue3),
      percentage: Number(values.percentage),
      surcharge_percentage: Number(values.surchargePercentage),
      interest_percentage: Number(values.interestPercentage)
    };

    if (isEditing && interestRate) {
      updateInterestRate(
        { id: interestRate.id, request: payload },
        {
          onSuccess: () => {
            toast.success(d.form.success.updated);
            onClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    } else {
      createInterestRate(payload, {
        onSuccess: () => {
          toast.success(d.form.success.created);
          onClose();
        },
        onError: () => toast.error(d.form.errors.serverError)
      });
    }
  });

  const handleDelete = () => {
    if (!interestRate) return;
    deleteInterestRate(interestRate.id, {
      onSuccess: () => {
        toast.success(d.success.deleted);
        setConfirmDelete(false);
        onClose();
      },
      onError: () => toast.error(dict.common.deleteError)
    });
  };

  return (
    <>
      <EntityDrawer
        open
        onClose={onClose}
        title={isEditing ? d.edit : d.create}
        cancelLabel={dict.common.cancel}
        submitLabel={dict.common.save}
        onSubmit={onSubmit}
        isSubmitting={isPending}
        loading={isEditing && !interestRate}
        loadingSlot={<PanelSkeleton />}
        footerStart={
          isEditing ? (
            // [R7] eliminar en el panel es destructivo no protagonista → error stroke
            <Button.Root
              variant="error"
              mode="stroke"
              size="small"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
            >
              <Button.Icon as={RiDeleteBinLine} />
              {dict.common.delete}
            </Button.Root>
          ) : null
        }
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <Section title={d.form.sections.validity}>
            {isEditing && interestRate ? (
              <div className="flex flex-col gap-1">
                <Label.Root>{d.fields.year}</Label.Root>
                <p className="bg-bg-weak-50 text-paragraph-sm text-text-sub-600 rounded-lg px-3 py-2">
                  {interestRate.year}
                </p>
              </div>
            ) : (
              <FormField id="ir-year" label={d.fields.year} required error={errors.year?.message}>
                <Input.Root hasError={Boolean(errors.year)}>
                  <Input.Wrapper>
                    <Input.Input id="ir-year" inputMode="numeric" {...register('year')} />
                  </Input.Wrapper>
                </Input.Root>
              </FormField>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="ir-start-date"
                label={d.fields.startDate}
                required
                error={errors.startDate?.message}
              >
                <Input.Root hasError={Boolean(errors.startDate)}>
                  <Input.Wrapper>
                    <Input.Input id="ir-start-date" type="date" {...register('startDate')} />
                  </Input.Wrapper>
                </Input.Root>
              </FormField>

              <FormField
                id="ir-end-date"
                label={d.fields.endDate}
                required
                error={errors.endDate?.message}
              >
                <Input.Root hasError={Boolean(errors.endDate)}>
                  <Input.Wrapper>
                    <Input.Input id="ir-end-date" type="date" {...register('endDate')} />
                  </Input.Wrapper>
                </Input.Root>
              </FormField>
            </div>
          </Section>

          <Section title={d.form.sections.rateValues}>
            <div className="grid grid-cols-3 gap-3">
              <DecimalInput
                name="rateValue1"
                label={d.fields.rateValue1}
                register={register}
                errors={errors}
              />
              <DecimalInput
                name="rateValue2"
                label={d.fields.rateValue2}
                register={register}
                errors={errors}
              />
              <DecimalInput
                name="rateValue3"
                label={d.fields.rateValue3}
                register={register}
                errors={errors}
              />
            </div>
            <Hint.Root>
              <Hint.Icon as={RiInformationLine} />
              {d.fields.rateValuesHint}
            </Hint.Root>
          </Section>

          <Section title={d.form.sections.percentages}>
            <div className="grid grid-cols-3 gap-3">
              <DecimalInput
                name="percentage"
                label={d.fields.percentage}
                register={register}
                errors={errors}
              />
              <DecimalInput
                name="surchargePercentage"
                label={d.fields.surchargePercentage}
                register={register}
                errors={errors}
              />
              <DecimalInput
                name="interestPercentage"
                label={d.fields.interestPercentage}
                register={register}
                errors={errors}
              />
            </div>
          </Section>
        </form>
      </EntityDrawer>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={d.delete}
        description={d.deleteConfirm}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
};
