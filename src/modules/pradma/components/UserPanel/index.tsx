'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, Input, Label, Select, Skeleton, toast } from '@dasuma/pradma-ui';
import { RiDeleteBinLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { EntityDrawer } from '@/components/EntityDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { getPradmaDict } from '../../dictionaries';
import { useCreateUser, useDeleteUser, useGetUser, useUpdateUser } from '../../data';
import { USER_ROLE, type UserRole } from '../../models/shared';

interface UserPanelProps {
  locale: Locale;
  userId: string | null;
  onClose: () => void;
}

const FormSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy>
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <Skeleton.Root className="h-3 w-28" />
        <Skeleton.Root className="h-9 w-full" />
      </div>
    ))}
  </div>
);

export const UserPanel = ({ locale, userId, onClose }: UserPanelProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.users;
  const isEditing = userId !== null;
  const { data: user } = useGetUser(userId);
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const isPending = isCreating || isUpdating;
  const [open, setOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClose = () => {
    setOpen(false);
    window.setTimeout(onClose, 350);
  };

  const schema = z.object({
    id: z.string().trim().min(1, d.form.errors.idRequired),
    email: z.string().trim().min(1, d.form.errors.emailRequired).email(d.form.errors.emailInvalid),
    role: z.string().min(1, d.form.errors.roleRequired)
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    values: user
      ? { id: user.id, email: user.email, role: user.role }
      : { id: '', email: '', role: '' }
  });

  const onSubmit = handleSubmit(values => {
    const request = { id: values.id, email: values.email, role: values.role };
    const callbacks = (message: string) => ({
      onSuccess: () => {
        toast.success(message);
        handleClose();
      },
      onError: () => toast.error(d.form.errors.serverError)
    });

    if (isEditing && user) {
      updateUser({ id: user.id, request }, callbacks(d.form.success.updated));
    } else {
      createUser(request, callbacks(d.form.success.created));
    }
  });

  const handleDelete = () => {
    if (!user) return;
    deleteUser(user.id, {
      onSuccess: () => {
        toast.success(d.success.deleted);
        setConfirmDelete(false);
        handleClose();
      },
      onError: () => toast.error(dict.common.deleteError)
    });
  };

  const roles = Object.values(USER_ROLE);
  const roleLabel = (role: string): string => d.roles[role as UserRole] ?? role;

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
        loading={isEditing && !user}
        loadingSlot={<FormSkeleton />}
        footerStart={
          isEditing ? (
            // [R7] destructivo no protagonista → Button error stroke
            <Button.Root
              variant="error"
              mode="stroke"
              size="small"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending || !user}
            >
              <Button.Icon as={RiDeleteBinLine} />
              {dict.common.delete}
            </Button.Root>
          ) : null
        }
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormField id="user-email" label={d.fields.email} required error={errors.email?.message}>
            <Input.Root hasError={Boolean(errors.email)}>
              <Input.Wrapper>
                <Input.Input id="user-email" type="email" autoFocus {...register('email')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormField id="user-role" label={d.fields.role} required error={errors.role?.message}>
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={Boolean(errors.role)}
                >
                  <Select.Trigger id="user-role" onBlur={field.onBlur}>
                    <Select.Value placeholder={dict.common.selectPlaceholder} />
                  </Select.Trigger>
                  <Select.Content>
                    {roles.map(role => (
                      <Select.Item key={role} value={role}>
                        {roleLabel(role)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </FormField>
            )}
          />

          {isEditing ? (
            <div className="flex flex-col gap-1">
              <Label.Root>{d.fields.id}</Label.Root>
              <p className="bg-bg-weak-50 text-paragraph-sm text-text-sub-600 rounded-lg px-3 py-2 break-all">
                {user?.id}
              </p>
            </div>
          ) : (
            <FormField
              id="user-id"
              label={d.fields.id}
              required
              error={errors.id?.message}
              hint={d.fields.idHint}
            >
              <Input.Root hasError={Boolean(errors.id)}>
                <Input.Wrapper>
                  <Input.Input id="user-id" autoComplete="off" {...register('id')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          )}
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
