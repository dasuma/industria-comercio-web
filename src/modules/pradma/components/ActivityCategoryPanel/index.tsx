'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, Input, Skeleton, toast } from '@dasuma/pradma-ui';
import { RiDeleteBinLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { EntityDrawer } from '@/components/EntityDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { getPradmaDict } from '../../dictionaries';
import {
  useCreateActivityCategory,
  useDeleteActivityCategory,
  useGetActivityCategory,
  useUpdateActivityCategory
} from '../../data';

interface ActivityCategoryPanelProps {
  locale: Locale;
  categoryId: number | null;
  onClose: () => void;
}

const FormSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy>
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <Skeleton.Root className="h-3 w-28" />
        <Skeleton.Root className="h-9 w-full" />
      </div>
    ))}
  </div>
);

export const ActivityCategoryPanel = ({
  locale,
  categoryId,
  onClose
}: ActivityCategoryPanelProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.activityCategories;
  const isEditing = categoryId !== null;
  const { data: category } = useGetActivityCategory(categoryId);
  const { mutate: createCategory, isPending: isCreating } = useCreateActivityCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateActivityCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteActivityCategory();
  const isPending = isCreating || isUpdating;
  const [open, setOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClose = () => {
    setOpen(false);
    window.setTimeout(onClose, 350);
  };

  const yearField = z
    .string()
    .min(1, d.form.errors.yearRequired)
    .regex(/^\d{4}$/, d.form.errors.yearInvalid);

  const schema = z
    .object({
      activityTypeCode: z.string().trim().min(1, d.form.errors.codeRequired),
      activityTypeName: z.string().trim().min(1, d.form.errors.nameRequired),
      yearInitial: yearField,
      yearEnd: yearField
    })
    .refine(v => Number(v.yearEnd) >= Number(v.yearInitial), {
      message: d.form.errors.yearEndBeforeStart,
      path: ['yearEnd']
    });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    values: category
      ? {
          activityTypeCode: category.activityTypeCode,
          activityTypeName: category.activityTypeName,
          yearInitial: String(category.yearInitial),
          yearEnd: String(category.yearEnd)
        }
      : { activityTypeCode: '', activityTypeName: '', yearInitial: '', yearEnd: '' }
  });

  const onSubmit = handleSubmit(values => {
    const request = {
      activity_type_code: values.activityTypeCode,
      activity_type_name: values.activityTypeName,
      year_initial: Number(values.yearInitial),
      year_end: Number(values.yearEnd)
    };
    const callbacks = (message: string) => ({
      onSuccess: () => {
        toast.success(message);
        handleClose();
      },
      onError: () => toast.error(d.form.errors.serverError)
    });

    if (isEditing && category) {
      updateCategory({ id: category.id, request }, callbacks(d.form.success.updated));
    } else {
      createCategory(request, callbacks(d.form.success.created));
    }
  });

  const handleDelete = () => {
    if (!category) return;
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success(d.success.deleted);
        setConfirmDelete(false);
        handleClose();
      },
      onError: () => toast.error(dict.common.deleteError)
    });
  };

  return (
    <>
      <EntityDrawer
        open={open}
        onClose={handleClose}
        title={isEditing ? d.edit : d.create}
        cancelLabel={dict.common.cancel}
        submitLabel={dict.common.save}
        onSubmit={() => void onSubmit()}
        isSubmitting={isPending}
        loading={isEditing && !category}
        loadingSlot={<FormSkeleton />}
        footerStart={
          isEditing ? (
            // [R7] destructivo no protagonista → Button error stroke
            <Button.Root
              variant="error"
              mode="stroke"
              size="small"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending || !category}
            >
              <Button.Icon as={RiDeleteBinLine} />
              {dict.common.delete}
            </Button.Root>
          ) : null
        }
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            id="ac-code"
            label={d.fields.activityTypeCode}
            required
            error={errors.activityTypeCode?.message}
          >
            <Input.Root hasError={Boolean(errors.activityTypeCode)}>
              <Input.Wrapper>
                <Input.Input id="ac-code" autoFocus {...register('activityTypeCode')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="ac-name"
            label={d.fields.activityTypeName}
            required
            error={errors.activityTypeName?.message}
          >
            <Input.Root hasError={Boolean(errors.activityTypeName)}>
              <Input.Wrapper>
                <Input.Input id="ac-name" {...register('activityTypeName')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="ac-year-initial"
              label={d.fields.yearInitial}
              required
              error={errors.yearInitial?.message}
            >
              <Input.Root hasError={Boolean(errors.yearInitial)}>
                <Input.Wrapper>
                  <Input.Input
                    id="ac-year-initial"
                    inputMode="numeric"
                    maxLength={4}
                    {...register('yearInitial')}
                  />
                </Input.Wrapper>
              </Input.Root>
            </FormField>

            <FormField
              id="ac-year-end"
              label={d.fields.yearEnd}
              required
              error={errors.yearEnd?.message}
            >
              <Input.Root hasError={Boolean(errors.yearEnd)}>
                <Input.Wrapper>
                  <Input.Input
                    id="ac-year-end"
                    inputMode="numeric"
                    maxLength={4}
                    {...register('yearEnd')}
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
