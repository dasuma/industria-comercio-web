'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, CompactButton, FancyButton, Input, Pagination, Table, toast } from '@biaenergy/ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiSearchLine
} from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getPradmaDict } from '../../dictionaries';
import {
  useSearchSanctions,
  useGetSanction,
  useCreateSanction,
  useUpdateSanction
} from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';
import { FormField } from '@/components/FormField';
import { cn } from '@/utils/cn';

interface SanctionListProps {
  locale: Locale;
}

const SanctionPanel = ({
  locale,
  sanctionId,
  onClose
}: {
  locale: Locale;
  sanctionId: number | null;
  onClose: () => void;
}) => {
  const dict = getPradmaDict(locale);
  const d = dict.sanctions;
  const isEditing = sanctionId !== null;
  const { data: sanction } = useGetSanction(sanctionId);
  const { mutate: createSanction, isPending: isCreating } = useCreateSanction();
  const { mutate: updateSanction, isPending: isUpdating } = useUpdateSanction();
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
    formState: { errors, isValid }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
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
    if (isEditing && sanction) {
      updateSanction(
        {
          id: sanction.id,
          request: {
            year: Number(values.year),
            percentage: Number(values.percentage),
            min_sanction: Number(values.minSanction),
            min_sanction_alt: Number(values.minSanctionAlt)
          }
        },
        {
          onSuccess: () => {
            toast.success(d.form.success.updated);
            handleClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    } else {
      createSanction(
        {
          year: Number(values.year),
          percentage: Number(values.percentage),
          min_sanction: Number(values.minSanction),
          min_sanction_alt: Number(values.minSanctionAlt)
        },
        {
          onSuccess: () => {
            toast.success(d.form.success.created);
            handleClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    }
  });

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
            {isEditing ? d.edit : d.create}
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

        {isEditing && !sanction ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-text-sub-600">{d.loading}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <FormField
                  id="sanction-year"
                  label={d.fields.year}
                  required
                  error={errors.year?.message}
                >
                  <Input.Root hasError={Boolean(errors.year)}>
                    <Input.Wrapper>
                      <Input.Input
                        id="sanction-year"
                        inputMode="numeric"
                        readOnly={isEditing}
                        className={isEditing ? 'text-text-sub-600' : ''}
                        {...register('year')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </FormField>

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

                <FormField
                  id="sanction-min"
                  label={d.fields.minSanction}
                  required
                  error={errors.minSanction?.message}
                >
                  <Input.Root hasError={Boolean(errors.minSanction)}>
                    <Input.Wrapper>
                      <Input.Input
                        id="sanction-min"
                        inputMode="decimal"
                        {...register('minSanction')}
                      />
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

export const SanctionList = ({ locale }: SanctionListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.sanctions;
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openCreate = () => {
    setSelectedId(null);
    setPanelOpen(true);
  };

  const openEdit = (id: number) => {
    setSelectedId(id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedId(null);
  };

  const {
    searchParams,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    setTotal,
    setFilters,
    pageNumbers
  } = useSearchPagination({ defaultSort: 'year' });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (value.trim() && !isNaN(Number(value.trim()))) {
        const f: SearchFilter[] = [
          { field: 'year', value: Number(value.trim()), operation: 'eq', option: 'OR' }
        ];
        setFilters(f);
      } else {
        setFilters([]);
      }
    },
    [setFilters]
  );

  const { data, isLoading, isError, refetch } = useSearchSanctions(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="max-w-sm flex-1">
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiSearchLine} />
                <Input.Input
                  placeholder={dict.common.search}
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
          <FancyButton.Root variant="primary" onClick={openCreate}>
            <FancyButton.Icon as={RiAddLine} />
            {d.create}
          </FancyButton.Root>
        </div>

        {isLoading && <p className="text-text-sub-600 py-8 text-center">{d.loading}</p>}

        {isError && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-text-sub-600">{d.errorLoading}</p>
            <Button.Root variant="neutral" onClick={() => refetch()}>
              {dict.common.retry}
            </Button.Root>
          </div>
        )}

        {!isLoading && !isError && (!data || data.data.length === 0) && (
          <p className="text-text-sub-600 py-8 text-center">{d.empty}</p>
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{d.columns.id}</Table.Head>
                  <Table.Head>{d.columns.year}</Table.Head>
                  <Table.Head>{d.columns.percentage}</Table.Head>
                  <Table.Head>{d.columns.minSanction}</Table.Head>
                  <Table.Head>{d.columns.minSanctionAlt}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(sanction => (
                  <Table.Row
                    key={sanction.id}
                    onClick={() => openEdit(sanction.id)}
                    className="cursor-pointer"
                  >
                    <Table.Cell>{sanction.id}</Table.Cell>
                    <Table.Cell>{sanction.year}</Table.Cell>
                    <Table.Cell>{sanction.percentage}</Table.Cell>
                    <Table.Cell>{sanction.minSanction}</Table.Cell>
                    <Table.Cell>{sanction.minSanctionAlt}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <div className="flex items-center justify-between">
              <p className="text-text-sub-600 text-sm">
                {dict.common.page} {currentPage} {dict.common.of} {totalPages}
              </p>
              <Pagination.Root>
                <Pagination.NavButton disabled={!hasPrevPage} onClick={prevPage}>
                  <Pagination.NavIcon as={RiArrowLeftSLine} />
                </Pagination.NavButton>
                {pageNumbers.map((page, i) =>
                  page === -1 ? (
                    <span key={`ellipsis-${i}`} className="text-text-sub-600 px-2">
                      &hellip;
                    </span>
                  ) : (
                    <Pagination.Item
                      key={page}
                      current={page === currentPage}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                )}
                <Pagination.NavButton disabled={!hasNextPage} onClick={nextPage}>
                  <Pagination.NavIcon as={RiArrowRightSLine} />
                </Pagination.NavButton>
              </Pagination.Root>
            </div>
          </>
        )}
      </div>

      {panelOpen && <SanctionPanel locale={locale} sanctionId={selectedId} onClose={closePanel} />}
    </>
  );
};
