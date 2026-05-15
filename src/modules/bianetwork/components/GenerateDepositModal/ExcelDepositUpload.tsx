'use client';

import { useRef, useState } from 'react';
import { Button, FancyButton } from '@biaenergy/ui';
import { RiFileUploadLine } from '@biaenergy/ui/icons';
import { showToast } from '@/core/feedback/toast';
import { useCreateDepositsFromExcel } from '../../data/transactions/createDepositsFromExcel';
import type { BianetworkDictionary } from '../../dictionaries';

interface ExcelDepositUploadProps {
  dict: BianetworkDictionary['generate_deposit_modal'];
  sharedDict: BianetworkDictionary['shared'];
  onSuccess: () => void;
}

const EXCEL_EXT = /\.(xlsx|xls)$/i;

export const ExcelDepositUpload = ({ dict, sharedDict, onSuccess }: ExcelDepositUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const mutation = useCreateDepositsFromExcel();

  const pickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    if (next && !EXCEL_EXT.test(next.name)) {
      showToast('error', dict.excel_format_error);
      e.target.value = '';
      return;
    }
    setFile(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutation.mutate(file, {
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
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
        onSuccess();
      },
      onError: err => {
        showToast('error', err instanceof Error ? err.message : dict.error);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="text-paragraph-sm text-text-sub-600">{dict.excel_description}</p>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="border-stroke-soft-200 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6">
        <RiFileUploadLine className="text-text-sub-600 size-8" />
        <Button.Root type="button" variant="basic" size="xsmall" onClick={pickFile}>
          {file ? dict.btn_replace_file : dict.btn_choose_file}
        </Button.Root>
        {file && (
          <span className="text-paragraph-sm text-text-sub-600">
            {dict.file_selected.replace('{name}', file.name)}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <FancyButton.Root
          type="button"
          variant="basic"
          size="medium"
          onClick={() => {
            setFile(null);
            if (inputRef.current) inputRef.current.value = '';
          }}
          disabled={!file}
        >
          {sharedDict.btn_cancel}
        </FancyButton.Root>
        <FancyButton.Root
          type="submit"
          variant="primary"
          size="medium"
          disabled={!file}
          state={mutation.isPending ? 'loading' : 'idle'}
        >
          {dict.btn_submit}
        </FancyButton.Root>
      </div>
    </form>
  );
};
