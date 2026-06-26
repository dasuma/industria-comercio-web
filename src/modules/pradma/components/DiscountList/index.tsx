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
  useSearchDiscounts,
  useGetDiscount,
  useCreateDiscount,
  useUpdateDiscount
} from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';
import { FormField } from '@/components/FormField';
import { cn } from '@/utils/cn';

interface DiscountListProps {
  locale: Locale;
}

const DiscountPanel = ({
  locale,
  discountId,
  onClose
}: {
  locale: Locale;
  discountId: number | null;
  onClose: () => void;
}) => {
  const dict = getPradmaDict(locale);
  const d = dict.discounts;
  const isEditing = discountId !== null;
  const { data: discount } = useGetDiscount(discountId);
  const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();
  const { mutate: updateDiscount, isPending: isUpdating } = useUpdateDiscount();
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
    startDate: z.string().min(1, d.form.errors.startDateRequired),
    endDate: z.string().min(1, d.form.errors.endDateRequired),
    percentage: z
      .string()
      .min(1, d.form.errors.percentageRequired)
      .regex(/^\d+(\.\d+)?$/, d.form.errors.percentageInvalid)
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
            handleClose();
          },
          onError: () => toast.error(d.form.errors.serverError)
        }
      );
    } else {
      createDiscount(payload, {
        onSuccess: () => {
          toast.success(d.form.success.created);
          handleClose();
        },
        onError: () => toast.error(d.form.errors.serverError)
      });
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

        {isEditing && !discount ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-text-sub-600">{d.loading}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                <FormField
                  id="discount-year"
                  label={d.fields.year}
                  required
                  error={errors.year?.message}
                >
                  <Input.Root hasError={Boolean(errors.year)}>
                    <Input.Wrapper>
                      <Input.Input
                        id="discount-year"
                        inputMode="numeric"
                        readOnly={isEditing}
                        className={isEditing ? 'text-text-sub-600' : ''}
                        {...register('year')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </FormField>

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

export const DiscountList = ({ locale }: DiscountListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.discounts;
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
  } = useSearchPagination({ defaultSort: 'year desc' });

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

  const { data, isLoading, isError, refetch } = useSearchDiscounts(searchParams);

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
                  <Table.Head>{d.columns.startDate}</Table.Head>
                  <Table.Head>{d.columns.endDate}</Table.Head>
                  <Table.Head>{d.columns.percentage}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(discount => (
                  <Table.Row
                    key={discount.id}
                    onClick={() => openEdit(discount.id)}
                    className="cursor-pointer"
                  >
                    <Table.Cell>{discount.id}</Table.Cell>
                    <Table.Cell>{discount.year}</Table.Cell>
                    <Table.Cell>{discount.startDate}</Table.Cell>
                    <Table.Cell>{discount.endDate}</Table.Cell>
                    <Table.Cell>{discount.percentage}</Table.Cell>
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

      {panelOpen && <DiscountPanel locale={locale} discountId={selectedId} onClose={closePanel} />}
    </>
  );
};
