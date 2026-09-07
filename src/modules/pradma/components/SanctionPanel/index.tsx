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
  useGetSanction,
  useCreateSanction,
  useUpdateSanction,
  useDeleteSanction
} from '../../data';

interface SanctionPanelProps {
  locale: Locale;
  sanctionId: number | null;
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

export const SanctionPanel = ({ locale, sanctionId, onClose }: SanctionPanelProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.sanctions;
  const isEditing = sanctionId !== null;
  const { data: sanction } = useGetSanction(sanctionId);
  const { mutate: createSanction, isPending: isCreating } = useCreateSanction();
  const { mutate: updateSanction, isPending: isUpdating } = useUpdateSanction();
  const { mutate: deleteSanction, isPending: isDeleting } = useDeleteSanction();
  const isPending = isCreating || isUpdating;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const schema = z.object({
    year: z.string().min(1, d.form.errors.yearRequired).regex(/^\d+$/, d.form.errors.yearInvalid),
    percentage: z
      .string()
      .min(1, d.form.errors.percentageRequired)
      .regex(/^\d+(\.\d+)?$/, d.form.errors.percentageInvalid),
    minSanction: z
      .string()
      .min(1, d.form.errors.minSanctionRequired)
      .regex(/^\d+(\.\d+)?$/, d.form.errors.minSanctionInvalid),
    minSanctionAlt: z
      .string()
      .min(1, d.form.errors.minSanctionAltRequired)
      .regex(/^\d+(\.\d+)?$/, d.form.errors.minSanctionAltInvalid)
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
      isEditing && sanction
        ? {
            year: String(sanction.year),
            percentage: String(sanction.percentage),
            minSanction: String(sanction.minSanction),
            minSanctionAlt: String(sanction.minSanctionAlt)
          }
        : { year: '', percentage: '', minSanction: '', minSanctionAlt: '' }
  });

  const onSubmit = handleSubmit(values => {
    const payload = {
      year: Number(values.year),
      percentage: Number(values.percentage),
      min_sanction: Number(values.minSanction),
      min_sanction_alt: Number(values.minSanctionAlt)
    };

    if (isEditing && sanction) {
      updateSanction(
        { id: sanction.id, request: payload },
        {
          onSuccess: () => {
            toast.success(d.form.success.updated);
            onClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    } else {
      createSanction(payload, {
        onSuccess: () => {
          toast.success(d.form.success.created);
          onClose();
        },
        onError: () => toast.error(d.form.errors.serverError)
      });
    }
  });

  const handleDelete = () => {
    if (!sanction) return;
    deleteSanction(sanction.id, {
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
        loading={isEditing && !sanction}
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
          {isEditing && sanction ? (
            <div className="flex flex-col gap-1">
              <Label.Root>{d.fields.year}</Label.Root>
              <p className="bg-bg-weak-50 text-paragraph-sm text-text-sub-600 rounded-lg px-3 py-2">
                {sanction.year}
              </p>
            </div>
          ) : (
            <FormField
              id="sanction-year"
              label={d.fields.year}
              required
              error={errors.year?.message}
            >
              <Input.Root hasError={Boolean(errors.year)}>
                <Input.Wrapper>
                  <Input.Input id="sanction-year" inputMode="numeric" {...register('year')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          )}

          <FormField
            id="sanction-percentage"
            label={d.fields.percentage}
            required
            error={errors.percentage?.message}
          >
            <Input.Root hasError={Boolean(errors.percentage)}>
              <Input.Wrapper>
                <Input.Input
                  id="sanction-percentage"
                  inputMode="decimal"
                  {...register('percentage')}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="sanction-min"
              label={d.fields.minSanction}
              required
              error={errors.minSanction?.message}
            >
              <Input.Root hasError={Boolean(errors.minSanction)}>
                <Input.Wrapper>
                  <Input.Input id="sanction-min" inputMode="decimal" {...register('minSanction')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>

            <FormField
              id="sanction-min-alt"
              label={d.fields.minSanctionAlt}
              required
              error={errors.minSanctionAlt?.message}
            >
              <Input.Root hasError={Boolean(errors.minSanctionAlt)}>
                <Input.Wrapper>
                  <Input.Input
                    id="sanction-min-alt"
                    inputMode="decimal"
                    {...register('minSanctionAlt')}
                  />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          </div>
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
