'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, Input, Label, Select, Skeleton, Switch, toast } from '@dasuma/pradma-ui';
import { RiDeleteBinLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { EntityDrawer } from '@/components/EntityDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FormField } from '@/components/FormField';
import { getPradmaDict } from '../../dictionaries';
import { useCreateClient, useDeleteClient, useGetClient, useUpdateClient } from '../../data';
import { DOCUMENT_TYPE } from '../../models/shared';

interface ClientPanelProps {
  locale: Locale;
  clientId: number | null;
  onClose: () => void;
}

const FormSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy>
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <Skeleton.Root className="h-3 w-28" />
        <Skeleton.Root className="h-9 w-full" />
      </div>
    ))}
  </div>
);

export const ClientPanel = ({ locale, clientId, onClose }: ClientPanelProps) => {
  const dict = getPradmaDict(locale);
  const isEditing = clientId !== null;
  const { data: client } = useGetClient(clientId);
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();
  const isPending = isCreating || isUpdating;
  const [open, setOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // El Drawer del DS anima la salida: primero cerramos, después desmontamos.
  const handleClose = () => {
    setOpen(false);
    window.setTimeout(onClose, 350);
  };

  const schema = z.object({
    id: z
      .string()
      .min(1, dict.clients.form.errors.idRequired)
      .regex(/^\d+$/, dict.clients.form.errors.idOnlyNumbers),
    name: z.string().min(1, dict.clients.form.errors.nameRequired),
    documentType: z.string().min(1, dict.clients.form.errors.documentTypeRequired),
    address: z.string().min(1, dict.clients.form.errors.addressRequired),
    phone: z
      .string()
      .refine(v => v === '' || /^\d+$/.test(v), dict.clients.form.errors.phoneOnlyNumbers),
    email: z
      .string()
      .refine(
        v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        dict.clients.form.errors.emailInvalid
      ),
    isCompany: z.boolean()
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
    values: client
      ? {
          id: String(client.id),
          name: client.name,
          documentType: client.documentType,
          address: client.address,
          phone: client.phone,
          email: client.email,
          isCompany: client.isCompany
        }
      : {
          id: '',
          name: '',
          documentType: '',
          address: '',
          phone: '',
          email: '',
          isCompany: false
        }
  });

  const onSubmit = handleSubmit(values => {
    const request = {
      name: values.name,
      document_type: values.documentType,
      address: values.address,
      phone: values.phone,
      email: values.email,
      is_company: values.isCompany
    };
    const callbacks = (message: string) => ({
      onSuccess: () => {
        toast.success(message);
        handleClose();
      },
      onError: () => toast.error(dict.clients.form.errors.serverError)
    });

    if (isEditing && client) {
      updateClient({ id: client.id, request }, callbacks(dict.clients.form.success.updated));
    } else {
      createClient(
        { id: Number(values.id), ...request },
        callbacks(dict.clients.form.success.created)
      );
    }
  });

  const handleDelete = () => {
    if (!client) return;
    deleteClient(client.id, {
      onSuccess: () => {
        toast.success(dict.clients.success.deleted);
        setConfirmDelete(false);
        handleClose();
      },
      onError: () => toast.error(dict.common.deleteError)
    });
  };

  const documentTypes = Object.values(DOCUMENT_TYPE);

  return (
    <>
      <EntityDrawer
        open={open}
        onClose={handleClose}
        title={isEditing ? dict.clients.edit : dict.clients.create}
        cancelLabel={dict.common.cancel}
        submitLabel={dict.common.save}
        onSubmit={() => void onSubmit()}
        isSubmitting={isPending}
        loading={isEditing && !client}
        loadingSlot={<FormSkeleton />}
        footerStart={
          isEditing ? (
            // [R7] destructivo no protagonista → Button error stroke
            <Button.Root
              variant="error"
              mode="stroke"
              size="small"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending || !client}
            >
              <Button.Icon as={RiDeleteBinLine} />
              {dict.common.delete}
            </Button.Root>
          ) : null
        }
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            id="client-name"
            label={dict.clients.fields.name}
            required
            error={errors.name?.message}
          >
            <Input.Root hasError={Boolean(errors.name)}>
              <Input.Wrapper>
                <Input.Input id="client-name" autoFocus {...register('name')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <Controller
            control={control}
            name="documentType"
            render={({ field }) => (
              <FormField
                id="client-document-type"
                label={dict.clients.fields.documentType}
                required
                error={errors.documentType?.message}
              >
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={Boolean(errors.documentType)}
                >
                  <Select.Trigger id="client-document-type" onBlur={field.onBlur}>
                    <Select.Value placeholder={dict.common.selectPlaceholder} />
                  </Select.Trigger>
                  <Select.Content>
                    {documentTypes.map(dt => (
                      <Select.Item key={dt} value={dt}>
                        {dt}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </FormField>
            )}
          />

          {isEditing ? (
            <div className="flex flex-col gap-1">
              <Label.Root>{dict.clients.fields.id}</Label.Root>
              <p className="bg-bg-weak-50 text-paragraph-sm text-text-sub-600 rounded-lg px-3 py-2 tabular-nums">
                {client?.id}
              </p>
            </div>
          ) : (
            <FormField
              id="client-id"
              label={dict.clients.fields.id}
              required
              error={errors.id?.message}
            >
              <Input.Root hasError={Boolean(errors.id)}>
                <Input.Wrapper>
                  <Input.Input id="client-id" inputMode="numeric" {...register('id')} />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          )}

          <FormField
            id="client-address"
            label={dict.clients.fields.address}
            required
            error={errors.address?.message}
          >
            <Input.Root hasError={Boolean(errors.address)}>
              <Input.Wrapper>
                <Input.Input id="client-address" {...register('address')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="client-phone"
            label={dict.clients.fields.phone}
            error={errors.phone?.message}
          >
            <Input.Root hasError={Boolean(errors.phone)}>
              <Input.Wrapper>
                <Input.Input
                  id="client-phone"
                  inputMode="numeric"
                  onKeyDown={e => {
                    if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
                  }}
                  {...register('phone')}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="client-email"
            label={dict.clients.fields.email}
            error={errors.email?.message}
          >
            <Input.Root hasError={Boolean(errors.email)}>
              <Input.Wrapper>
                <Input.Input
                  id="client-email"
                  type="email"
                  onKeyDown={e => {
                    if (e.key === ' ') e.preventDefault();
                  }}
                  {...register('email')}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <Controller
            control={control}
            name="isCompany"
            render={({ field }) => (
              <div className="ring-stroke-soft-200 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ring-1">
                <Label.Root htmlFor="client-is-company">{dict.clients.fields.isCompany}</Label.Root>
                <Switch.Root
                  id="client-is-company"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </form>
      </EntityDrawer>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={dict.clients.delete}
        description={dict.clients.deleteConfirm}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
};
