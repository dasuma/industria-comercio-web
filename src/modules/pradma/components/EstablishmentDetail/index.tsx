'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button, FancyButton, Input, TabMenuHorizontal, toast } from '@biaenergy/ui';
import { RiArrowLeftSLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { APP_ROUTES } from '@/config/routes';
import { getPradmaDict } from '../../dictionaries';
import {
  useGetEstablishment,
  useCreateEstablishment,
  useUpdateEstablishment,
  useGetClient
} from '../../data';
import { FormField } from '@/components/FormField';
import { EstablishmentInvoices } from '../EstablishmentInvoices';
import { EstablishmentSettle } from '../EstablishmentSettle';

interface EstablishmentDetailProps {
  locale: Locale;
  establishmentId: number | null;
}

export const EstablishmentDetail = ({ locale, establishmentId }: EstablishmentDetailProps) => {
  const dict = getPradmaDict(locale);
  const { fields, tabs, form } = dict.establishments;
  const router = useRouter();
  const isEditing = establishmentId !== null;
  const { data: establishment } = useGetEstablishment(establishmentId);
  const { mutate: createEstablishment, isPending: isCreating } = useCreateEstablishment();
  const { mutate: updateEstablishment, isPending: isUpdating } = useUpdateEstablishment();
  const isPending = isCreating || isUpdating;

  const goBack = () => router.push(APP_ROUTES.establishments);

  const schema = z.object({
    name: z.string().min(1, form.errors.nameRequired),
    address: z.string().min(1, form.errors.addressRequired),
    phone: z.string().refine(v => v === '' || /^\d+$/.test(v), form.errors.phoneOnlyNumbers),
    description: z.string(),
    startDate: z.string().min(1, form.errors.startDateRequired),
    endDate: z.string(),
    clientId: z.string().min(1, form.errors.clientIdRequired)
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: establishment
      ? {
          name: establishment.name,
          address: establishment.address,
          phone: establishment.phone,
          description: establishment.description,
          startDate: establishment.startDate.slice(0, 10),
          endDate: establishment.endDate?.slice(0, 10) ?? '',
          clientId: String(establishment.clientId)
        }
      : {
          name: '',
          address: '',
          phone: '',
          description: '',
          startDate: '',
          endDate: '',
          clientId: ''
        }
  });

  const watchClientId = useWatch({ control, name: 'clientId' });
  const clientIdNum = watchClientId && /^\d+$/.test(watchClientId) ? Number(watchClientId) : null;
  const { data: client } = useGetClient(clientIdNum);

  const onSubmit = handleSubmit(values => {
    const payload = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      description: values.description,
      start_date: values.startDate,
      end_date: values.endDate || null,
      client_id: Number(values.clientId),
      registration_number: establishment?.registrationNumber ?? '',
      number_identification: establishment?.numberIdentification ?? '',
      document_type: establishment?.documentType ?? ''
    };

    if (isEditing && establishment) {
      updateEstablishment(
        { id: establishment.id, request: payload },
        {
          onSuccess: () => {
            toast.success(form.success.updated);
            goBack();
          },
          onError: () => toast.error(form.errors.serverError)
        }
      );
    } else {
      createEstablishment(payload, {
        onSuccess: () => {
          toast.success(form.success.created);
          goBack();
        },
        onError: () => toast.error(form.errors.serverError)
      });
    }
  });

  if (isEditing && !establishment) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-text-sub-600">{dict.establishments.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button.Root variant="primary" size="xsmall" onClick={goBack}>
            <Button.Icon as={RiArrowLeftSLine} />
          </Button.Root>
          <h1 className="text-text-strong-950 text-base font-semibold">
            {isEditing ? dict.establishments.edit : dict.establishments.create}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button.Root variant="basic" size="small" type="button" onClick={goBack}>
            {dict.common.cancel}
          </Button.Root>
          <FancyButton.Root
            variant="primary"
            size="small"
            onClick={onSubmit}
            disabled={!isValid || isPending}
          >
            {isPending ? dict.common.saving : dict.common.save}
          </FancyButton.Root>
        </div>
      </div>

      {/* Establishment form — always visible */}
      <div className="bg-bg-white-0 ring-stroke-soft-200 rounded-lg px-4 py-3 ring-1">
        <form
          onSubmit={onSubmit}
          noValidate
          className="grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-3"
        >
          <FormField id="est-name" label={fields.name} required error={errors.name?.message}>
            <Input.Root hasError={Boolean(errors.name)}>
              <Input.Wrapper>
                <Input.Input id="est-name" {...register('name')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="est-client-id"
            label={fields.clientId}
            required
            error={errors.clientId?.message}
            hint={
              clientIdNum && !errors.clientId
                ? client
                  ? client.name
                  : dict.clients.empty
                : undefined
            }
          >
            <Input.Root hasError={Boolean(errors.clientId)}>
              <Input.Wrapper>
                <Input.Input id="est-client-id" inputMode="numeric" {...register('clientId')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="est-address"
            label={fields.address}
            required
            error={errors.address?.message}
          >
            <Input.Root hasError={Boolean(errors.address)}>
              <Input.Wrapper>
                <Input.Input id="est-address" {...register('address')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField id="est-phone" label={fields.phone} error={errors.phone?.message}>
            <Input.Root hasError={Boolean(errors.phone)}>
              <Input.Wrapper>
                <Input.Input
                  id="est-phone"
                  inputMode="numeric"
                  onKeyDown={e => {
                    if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
                  }}
                  {...register('phone')}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField id="est-description" label={fields.description}>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input id="est-description" {...register('description')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField
            id="est-start-date"
            label={fields.startDate}
            required
            error={errors.startDate?.message}
          >
            <Input.Root hasError={Boolean(errors.startDate)}>
              <Input.Wrapper>
                <Input.Input id="est-start-date" type="date" {...register('startDate')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>

          <FormField id="est-end-date" label={fields.endDate}>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input id="est-end-date" type="date" {...register('endDate')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>
        </form>
      </div>

      {/* Tabs below */}
      <TabMenuHorizontal.Root defaultValue="client">
        <TabMenuHorizontal.List>
          <TabMenuHorizontal.Trigger value="client">{tabs.client}</TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value="payments">{tabs.payments}</TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value="settlements">
            {tabs.settlements}
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value="settle">{tabs.settle}</TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>

        <TabMenuHorizontal.Content value="client" className="pt-3">
          {client ? (
            <div className="bg-bg-white-0 ring-stroke-soft-200 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg px-4 py-3 ring-1 lg:grid-cols-3">
              <InfoRow label={fields.clientId} value={String(client.id)} />
              <InfoRow label={dict.clients.fields.name} value={client.name} />
              <InfoRow label={dict.clients.fields.documentType} value={client.documentType} />
              <InfoRow label={dict.clients.fields.address} value={client.address} />
              <InfoRow label={dict.clients.fields.phone} value={client.phone} />
              <InfoRow label={dict.clients.fields.email} value={client.email} />
            </div>
          ) : (
            <p className="text-text-sub-600 py-4 text-center text-sm">
              {clientIdNum ? dict.clients.loading : '—'}
            </p>
          )}
        </TabMenuHorizontal.Content>

        <TabMenuHorizontal.Content value="payments" className="pt-3">
          <p className="text-text-sub-600 py-4 text-center text-sm">
            {dict.establishments.comingSoon}
          </p>
        </TabMenuHorizontal.Content>

        <TabMenuHorizontal.Content value="settlements" className="pt-3">
          {isEditing ? (
            <EstablishmentInvoices establishmentId={establishmentId} dict={dict} />
          ) : (
            <p className="text-text-sub-600 py-4 text-center text-sm">
              {dict.establishments.comingSoon}
            </p>
          )}
        </TabMenuHorizontal.Content>

        <TabMenuHorizontal.Content value="settle" className="pt-3">
          {isEditing && establishment ? (
            <EstablishmentSettle establishment={establishment} dict={dict} />
          ) : (
            <p className="text-text-sub-600 py-4 text-center text-sm">
              {dict.establishments.comingSoon}
            </p>
          )}
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-text-sub-600 text-xs">{label}</span>
    <span className="text-text-strong-950 text-sm">{value || '—'}</span>
  </div>
);
