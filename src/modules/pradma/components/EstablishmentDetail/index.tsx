'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  Button,
  FancyButton,
  Input,
  Select,
  Skeleton,
  TabMenuHorizontal,
  toast
} from '@dasuma/pradma-ui';
import { RiArrowRightSLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { INTL_LOCALES } from '@/i18n/config';
import { APP_ROUTES } from '@/config/routes';
import { FormField } from '@/components/FormField';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getPradmaDict } from '../../dictionaries';
import {
  useGetEstablishment,
  useCreateEstablishment,
  useUpdateEstablishment,
  useDeleteEstablishment,
  useGetClient
} from '../../data';
import { useSettleYears } from '../../hooks/useSettleYears';
import { DOCUMENT_TYPE } from '../../models/shared';
import { ClientPicker } from '../ClientPicker';
import { EstablishmentHeader } from '../EstablishmentHeader';
import { EstablishmentSettlements } from '../EstablishmentSettlements';

interface EstablishmentDetailProps {
  locale: Locale;
  establishmentId: number | null;
}

type DetailTab = 'settlements' | 'client' | 'data';

interface FormValues {
  name: string;
  address: string;
  phone: string;
  description: string;
  startDate: string;
  endDate: string;
  clientId: number | null;
  registrationNumber: string;
  numberIdentification: string;
  documentType: string;
}

export const EstablishmentDetail = ({ locale, establishmentId }: EstablishmentDetailProps) => {
  const dict = getPradmaDict(locale);
  const { fields, tabs, form } = dict.establishments;
  const router = useRouter();
  const isEditing = establishmentId !== null;
  const { data: establishment, isLoading } = useGetEstablishment(establishmentId);
  const { mutate: createEstablishment, isPending: isCreating } = useCreateEstablishment();
  const { mutate: updateEstablishment, isPending: isUpdating } = useUpdateEstablishment();
  const { mutate: deleteEstablishment, isPending: isDeleting } = useDeleteEstablishment();
  const { lastPaidYear } = useSettleYears(establishmentId);
  const isPending = isCreating || isUpdating;
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Liquidaciones es la home del establecimiento; los datos se editan en su tab.
  const [activeTab, setActiveTab] = useState<DetailTab>('settlements');

  const goBack = () => router.push(APP_ROUTES.establishments);

  const schema: z.ZodType<FormValues> = z.object({
    name: z.string().min(1, form.errors.nameRequired),
    address: z.string().min(1, form.errors.addressRequired),
    phone: z.string().refine(v => v === '' || /^\d+$/.test(v), form.errors.phoneOnlyNumbers),
    description: z.string(),
    startDate: z.string().min(1, form.errors.startDateRequired),
    endDate: z.string(),
    clientId: z
      .number()
      .nullable()
      .refine((v): v is number => v !== null, form.errors.clientIdRequired),
    registrationNumber: z.string(),
    numberIdentification: z.string(),
    documentType: z.string()
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    values: establishment
      ? {
          name: establishment.name,
          address: establishment.address,
          phone: establishment.phone,
          description: establishment.description,
          startDate: establishment.startDate.slice(0, 10),
          endDate: establishment.endDate?.slice(0, 10) ?? '',
          clientId: establishment.clientId,
          registrationNumber: establishment.registrationNumber,
          numberIdentification: establishment.numberIdentification,
          documentType: establishment.documentType
        }
      : {
          name: '',
          address: '',
          phone: '',
          description: '',
          startDate: '',
          endDate: '',
          clientId: null,
          registrationNumber: '',
          numberIdentification: '',
          documentType: ''
        }
  });

  const watchClientId = useWatch({ control, name: 'clientId' });
  const { data: client } = useGetClient(watchClientId);

  const onSubmit = handleSubmit(values => {
    const payload = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      description: values.description,
      start_date: values.startDate,
      end_date: values.endDate || null,
      client_id: values.clientId ?? 0,
      registration_number: values.registrationNumber,
      number_identification: values.numberIdentification,
      document_type: values.documentType
    };

    if (isEditing && establishment) {
      updateEstablishment(
        { id: establishment.id, request: payload },
        {
          onSuccess: () => {
            toast.success(form.success.updated);
            setActiveTab('settlements');
          },
          onError: () => toast.error(form.errors.serverError)
        }
      );
    } else {
      createEstablishment(payload, {
        onSuccess: created => {
          toast.success(form.success.created);
          if (created?.id) router.replace(`${APP_ROUTES.establishments}/${created.id}`);
          else goBack();
        },
        onError: () => toast.error(form.errors.serverError)
      });
    }
  });

  // En edición, cancelar descarta los cambios y vuelve a Liquidaciones; al
  // crear, vuelve al listado.
  const handleCancel = () => {
    if (isEditing) {
      reset();
      setActiveTab('settlements');
      return;
    }
    goBack();
  };

  const handleDelete = () => {
    if (!establishment) return;
    deleteEstablishment(establishment.id, {
      onSuccess: () => {
        toast.success(form.success.deleted);
        goBack();
      },
      onError: () => toast.error(form.errors.deleteError)
    });
  };

  if (isEditing && (isLoading || !establishment)) {
    return (
      <div className="flex flex-col gap-4" role="status" aria-busy>
        <Skeleton.Root className="h-4 w-56" />
        <Skeleton.Root className="h-32 w-full rounded-xl" />
        <Skeleton.Root className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  const documentTypes = Object.values(DOCUMENT_TYPE);
  const title = isEditing
    ? (establishment?.name ?? dict.establishments.edit)
    : dict.establishments.new;

  const formCard = (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-bg-white-0 ring-stroke-soft-200 flex flex-col overflow-hidden rounded-xl ring-1"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <FormField id="est-name" label={fields.name} required error={errors.name?.message}>
          <Input.Root hasError={Boolean(errors.name)}>
            <Input.Wrapper>
              <Input.Input id="est-name" {...register('name')} />
            </Input.Wrapper>
          </Input.Root>
        </FormField>

        <FormField
          id="est-client"
          label={fields.clientId}
          required
          error={errors.clientId?.message}
          hint={client ? `${client.documentType} ${client.id}` : undefined}
        >
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <ClientPicker
                id="est-client"
                value={field.value}
                onChange={field.onChange}
                placeholder={fields.clientPlaceholder}
                searchPlaceholder={fields.clientPlaceholder}
                noResultsLabel={fields.clientNoResults}
                hasError={Boolean(errors.clientId)}
              />
            )}
          />
        </FormField>

        <FormField id="est-address" label={fields.address} required error={errors.address?.message}>
          <Input.Root hasError={Boolean(errors.address)}>
            <Input.Wrapper>
              <Input.Input id="est-address" {...register('address')} />
            </Input.Wrapper>
          </Input.Root>
        </FormField>

        <FormField id="est-phone" label={fields.phone} error={errors.phone?.message}>
          <Input.Root hasError={Boolean(errors.phone)}>
            <Input.Wrapper>
              <Input.Input id="est-phone" inputMode="numeric" {...register('phone')} />
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

        <FormField id="est-registration" label={fields.registrationNumber}>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input id="est-registration" {...register('registrationNumber')} />
            </Input.Wrapper>
          </Input.Root>
        </FormField>

        <FormField id="est-document-type" label={fields.documentType}>
          <Controller
            control={control}
            name="documentType"
            render={({ field }) => (
              <Select.Root value={field.value} onValueChange={field.onChange}>
                <Select.Trigger id="est-document-type">
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
            )}
          />
        </FormField>

        <FormField id="est-number-identification" label={fields.numberIdentification}>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id="est-number-identification"
                inputMode="numeric"
                {...register('numberIdentification')}
              />
            </Input.Wrapper>
          </Input.Root>
        </FormField>

        <div className="lg:col-span-3">
          <FormField id="est-description" label={fields.description}>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input id="est-description" {...register('description')} />
              </Input.Wrapper>
            </Input.Root>
          </FormField>
        </div>
      </div>

      <div className="border-stroke-soft-200 bg-bg-weak-25 flex items-center justify-between gap-3 border-t px-5 py-3">
        <div>
          {isEditing ? (
            // [R7] destructivo no protagonista → error stroke
            <Button.Root
              type="button"
              variant="error"
              mode="stroke"
              size="small"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
            >
              {dict.establishments.delete}
            </Button.Root>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <Button.Root type="button" variant="basic" onClick={handleCancel} disabled={isPending}>
            {dict.common.cancel}
          </Button.Root>
          <FancyButton.Root
            type="submit"
            state={isPending ? 'loading' : 'idle'}
            disabled={isPending}
          >
            {dict.common.save}
          </FancyButton.Root>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* El PageHeader del shell ya muestra "Establecimientos": acá solo el camino */}
      <Breadcrumb.Root aria-label={dict.establishments.title}>
        <Breadcrumb.Item asChild>
          <Link href={APP_ROUTES.establishments}>{dict.establishments.title}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
        <Breadcrumb.Item active>{title}</Breadcrumb.Item>
      </Breadcrumb.Root>

      {isEditing && establishment ? (
        <>
          <EstablishmentHeader
            establishment={establishment}
            client={client}
            lastPaidYear={lastPaidYear}
            intlLocale={INTL_LOCALES[locale]}
            dict={dict}
            onEdit={() => setActiveTab('data')}
          />

          <TabMenuHorizontal.Root
            value={activeTab}
            onValueChange={v => setActiveTab(v as DetailTab)}
          >
            <TabMenuHorizontal.List>
              <TabMenuHorizontal.Trigger value="settlements">
                {tabs.settlements}
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value="client">{tabs.client}</TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value="data">{tabs.data}</TabMenuHorizontal.Trigger>
            </TabMenuHorizontal.List>

            <TabMenuHorizontal.Content value="settlements" className="pt-4">
              <EstablishmentSettlements establishment={establishment} locale={locale} dict={dict} />
            </TabMenuHorizontal.Content>

            <TabMenuHorizontal.Content value="client" className="pt-4">
              {client ? (
                <div className="bg-bg-white-0 ring-stroke-soft-200 grid grid-cols-1 gap-4 rounded-xl p-5 ring-1 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      [dict.clients.fields.id, String(client.id)],
                      [dict.clients.fields.name, client.name],
                      [dict.clients.fields.documentType, client.documentType],
                      [dict.clients.fields.address, client.address],
                      [dict.clients.fields.phone, client.phone],
                      [dict.clients.fields.email, client.email]
                    ] as const
                  ).map(([label, value]) => (
                    <InfoRow
                      key={label}
                      label={label}
                      value={value}
                      fallback={dict.common.notAvailable}
                    />
                  ))}
                </div>
              ) : (
                <Skeleton.Root className="h-28 w-full rounded-xl" />
              )}
            </TabMenuHorizontal.Content>

            <TabMenuHorizontal.Content value="data" className="pt-4">
              {formCard}
            </TabMenuHorizontal.Content>
          </TabMenuHorizontal.Root>
        </>
      ) : (
        formCard
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={dict.establishments.delete}
        description={dict.establishments.deleteConfirm}
        confirmLabel={dict.common.delete}
        cancelLabel={dict.common.cancel}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  fallback
}: {
  label: string;
  value: string;
  fallback: string;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-paragraph-xs text-text-sub-600">{label}</span>
    <span className="text-label-sm text-text-strong-950">{value || fallback}</span>
  </div>
);
