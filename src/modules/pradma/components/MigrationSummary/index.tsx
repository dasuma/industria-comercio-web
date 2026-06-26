import { RiCheckDoubleLine, RiErrorWarningLine, RiSubtractLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { MigrationResult } from '../../models/migration.interface';
import type { PradmaDictionary } from '../../dictionaries';

interface StepConfig {
  labelKey: string;
  descriptionKey: string;
}

interface MigrationSummaryProps {
  results: (MigrationResult | null)[];
  steps: readonly StepConfig[];
  dict: PradmaDictionary;
}

export const MigrationSummary = ({ results, steps, dict }: MigrationSummaryProps) => {
  const wizardDict = dict.migrations.wizard;
  const summaryDict = wizardDict.summary;

  const totals = results.reduce(
    (acc, r) => {
      if (!r) return acc;
      return {
        totalRecords: acc.totalRecords + r.totalRecords,
        successRecords: acc.successRecords + r.successRecords,
        failedRecords: acc.failedRecords + r.failedRecords
      };
    },
    { totalRecords: 0, successRecords: 0, failedRecords: 0 }
  );

  const hasErrors = totals.failedRecords > 0;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-text-strong-950 text-label-md font-semibold">{summaryDict.title}</h3>

      <div
        className={cn(
          'rounded-xl p-4',
          hasErrors ? 'bg-warning-lighter/40' : 'bg-success-lighter/40'
        )}
      >
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <RiErrorWarningLine className="text-warning-base size-5 shrink-0" />
          ) : (
            <RiCheckDoubleLine className="text-success-base size-5 shrink-0" />
          )}
          <span
            className={cn(
              'text-label-sm font-medium',
              hasErrors ? 'text-warning-base' : 'text-success-base'
            )}
          >
            {hasErrors ? summaryDict.hasErrors : summaryDict.allSuccess}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-bg-weak-50 text-text-sub-600 text-label-xs">
              <th className="px-4 py-2.5 font-medium">{summaryDict.step}</th>
              <th className="hidden px-4 py-2.5 font-medium sm:table-cell">{summaryDict.file}</th>
              <th className="px-4 py-2.5 text-right font-medium">{summaryDict.success}</th>
              <th className="px-4 py-2.5 text-right font-medium">{summaryDict.failed}</th>
              <th className="px-4 py-2.5 text-right font-medium">{summaryDict.total}</th>
            </tr>
          </thead>
          <tbody className="text-paragraph-sm">
            {steps.map((step, i) => {
              const r = results[i];
              const stepLabel = wizardDict.steps[step.labelKey as keyof typeof wizardDict.steps];
              const fileLabel =
                wizardDict.descriptions[
                  step.descriptionKey as keyof typeof wizardDict.descriptions
                ];
              return (
                <tr key={step.labelKey} className="border-stroke-soft-200 border-t">
                  <td className="text-text-strong-950 px-4 py-2.5 font-medium">{stepLabel}</td>
                  <td className="text-text-sub-600 hidden px-4 py-2.5 sm:table-cell">
                    {fileLabel}
                  </td>
                  {r ? (
                    <>
                      <td className="text-success-base px-4 py-2.5 text-right">
                        {r.successRecords}
                      </td>
                      <td
                        className={cn(
                          'px-4 py-2.5 text-right',
                          r.failedRecords > 0 ? 'text-warning-base' : 'text-text-sub-600'
                        )}
                      >
                        {r.failedRecords}
                      </td>
                      <td className="text-text-strong-950 px-4 py-2.5 text-right font-medium">
                        {r.totalRecords}
                      </td>
                    </>
                  ) : (
                    <td colSpan={3} className="text-text-disabled-300 px-4 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1">
                        <RiSubtractLine className="size-4" />
                        {summaryDict.notRun}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-bg-weak-50 border-stroke-soft-200 border-t">
              <td
                className="text-text-strong-950 text-label-xs px-4 py-2.5 font-semibold"
                colSpan={2}
              >
                {summaryDict.totals}
              </td>
              <td className="text-success-base text-label-xs px-4 py-2.5 text-right font-semibold">
                {totals.successRecords}
              </td>
              <td
                className={cn(
                  'text-label-xs px-4 py-2.5 text-right font-semibold',
                  totals.failedRecords > 0 ? 'text-warning-base' : 'text-text-sub-600'
                )}
              >
                {totals.failedRecords}
              </td>
              <td className="text-text-strong-950 text-label-xs px-4 py-2.5 text-right font-semibold">
                {totals.totalRecords}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
