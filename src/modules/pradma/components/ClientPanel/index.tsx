'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import {
  Button,
  CompactButton,
  FancyButton,
  Hint,
  Input,
  Label,
  Select,
  Switch,
  toast
} from '@biaenergy/ui';
import { RiCloseLine, RiErrorWarningFill } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getPradmaDict } from '../../dictionaries';
import { useCreateClient, useUpdateClient, useGetClient } from '../../data';
import { DOCUMENT_TYPE } from '../../models/shared';
import { cn } from '@/utils/cn';
import { FormField } from '@/components/FormField';

interface ClientPanelProps {
  locale: Locale;
  clientId: number | null;
  onClose: () => void;
}

export const ClientPanel = ({ locale, clientId, onClose }: ClientPanelProps) => {
  const dict = getPradmaDict(locale);
  const isEditing = clientId !== null;
  const { data: client } = useGetClient(clientId);
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const isPending = isCreating || isUpdating;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const r = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(r);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
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
    formState: { errors, isValid },
    setValue,
    control
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
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
    if (isEditing && client) {
      updateClient(
        {
          id: client.id,
          request: {
            name: values.name,
            document_type: values.documentType,
            address: values.address,
            phone: values.phone,
            email: values.email,
            is_company: values.isCompany
          }
        },
        {
          onSuccess: () => {
            toast.success(dict.clients.form.success.updated);
            handleClose();
          },
          onError: () => toast.error(dict.clients.form.errors.serverError)
        }
      );
    } else {
      createClient(
        {
          id: Number(values.id),
          name: values.name,
          document_type: values.documentType,
          address: values.address,
          phone: values.phone,
          email: values.email,
          is_company: values.isCompany
        },
        {
          onSuccess: () => {
            toast.success(dict.clients.form.success.created);
            handleClose();
          },
          onError: () => toast.error(dict.clients.form.errors.serverError)
        }
      );
    }
  });

  const documentTypes = Object.values(DOCUMENT_TYPE);
  const watchDocumentType = useWatch({ control, name: 'documentType' });
  const watchIsCompany = useWatch({ control, name: 'isCompany' });

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={handleClose}
        className={cn(
          'fixed inset-0 z-40 cursor-default bg-black/30 backdrop-blur-[2px]',
          'transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'bg-bg-white-0 ring-stroke-soft-200 fixed top-0 right-0 z-50 flex h-full w-full max-w-lg flex-col ring-1',
          'transition-transform duration-300 ease-out',
          visible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="border-stroke-soft-200 flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-text-strong-950 text-lg font-semibold">
            {isEditing ? dict.clients.edit : dict.clients.create}
          </h2>
          <CompactButton.Root
            variant="ghost"
            size="medium"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </div>

        {isEditing && !client ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-text-sub-600">{dict.clients.loading}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <FormField
                  id="client-name"
                  label={dict.clients.fields.name}
                  required
                  error={errors.name?.message}
                >
                  <Input.Root hasError={Boolean(errors.name)}>
                    <Input.Wrapper>
                      <Input.Input id="client-name" {...register('name')} />
                    </Input.Wrapper>
                  </Input.Root>
                </FormField>

                <div className="flex flex-col gap-1.5">
                  <Label.Root htmlFor="client-document-type">
                    {dict.clients.fields.documentType}
                    <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    key={watchDocumentType}
                    value={watchDocumentType}
                    onValueChange={v => setValue('documentType', v, { shouldValidate: true })}
                    hasError={Boolean(errors.documentType)}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Seleccionar..." />
                    </Select.Trigger>
                    <Select.Content>
                      {documentTypes.map(dt => (
                        <Select.Item key={dt} value={dt}>
                          {dt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {errors.documentType && (
                    <Hint.Root hasError>
                      <Hint.Icon as={RiErrorWarningFill} />
                      {errors.documentType.message}
                    </Hint.Root>
                  )}
                </div>

                <FormField
                  id="client-id"
                  label={dict.clients.fields.id}
                  required={!isEditing}
                  error={errors.id?.message}
                >
                  <Input.Root hasError={Boolean(errors.id)}>
                    <Input.Wrapper>
                      <Input.Input
                        id="client-id"
                        inputMode="numeric"
                        readOnly={isEditing}
                        className={isEditing ? 'text-text-sub-600' : ''}
                        {...register('id')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </FormField>

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

                <div className="flex flex-col gap-1.5">
                  <Label.Root htmlFor="client-is-company">
                    {dict.clients.fields.isCompany}
                  </Label.Root>
                  <Switch.Root
                    id="client-is-company"
                    checked={watchIsCompany}
                    onCheckedChange={v => setValue('isCompany', v, { shouldValidate: true })}
                  />
                </div>
              </form>
            </div>

            <div className="border-stroke-soft-200 flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button.Root variant="basic" onClick={handleClose}>
                {dict.common.cancel}
              </Button.Root>
              <FancyButton.Root
                variant="primary"
                onClick={onSubmit}
                disabled={!isValid || isPending}
              >
                {isPending ? dict.common.saving : dict.common.save}
              </FancyButton.Root>
            </div>
          </>
        )}
      </div>
    </>
  );
};
