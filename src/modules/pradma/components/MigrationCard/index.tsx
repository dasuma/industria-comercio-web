'use client';

import { type ChangeEvent, useCallback, useRef, useState } from 'react';
import { Button, FancyButton, Switch, toast } from '@biaenergy/ui';
import { RiUploadCloud2Line, RiCheckDoubleLine, RiErrorWarningLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { MigrationResult } from '../../models/migration.interface';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrationCardDict {
  upload: string;
  clearData: string;
  success: string;
  error: string;
}

interface MigrationCardProps {
  title: string;
  dict: MigrationCardDict;
  useMigration: () => {
    mutate: (
      vars: { file: File; clear: boolean },
      opts: {
        onSuccess?: (data: MigrationResponse) => void;
        onError?: (error: unknown) => void;
      }
    ) => void;
    isPending: boolean;
  };
  onComplete?: (result: MigrationResult) => void;
  buttonVariant?: 'fancy' | 'basic';
  description?: string;
  initialResult?: MigrationResult | null;
}

const adaptResult = (raw: MigrationResponse | MigrationResponse[]): MigrationResult => {
  const item = Array.isArray(raw) ? raw[0] : raw;
  return {
    totalRecords: item.total_records,
    successRecords: item.inserted,
    failedRecords: item.skipped,
    errors: item.errors ?? []
  };
};

export const MigrationCard = ({
  title,
  dict,
  useMigration: useHook,
  onComplete,
  buttonVariant = 'fancy',
  description,
  initialResult
}: MigrationCardProps) => {
  const { mutate, isPending } = useHook();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [clear, setClear] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(initialResult ?? null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0] ?? null;
    if (dropped) {
      setFile(dropped);
      setResult(null);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!file) return;
    mutate(
      { file, clear },
      {
        onSuccess: (data: MigrationResponse) => {
          const adapted = adaptResult(data);
          setResult(adapted);
          setFile(null);
          if (inputRef.current) inputRef.current.value = '';
          if (adapted.failedRecords === 0) {
            toast.success(dict.success);
          } else {
            toast.warning(`${adapted.successRecords}/${adapted.totalRecords} registros migrados`);
          }
          onComplete?.(adapted);
        },
        onError: () => {
          toast.error(dict.error);
        }
      }
    );
  }, [file, clear, mutate, dict, onComplete]);

  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 flex flex-col gap-4 rounded-xl p-5 ring-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-text-strong-950 text-label-sm font-semibold">{title}</h3>
          {description && (
            <p className="text-text-sub-600 text-paragraph-xs mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {/* Drop zone / file selector */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={e => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragOver
            ? 'border-primary-base bg-bg-weak-50'
            : 'border-stroke-soft-200 hover:border-stroke-sub-300 hover:bg-bg-weak-50',
          file && 'border-primary-base bg-bg-weak-50'
        )}
      >
        <RiUploadCloud2Line className="text-text-soft-400 size-8" />
        {file ? (
          <span className="text-text-strong-950 text-label-xs font-medium">{file.name}</span>
        ) : (
          <span className="text-text-sub-600 text-paragraph-xs">{dict.upload}</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".dbf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Clear toggle */}
      {/* [R8] dot-access for Switch */}
      <label className="flex items-center gap-2">
        <Switch.Root checked={clear} onCheckedChange={setClear} />
        <span className="text-paragraph-xs text-text-sub-600 cursor-pointer">{dict.clearData}</span>
      </label>

      {/* Submit — [R7] FancyButton for standalone, basic inside wizard */}
      {buttonVariant === 'fancy' ? (
        <FancyButton.Root
          onClick={handleSubmit}
          disabled={!file || isPending}
          className="w-full"
          size="medium"
        >
          <FancyButton.Icon as={RiUploadCloud2Line} />
          {isPending ? 'Migrando...' : title}
        </FancyButton.Root>
      ) : (
        <Button.Root
          onClick={handleSubmit}
          disabled={!file || isPending}
          className="w-full"
          size="medium"
          variant="primary"
        >
          <Button.Icon as={RiUploadCloud2Line} />
          {isPending ? 'Migrando...' : title}
        </Button.Root>
      )}

      {/* Results */}
      {result && (
        <div
          className={cn(
            'flex flex-col gap-2 rounded-lg p-3',
            result.failedRecords === 0
              ? 'bg-success-lighter/40 text-success-base'
              : 'bg-warning-lighter/40 text-warning-base'
          )}
        >
          <div className="flex items-center gap-2">
            {result.failedRecords === 0 ? (
              <RiCheckDoubleLine className="size-5 shrink-0" />
            ) : (
              <RiErrorWarningLine className="size-5 shrink-0" />
            )}
            <span className="text-label-xs font-medium">
              {result.successRecords}/{result.totalRecords} registros migrados
            </span>
          </div>
          {result.errors.length > 0 && (
            <ul className="text-paragraph-xs ml-7 list-disc space-y-0.5">
              {result.errors.slice(0, 5).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {result.errors.length > 5 && <li>... y {result.errors.length - 5} errores más</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
