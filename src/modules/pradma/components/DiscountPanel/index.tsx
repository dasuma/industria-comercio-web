'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, Input, Label, Skeleton, toast } from '@dasuma/pradma-ui';
import { RiDeleteBinLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { EntityDrawer } from '@/components/EntityDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { getPradmaDict } from '../../dictionaries';
import {
  useGetDiscount,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount
} from '../../data';

interface DiscountPanelProps {
  locale: Locale;
  discountId: number | null;
  onClose: () => void;
}

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

export const DiscountPanel = ({ locale, discountId, onClose }: DiscountPanelProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.discounts;
  const isEditing = discountId !== null;
  const { data: discount } = useGetDiscount(discountId);
  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();
  const { mutate: updateDiscount, isPending: isUpdating } = useUpdateDiscount();
  const { mutate: deleteDiscount, isPending: isDeleting } = useDeleteDiscount();
  const isPending = isCreating || isUpdating;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const schema = z
    .object({
      year: z.string().min(1, d.form.errors.yearRequired).regex(/^\d+$/, d.form.errors.yearInvalid),
      startDate: z.string().min(1, d.form.errors.startDateRequired),
      endDate: z.string().min(1, d.form.errors.endDateRequired),
      percentage: z
        .string()
        .min(1, d.form.errors.percentageRequired)
        .regex(/^\d+(\.\d+)?$/, d.form.errors.percentageInvalid)
    })
    .refine(v => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
      message: d.form.errors.endDateBeforeStart,
      path: ['endDate']
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    values:
      isEditing && discount
        ? {
            year: String(discount.year),
            startDate: discount.startDate,
            endDate: discount.endDate,
            percentage: String(discount.percentage)
          }
        : { year: '', startDate: '', endDate: '', percentage: '' }
  });

  const onSubmit = handleSubmit(values => {
    const payload = {
      year: Number(values.year),
      start_date: values.startDate,
      end_date: values.endDate,
      percentage: Number(values.percentage)
    };

    if (isEditing && discount) {
      updateDiscount(
        { id: discount.id, request: payload },
        {
          onSuccess: () => {
            toast.success(d.form.success.updated);
            onClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    } else {
      createDiscount(payload, {
        onSuccess: () => {
          toast.success(d.form.success.created);
          onClose();
        },
        onError: () => toast.error(d.form.errors.serverError)
      });
    }
  });

  const handleDelete = () => {
    if (!discount) return;
    deleteDiscount(discount.id, {
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
        loading={isEditing && !discount}
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
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {isEditing && discount ? (
            <div className="flex flex-col gap-1">
              <Label.Root>{d.fields.year}</Label.Root>
              <p className="bg-bg-weak-50 text-paragraph-sm text-text-sub-600 rounded-lg px-3 py-2">
                {discount.year}
              </p>
            </div>
          ) : (
            <FormField
              id="discount-year"
              label={d.fields.year}
              required
              error={errors.year?.message}
            >
              <Input.Root hasError={Boolean(errors.year)}>
                <Input.Wrapper>
                  <Input.Input id="discount-year" inputMode="numeric" {...register('year')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="discount-start"
              label={d.fields.startDate}
              required
              error={errors.startDate?.message}
            >
              <Input.Root hasError={Boolean(errors.startDate)}>
                <Input.Wrapper>
                  <Input.Input id="discount-start" type="date" {...register('startDate')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>

            <FormField
              id="discount-end"
              label={d.fields.endDate}
              required
              error={errors.endDate?.message}
            >
              <Input.Root hasError={Boolean(errors.endDate)}>
                <Input.Wrapper>
                  <Input.Input id="discount-end" type="date" {...register('endDate')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          </div>

          <FormField
            id="discount-percentage"
            label={d.fields.percentage}
            required
            error={errors.percentage?.message}
          >
            <Input.Root hasError={Boolean(errors.percentage)}>
              <Input.Wrapper>
                <Input.Input
                  id="discount-percentage"
                  inputMode="decimal"
                  {...register('percentage')}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>
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
