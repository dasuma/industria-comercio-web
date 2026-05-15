'use client';

import { useState } from 'react';
import { Button, FancyButton, Input } from '@biaenergy/ui';
import { RiAddLine, RiCloseLine } from '@biaenergy/ui/icons';
import { showToast } from '@/core/feedback/toast';
import { useCreateBulkDeposits } from '../../data/transactions/createBulkDeposits';
import type { BianetworkDictionary } from '../../dictionaries';
import type { ManualDepositItem } from '../../types/transactionRequests';

interface ManualDepositFormProps {
  dict: BianetworkDictionary['generate_deposit_modal'];
  sharedDict: BianetworkDictionary['shared'];
  onSuccess: () => void;
}

interface DraftRow {
  referralCode: string;
  amount: string;
  note: string;
}

const emptyRow = (): DraftRow => ({ referralCode: '', amount: '', note: '' });

export const ManualDepositForm = ({ dict, sharedDict, onSuccess }: ManualDepositFormProps) => {
  const [rows, setRows] = useState<DraftRow[]>([emptyRow()]);
  const mutation = useCreateBulkDeposits();

  const updateRow = (index: number, patch: Partial<DraftRow>) => {
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows(prev => [...prev, emptyRow()]);
  };

  const removeRow = (index: number) => {
    setRows(prev => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const buildPayload = (): ManualDepositItem[] =>
    rows
      .map<ManualDepositItem | null>(row => {
        const code = row.referralCode.trim();
        const amount = Number(row.amount);
        if (!code || !Number.isFinite(amount) || amount <= 0) return null;
        return {
          referral_code: code,
          amount,
          ...(row.note.trim() ? { note: row.note.trim() } : {})
        };
      })
      .filter((item): item is ManualDepositItem => item !== null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (payload.length === 0) {
      showToast('error', dict.validation_required);
      return;
    }
    mutation.mutate(payload, {
      onSuccess: data => {
        const failed = data?.failed ?? 0;
        if (failed > 0) {
          showToast(
            'success',
            dict.success_partial
              .replace('{succeeded}', String(data.succeeded ?? 0))
              .replace('{failed}', String(failed))
          );
        } else {
          showToast('success', dict.success);
        }
        setRows([emptyRow()]);
        onSuccess();
      },
      onError: err => {
        showToast('error', err instanceof Error ? err.message : dict.error);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="text-paragraph-sm text-text-sub-600">{dict.manual_description}</p>

      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="border-stroke-soft-200 grid grid-cols-1 items-end gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-paragraph-xs text-text-sub-600">
                {dict.field_referral_code}
              </span>
              <Input.Root size="medium">
                <Input.Wrapper>
                  <Input.Input
                    value={row.referralCode}
                    onChange={e => updateRow(index, { referralCode: e.target.value })}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-paragraph-xs text-text-sub-600">{dict.field_amount}</span>
              <Input.Root size="medium">
                <Input.Wrapper>
                  <Input.Input
                    inputMode="decimal"
                    value={row.amount}
                    onChange={e => updateRow(index, { amount: e.target.value })}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-paragraph-xs text-text-sub-600">{dict.field_note}</span>
              <Input.Root size="medium">
                <Input.Wrapper>
                  <Input.Input
                    value={row.note}
                    onChange={e => updateRow(index, { note: e.target.value })}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <Button.Root
              type="button"
              variant="basic"
              size="xsmall"
              onClick={() => removeRow(index)}
              disabled={rows.length === 1}
              aria-label={dict.btn_remove_row}
            >
              <Button.Icon as={RiCloseLine} />
            </Button.Root>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <Button.Root type="button" variant="basic" size="xsmall" onClick={addRow}>
          <Button.Icon as={RiAddLine} />
          {dict.btn_add_row}
        </Button.Root>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <FancyButton.Root
          type="button"
          variant="basic"
          size="medium"
          onClick={() => setRows([emptyRow()])}
        >
          {sharedDict.btn_cancel}
        </FancyButton.Root>
        <FancyButton.Root
          type="submit"
          variant="primary"
          size="medium"
          state={mutation.isPending ? 'loading' : 'idle'}
        >
          {dict.btn_submit}
        </FancyButton.Root>
      </div>
    </form>
  );
};
