'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TabMenuHorizontal, Button, FancyButton, Input, Checkbox, toast } from '@biaenergy/ui';
import type { Locale } from '@/i18n/config';
import { getRetentionDict } from '../../dictionaries';
import { useUpdateContract, useGetContractRecs } from '../../data';
import type { RetentionContract } from '../../models/retention.interface';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'basics' | 'company' | 'technical' | 'contractRates' | 'recs' | 'vas' | 'users';

interface ContractDetailProps {
  locale: Locale;
  contract: RetentionContract;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  niu: z.string(),
  sui: z.string(),
  sic: z.string(),
  source: z.string(),
  starts_at: z.string(),
  internal_bia_code: z.string(),
  current: z.boolean(),
  is_commercial: z.boolean(),
  is_urban: z.boolean(),
  admin_name: z.string(),
  admin_lastname: z.string(),
  admin_email: z.string(),
  admin_phone: z.string(),
  admin_country_code: z.string(),
  admin_status: z.string(),
  company_name: z.string(),
  company_document_type: z.string(),
  company_document_number: z.string(),
  company_email: z.string(),
  company_phone: z.string(),
  company_address: z.string(),
  meter_is_integrated: z.boolean(),
  meter_has_realtime: z.boolean(),
  tension_level: z.coerce.number(),
  nominal_voltage: z.coerce.number(),
  phase_count: z.coerce.number(),
  timezone: z.string(),
  factor_current: z.coerce.number(),
  factor_energy: z.coerce.number(),
  factor_power: z.coerce.number(),
  factor_voltage: z.coerce.number(),
  solar_capacity: z.coerce.number(),
  has_renewable_energy: z.boolean(),
  consumption_average: z.coerce.number(),
  last_marketer: z.string(),
  with_reactive_charges: z.boolean(),
  service_cut: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const getDefaultValues = (c: RetentionContract): FormValues => ({
  address: c.address,
  city: c.city,
  country: c.country,
  niu: c.niu,
  sui: c.sui,
  sic: c.sic,
  source: c.source,
  starts_at: c.starts_at?.slice(0, 10) ?? '',
  internal_bia_code: c.internal_bia_code,
  current: c.current,
  is_commercial: c.is_commercial,
  is_urban: c.is_urban,
  admin_name: c.admin.name,
  admin_lastname: c.admin.lastname,
  admin_email: c.admin.email,
  admin_phone: c.admin.phone,
  admin_country_code: c.admin.country_code,
  admin_status: c.admin.status,
  company_name: c.company.name,
  company_document_type: c.company.document_type,
  company_document_number: c.company.document_number,
  company_email: c.company.email,
  company_phone: c.company.phone,
  company_address: c.company.address,
  meter_is_integrated: c.meter_is_integrated,
  meter_has_realtime: c.meter_has_realtime,
  tension_level: c.tension_level,
  nominal_voltage: c.nominal_voltage,
  phase_count: c.phase_count,
  timezone: c.timezone,
  factor_current: c.factor_current,
  factor_energy: c.factor_energy,
  factor_power: c.factor_power,
  factor_voltage: c.factor_voltage,
  solar_capacity: c.solar_capacity,
  has_renewable_energy: c.has_renewable_energy,
  consumption_average: c.consumption_average,
  last_marketer: c.last_marketer,
  with_reactive_charges: c.with_reactive_charges,
  service_cut: c.service_cut
});

// ─── Field helpers ────────────────────────────────────────────────────────────

interface ReadFieldProps {
  label: string;
  value: string | number | boolean | null | undefined;
  yesLabel: string;
  noLabel: string;
}

const ReadField = ({ label, value, yesLabel, noLabel }: ReadFieldProps) => {
  if (value === null || value === undefined || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? yesLabel : noLabel) : String(value);
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <span className="text-paragraph-xs text-text-sub-600">{label}</span>
      <span className="text-paragraph-sm text-text-strong-950 break-words">{display}</span>
    </div>
  );
};

interface TextFieldProps {
  label: string;
  name: string;
  register: ReturnType<typeof useForm<FormValues>>['register'];
  type?: 'text' | 'number';
}

const TextField = ({ label, name, register, type = 'text' }: TextFieldProps) => (
  <div className="flex flex-col gap-1 py-2">
    <span className="text-paragraph-xs text-text-sub-600">{label}</span>
    <Input.Root>
      <Input.Wrapper>
        <Input.Input type={type} {...register(name as keyof FormValues)} />
      </Input.Wrapper>
    </Input.Root>
  </div>
);

interface BoolFieldProps {
  label: string;
  name: keyof FormValues;
  control: ReturnType<typeof useForm<FormValues>>['control'];
  yesLabel: string;
  noLabel: string;
}

const BoolField = ({ label, name, control, yesLabel, noLabel }: BoolFieldProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex flex-col gap-1 py-2">
        <span className="text-paragraph-xs text-text-sub-600">{label}</span>
        <div className="flex items-center gap-2 pt-1">
          <Checkbox.Root
            id={name}
            checked={field.value as boolean}
            onCheckedChange={field.onChange}
          />
          <label htmlFor={name} className="text-paragraph-sm text-text-strong-950 cursor-pointer">
            {(field.value as boolean) ? yesLabel : noLabel}
          </label>
        </div>
      </div>
    )}
  />
);

// ─── Layout helpers ───────────────────────────────────────────────────────────

const FieldGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-6 md:grid-cols-3 lg:grid-cols-4">{children}</div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <h4 className="text-label-xs text-text-sub-600 tracking-wide uppercase">{title}</h4>
    {children}
  </div>
);

const ComingSoon = ({ label }: { label: string }) => (
  <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
    {label} · Próximamente
  </div>
);

const ROLE_LABELS: Record<number, string> = { 1: 'Viewer', 2: 'Editor', 3: 'Admin' };

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain || !local) return email;
  return `${local.slice(0, 3)}***@${domain}`;
};

const maskPhone = (phone: string): string => {
  if (phone.length <= 4) return '****';
  return `******${phone.slice(-4)}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const ContractDetail = ({ locale, contract }: ContractDetailProps) => {
  const dict = getRetentionDict(locale);
  const s = dict.contracts.detail;
  const f = s.fields;
  const t = s.tabs;

  const [activeTab, setActiveTab] = useState<TabKey>('basics');
  const [editing, setEditing] = useState(false);

  const { mutate, isPending } = useUpdateContract();
  const { data: recs, isFetching: recsFetching } = useGetContractRecs(contract.id);

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(contract)
  });

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    reset(getDefaultValues(contract));
    setEditing(false);
  };

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        id: contract.id,
        address: values.address,
        city: values.city,
        country: values.country,
        niu: values.niu,
        sui: values.sui,
        sic: values.sic,
        source: values.source,
        starts_at: values.starts_at,
        internal_bia_code: values.internal_bia_code,
        current: values.current,
        is_commercial: values.is_commercial,
        is_urban: values.is_urban,
        admin: {
          ...contract.admin,
          name: values.admin_name,
          lastname: values.admin_lastname,
          email: values.admin_email,
          phone: values.admin_phone,
          country_code: values.admin_country_code,
          status: values.admin_status
        },
        company: {
          ...contract.company,
          name: values.company_name,
          document_type: values.company_document_type,
          document_number: values.company_document_number,
          email: values.company_email,
          phone: values.company_phone,
          address: values.company_address
        },
        meter_is_integrated: values.meter_is_integrated,
        meter_has_realtime: values.meter_has_realtime,
        tension_level: values.tension_level,
        nominal_voltage: values.nominal_voltage,
        phase_count: values.phase_count,
        timezone: values.timezone,
        factor_current: values.factor_current,
        factor_energy: values.factor_energy,
        factor_power: values.factor_power,
        factor_voltage: values.factor_voltage,
        solar_capacity: values.solar_capacity,
        has_renewable_energy: values.has_renewable_energy,
        consumption_average: values.consumption_average,
        last_marketer: values.last_marketer,
        with_reactive_charges: values.with_reactive_charges,
        service_cut: values.service_cut
      },
      {
        onSuccess: () => {
          toast.success(s.saveSuccess);
          setEditing(false);
        },
        onError: () => {
          toast.error(s.saveError);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-bg-white-0 border-stroke-soft-200 rounded-xl border">
        {/* Header: tabs + actions */}
        <div className="flex items-center justify-between pr-4">
          <TabMenuHorizontal.Root
            value={activeTab}
            onValueChange={v => setActiveTab(v as TabKey)}
            className="flex-1"
          >
            <TabMenuHorizontal.List className="!border-t-0 px-4">
              {(
                [
                  { key: 'basics', label: t.basics },
                  { key: 'company', label: t.company },
                  { key: 'technical', label: t.technical },
                  { key: 'contractRates', label: t.contractRates },
                  { key: 'recs', label: t.recs },
                  { key: 'vas', label: t.vas },
                  { key: 'users', label: t.users }
                ] as const
              ).map(tab => (
                <TabMenuHorizontal.Trigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabMenuHorizontal.Trigger>
              ))}
            </TabMenuHorizontal.List>
          </TabMenuHorizontal.Root>

          <div className="flex shrink-0 items-center gap-2">
            {editing ? (
              <>
                <Button.Root variant="basic" type="button" onClick={handleCancel}>
                  {s.cancel}
                </Button.Root>
                <FancyButton.Root type="submit" disabled={isPending}>
                  {isPending ? s.saving : s.save}
                </FancyButton.Root>
              </>
            ) : (
              <Button.Root variant="basic" type="button" onClick={handleEdit}>
                {s.edit}
              </Button.Root>
            )}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4">
          {activeTab === 'basics' && (
            <div className="flex flex-col gap-6">
              <SubSection title={s.sections.contract}>
                <FieldGrid>
                  <ReadField label={f.id} value={contract.id} yesLabel={s.yes} noLabel={s.no} />

                  {editing ? (
                    <>
                      <TextField
                        label={f.internalCode}
                        name="internal_bia_code"
                        register={register}
                      />
                      <TextField label={f.niu} name="niu" register={register} />
                      <TextField label={f.sui} name="sui" register={register} />
                      <TextField label={f.sic} name="sic" register={register} />
                      <TextField label={f.address} name="address" register={register} />
                      <TextField label={f.city} name="city" register={register} />
                      <TextField label={f.country} name="country" register={register} />
                      <TextField label={f.source} name="source" register={register} />
                      <TextField
                        label={f.startsAt}
                        name="starts_at"
                        register={register}
                        type="text"
                      />
                      <BoolField
                        label={f.isCurrent}
                        name="current"
                        control={control}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <BoolField
                        label={f.isCommercial}
                        name="is_commercial"
                        control={control}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <BoolField
                        label={f.isUrban}
                        name="is_urban"
                        control={control}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                    </>
                  ) : (
                    <>
                      <ReadField
                        label={f.internalCode}
                        value={contract.internal_bia_code}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.niu}
                        value={contract.niu}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.sui}
                        value={contract.sui}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.sic}
                        value={contract.sic}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.address}
                        value={contract.address}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.city}
                        value={contract.city}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.country}
                        value={contract.country}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.source}
                        value={contract.source}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.startsAt}
                        value={contract.starts_at?.slice(0, 10)}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.isCurrent}
                        value={contract.current}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.isCommercial}
                        value={contract.is_commercial}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.isUrban}
                        value={contract.is_urban}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                    </>
                  )}
                </FieldGrid>
              </SubSection>

              <div className="border-stroke-soft-200 border-t" />

              <SubSection title={s.sections.admin}>
                <FieldGrid>
                  {editing ? (
                    <>
                      <TextField label={f.name} name="admin_name" register={register} />
                      <TextField label="Apellido" name="admin_lastname" register={register} />
                      <TextField label={f.email} name="admin_email" register={register} />
                      <TextField label={f.phone} name="admin_phone" register={register} />
                      <TextField label="Cód. país" name="admin_country_code" register={register} />
                      <TextField label={f.status} name="admin_status" register={register} />
                    </>
                  ) : (
                    <>
                      <ReadField
                        label={f.name}
                        value={`${contract.admin.name} ${contract.admin.lastname}`.trim()}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.email}
                        value={contract.admin.email ? maskEmail(contract.admin.email) : ''}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.phone}
                        value={
                          contract.admin.phone
                            ? `${contract.admin.country_code} ${maskPhone(contract.admin.phone)}`
                            : ''
                        }
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                      <ReadField
                        label={f.status}
                        value={contract.admin.status}
                        yesLabel={s.yes}
                        noLabel={s.no}
                      />
                    </>
                  )}
                </FieldGrid>
              </SubSection>
            </div>
          )}

          {activeTab === 'company' && (
            <FieldGrid>
              {editing ? (
                <>
                  <TextField label={f.name} name="company_name" register={register} />
                  <TextField
                    label={f.documentType}
                    name="company_document_type"
                    register={register}
                  />
                  <TextField
                    label={f.documentNumber}
                    name="company_document_number"
                    register={register}
                  />
                  <TextField label={f.email} name="company_email" register={register} />
                  <TextField label={f.phone} name="company_phone" register={register} />
                  <TextField label={f.address} name="company_address" register={register} />
                </>
              ) : (
                <>
                  <ReadField
                    label={f.name}
                    value={contract.company.name}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.documentType}
                    value={contract.company.document_type}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.documentNumber}
                    value={contract.company.document_number}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.email}
                    value={contract.company.email ? maskEmail(contract.company.email) : ''}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.phone}
                    value={contract.company.phone ? maskPhone(contract.company.phone) : ''}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.address}
                    value={contract.company.address}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                </>
              )}
            </FieldGrid>
          )}

          {activeTab === 'technical' && (
            <FieldGrid>
              <ReadField
                label={f.meterId}
                value={contract.meter_id}
                yesLabel={s.yes}
                noLabel={s.no}
              />
              {editing ? (
                <>
                  <BoolField
                    label={f.meterIntegrated}
                    name="meter_is_integrated"
                    control={control}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <BoolField
                    label={f.meterRealtime}
                    name="meter_has_realtime"
                    control={control}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <TextField
                    label={f.tensionLevel}
                    name="tension_level"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.nominalVoltage}
                    name="nominal_voltage"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.phaseCount}
                    name="phase_count"
                    register={register}
                    type="number"
                  />
                  <TextField label={f.timezone} name="timezone" register={register} />
                  <TextField
                    label={f.factorCurrent}
                    name="factor_current"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.factorEnergy}
                    name="factor_energy"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.factorPower}
                    name="factor_power"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.factorVoltage}
                    name="factor_voltage"
                    register={register}
                    type="number"
                  />
                  <TextField
                    label={f.solarCapacity}
                    name="solar_capacity"
                    register={register}
                    type="number"
                  />
                  <BoolField
                    label={f.hasRenewable}
                    name="has_renewable_energy"
                    control={control}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <TextField
                    label={f.consumptionAverage}
                    name="consumption_average"
                    register={register}
                    type="number"
                  />
                  <TextField label={f.lastMarketer} name="last_marketer" register={register} />
                  <BoolField
                    label={f.withReactiveCharges}
                    name="with_reactive_charges"
                    control={control}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <BoolField
                    label={f.serviceCut}
                    name="service_cut"
                    control={control}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                </>
              ) : (
                <>
                  <ReadField
                    label={f.meterIntegrated}
                    value={contract.meter_is_integrated}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.meterRealtime}
                    value={contract.meter_has_realtime}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.tensionLevel}
                    value={contract.tension_level}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.nominalVoltage}
                    value={`${contract.nominal_voltage} V`}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.phaseCount}
                    value={contract.phase_count}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.timezone}
                    value={contract.timezone}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.factorCurrent}
                    value={contract.factor_current}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.factorEnergy}
                    value={contract.factor_energy}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.factorPower}
                    value={contract.factor_power}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.factorVoltage}
                    value={contract.factor_voltage}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.solarCapacity}
                    value={contract.solar_capacity ? `${contract.solar_capacity} kW` : null}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.hasRenewable}
                    value={contract.has_renewable_energy}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.consumptionAverage}
                    value={
                      contract.consumption_average ? `${contract.consumption_average} kWh` : null
                    }
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.lastMarketer}
                    value={contract.last_marketer}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.withReactiveCharges}
                    value={contract.with_reactive_charges}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                  <ReadField
                    label={f.serviceCut}
                    value={contract.service_cut}
                    yesLabel={s.yes}
                    noLabel={s.no}
                  />
                </>
              )}
            </FieldGrid>
          )}

          {activeTab === 'contractRates' && <ComingSoon label={t.contractRates} />}
          {activeTab === 'recs' &&
            (recsFetching ? (
              <div className="text-paragraph-sm text-text-sub-600 py-6 text-center">…</div>
            ) : !recs || recs.length === 0 ? (
              <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
                {s.recs.empty}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-stroke-soft-200 border-b">
                      {[
                        s.recs.id,
                        s.recs.recValue,
                        s.recs.startDate,
                        s.recs.endDate,
                        s.recs.userId,
                        s.recs.createdAt
                      ].map(h => (
                        <th
                          key={h}
                          className="text-label-xs text-text-sub-600 pr-6 pb-2 text-left font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...recs]
                      .sort((a, b) => b.start_date.localeCompare(a.start_date))
                      .map(rec => (
                        <tr key={rec.id} className="border-stroke-soft-200 border-b last:border-0">
                          <td className="text-paragraph-xs text-text-strong-950 py-2 pr-6">
                            {rec.id}
                          </td>
                          <td className="text-paragraph-xs text-text-strong-950 py-2 pr-6">
                            {rec.rec_value}
                          </td>
                          <td className="text-paragraph-xs text-text-sub-600 py-2 pr-6">
                            {rec.start_date.slice(0, 10)}
                          </td>
                          <td className="text-paragraph-xs text-text-sub-600 py-2 pr-6">
                            {rec.end_date.slice(0, 10)}
                          </td>
                          <td className="text-paragraph-xs text-text-sub-600 py-2 pr-6">
                            {rec.user_id}
                          </td>
                          <td className="text-paragraph-xs text-text-sub-600 py-2 pr-6">
                            {rec.created_at.slice(0, 10)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          {activeTab === 'vas' && <ComingSoon label={t.vas} />}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-stroke-soft-200 border-b">
                    <th className="text-label-xs text-text-sub-600 pb-2 text-left font-medium">
                      {f.email}
                    </th>
                    <th className="text-label-xs text-text-sub-600 pb-2 text-left font-medium">
                      {f.role}
                    </th>
                    <th className="text-label-xs text-text-sub-600 pb-2 text-left font-medium">
                      {f.billingEmail}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contract.users.map(user => (
                    <tr key={user.id} className="border-stroke-soft-200 border-b last:border-0">
                      <td className="text-paragraph-xs text-text-strong-950 py-2">
                        {maskEmail(user.email)}
                      </td>
                      <td className="text-paragraph-xs text-text-sub-600 py-2">
                        {ROLE_LABELS[user.role_id] ?? user.role_id}
                      </td>
                      <td className="text-paragraph-xs text-text-sub-600 py-2">
                        {user.billing_email ? s.yes : s.no}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
