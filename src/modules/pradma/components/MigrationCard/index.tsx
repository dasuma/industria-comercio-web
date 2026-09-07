'use client';

import { type ChangeEvent, useCallback, useRef, useState } from 'react';
import { Button, FancyButton, Hint, LoaderBrand, Switch, toast } from '@dasuma/pradma-ui';
import {
  RiUploadCloud2Line,
  RiCheckDoubleLine,
  RiErrorWarningFill,
  RiErrorWarningLine
} from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import { interpolate } from '@/utils/format';
import type { MigrationResult } from '../../models/migration.interface';
import type { MigrationResponse } from '../../types/migration.types';
import type { PradmaDictionary } from '../../dictionaries';

type MigrationCardDict = Pick<
  PradmaDictionary['migrations'],
  | 'upload'
  | 'clearData'
  | 'success'
  | 'error'
  | 'migrating'
  | 'recordsMigrated'
  | 'moreErrors'
  | 'invalidFile'
>;

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

const MAX_VISIBLE_ERRORS = 5;
const isDbf = (file: File): boolean => /\.dbf$/i.test(file.name);

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
  const [fileError, setFileError] = useState<string | null>(null);
  const [clear, setClear] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(initialResult ?? null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Un solo punto de entrada para input y drop: valida extensión antes de aceptar.
  const pickFile = useCallback(
    (selected: File | null) => {
      setResult(null);
      if (selected && !isDbf(selected)) {
        setFile(null);
        setFileError(dict.invalidFile);
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      setFileError(null);
      setFile(selected);
    },
    [dict.invalidFile]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => pickFile(e.target.files?.[0] ?? null),
    [pickFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0] ?? null;
      if (dropped) pickFile(dropped);
    },
    [pickFile]
  );

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
            toast.warning(
              interpolate(dict.recordsMigrated, {
                success: adapted.successRecords,
                total: adapted.totalRecords
              })
            );
          }
          onComplete?.(adapted);
        },
        onError: () => {
          toast.error(dict.error);
        }
      }
    );
  }, [file, clear, mutate, dict, onComplete]);

  const buttonState = isPending ? 'loading' : 'idle';

  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 flex flex-col gap-4 rounded-xl p-5 ring-1">
      <div>
        <h3 className="text-text-strong-950 text-label-sm font-semibold">{title}</h3>
        {description && <p className="text-text-sub-600 text-paragraph-xs mt-0.5">{description}</p>}
      </div>

      {/* Drop zone / file selector */}
      <div className="flex flex-col gap-1.5">
        <div
          role="button"
          tabIndex={0}
          aria-disabled={isPending}
          onClick={() => !isPending && inputRef.current?.click()}
          onKeyDown={e => {
            if (isPending) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={e => {
            e.preventDefault();
            if (!isPending) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={isPending ? undefined : handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors',
            isDragOver
              ? 'border-primary-base bg-bg-weak-50'
              : 'border-stroke-soft-200 hover:border-stroke-sub-300 hover:bg-bg-weak-50',
            file && 'border-primary-base bg-bg-weak-50',
            fileError && 'border-error-base',
            isPending && 'cursor-progress opacity-60'
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
        {/* [R9] error del "campo" archivo en pareja con Hint */}
        {fileError && (
          <Hint.Root hasError>
            <Hint.Icon as={RiErrorWarningFill} />
            {fileError}
          </Hint.Root>
        )}
      </div>

      {/* Clear toggle — [R8] dot-access */}
      <label className="flex items-center gap-2">
        <Switch.Root checked={clear} onCheckedChange={setClear} disabled={isPending} />
        <span className="text-paragraph-xs text-text-sub-600 cursor-pointer">{dict.clearData}</span>
      </label>

      {/* Submit — [R7] FancyButton standalone; basic dentro del wizard, donde
          la primary es "Siguiente". [P6] el loader lo pone el estado del botón. */}
      {buttonVariant === 'fancy' ? (
        <FancyButton.Root
          onClick={handleSubmit}
          disabled={!file || isPending}
          state={buttonState}
          className="w-full"
          size="medium"
        >
          <FancyButton.Icon as={RiUploadCloud2Line} />
          {title}
        </FancyButton.Root>
      ) : (
        <Button.Root
          onClick={handleSubmit}
          disabled={!file || isPending}
          state={buttonState}
          className="w-full"
          size="medium"
          variant="basic"
        >
          <Button.Icon as={RiUploadCloud2Line} />
          {title}
        </Button.Root>
      )}

      {/* [P5] una migración puede tardar minutos: siempre reportar espera. */}
      {isPending && (
        <div className="flex items-center justify-center gap-3" role="status" aria-live="polite">
          <LoaderBrand.Pill size="sm" />
          <span className="text-paragraph-xs text-text-sub-600">{dict.migrating}</span>
        </div>
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
              {interpolate(dict.recordsMigrated, {
                success: result.successRecords,
                total: result.totalRecords
              })}
            </span>
          </div>
          {result.errors.length > 0 && (
            <ul className="text-paragraph-xs ml-7 list-disc space-y-0.5">
              {result.errors.slice(0, MAX_VISIBLE_ERRORS).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {result.errors.length > MAX_VISIBLE_ERRORS && (
                <li>
                  {interpolate(dict.moreErrors, {
                    count: result.errors.length - MAX_VISIBLE_ERRORS
                  })}
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
