'use client';

import { useCallback, useState } from 'react';
import { Button, FancyButton, HorizontalStepper } from '@biaenergy/ui';
import { RiArrowLeftSLine, RiArrowRightSLine, RiRestartLine } from '@biaenergy/ui/icons';
import type { MigrationResult } from '../../models/migration.interface';
import type { PradmaDictionary } from '../../dictionaries';
import {
  useMigrateClients,
  useMigrateActivityCategories,
  useMigrateTariffs,
  useMigrateInterestRates,
  useMigrateYearConfigs,
  useMigrateDiscounts,
  useMigrateEstablishments,
  useMigrateEstablishmentTariffs,
  useMigrateInvoices
} from '../../data';
import { MigrationCard } from '../MigrationCard';
import { MigrationSummary } from '../MigrationSummary';

const STEPS = [
  { key: 'clients', labelKey: 'clients', descriptionKey: 'clients', hook: useMigrateClients },
  {
    key: 'activityCategories',
    labelKey: 'activityCategories',
    descriptionKey: 'activityCategories',
    hook: useMigrateActivityCategories
  },
  { key: 'tariffs', labelKey: 'tariffs', descriptionKey: 'tariffs', hook: useMigrateTariffs },
  {
    key: 'interestRates',
    labelKey: 'interestRates',
    descriptionKey: 'interestRates',
    hook: useMigrateInterestRates
  },
  {
    key: 'yearConfigs',
    labelKey: 'yearConfigs',
    descriptionKey: 'yearConfigs',
    hook: useMigrateYearConfigs
  },
  {
    key: 'discounts',
    labelKey: 'discounts',
    descriptionKey: 'discounts',
    hook: useMigrateDiscounts
  },
  {
    key: 'establishments',
    labelKey: 'establishments',
    descriptionKey: 'establishments',
    hook: useMigrateEstablishments
  },
  {
    key: 'establishmentTariffs',
    labelKey: 'establishmentTariffs',
    descriptionKey: 'establishmentTariffs',
    hook: useMigrateEstablishmentTariffs
  },
  {
    key: 'invoices',
    labelKey: 'invoices',
    descriptionKey: 'invoices',
    hook: useMigrateInvoices
  }
] as const;

const TOTAL_STEPS = STEPS.length + 1; // +1 for summary

interface MigrationsWizardProps {
  dict: PradmaDictionary;
}

export const MigrationsWizard = ({ dict }: MigrationsWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<(MigrationResult | null)[]>(() =>
    Array.from({ length: STEPS.length }, () => null)
  );

  const wizardDict = dict.migrations.wizard;
  const isSummary = currentStep === STEPS.length;

  const handleComplete = useCallback((index: number, result: MigrationResult) => {
    setResults(prev => {
      const next = [...prev];
      next[index] = result;
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setResults(Array.from({ length: STEPS.length }, () => null));
  }, []);

  const getStepState = (index: number): 'completed' | 'active' | 'default' => {
    if (index < STEPS.length && results[index] !== null) return 'completed';
    if (index === currentStep) return 'active';
    return 'default';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      <HorizontalStepper.Root>
        {STEPS.map((step, i) => (
          <StepperItem
            key={step.key}
            index={i}
            label={wizardDict.steps[step.labelKey as keyof typeof wizardDict.steps]}
            state={getStepState(i)}
            isLast={false}
            onClick={() => setCurrentStep(i)}
          />
        ))}
        <StepperItem
          index={STEPS.length}
          label={wizardDict.steps.summary}
          state={getStepState(STEPS.length)}
          isLast
          onClick={() => setCurrentStep(STEPS.length)}
        />
      </HorizontalStepper.Root>

      {/* Step indicator */}
      <p className="text-text-sub-600 text-paragraph-sm">
        {wizardDict.stepOf
          .replace('{current}', String(currentStep + 1))
          .replace('{total}', String(TOTAL_STEPS))}
      </p>

      {/* Content */}
      <div className="mx-auto w-full max-w-lg">
        {isSummary ? (
          <MigrationSummary results={results} steps={STEPS} dict={dict} />
        ) : (
          <MigrationCard
            key={STEPS[currentStep].key}
            title={
              dict.migrations[STEPS[currentStep].key as keyof typeof dict.migrations] as string
            }
            dict={dict.migrations}
            useMigration={STEPS[currentStep].hook}
            onComplete={r => handleComplete(currentStep, r)}
            buttonVariant="basic"
            description={
              wizardDict.descriptions[
                STEPS[currentStep].descriptionKey as keyof typeof wizardDict.descriptions
              ]
            }
            initialResult={results[currentStep]}
          />
        )}
      </div>

      {/* Navigation footer */}
      <div className="border-stroke-soft-200 flex items-center justify-between border-t pt-4">
        <Button.Root
          variant="neutral"
          mode="ghost"
          onClick={() => setCurrentStep(s => s - 1)}
          disabled={currentStep === 0}
        >
          <Button.Icon as={RiArrowLeftSLine} />
          {wizardDict.back}
        </Button.Root>

        {isSummary ? (
          <Button.Root variant="neutral" onClick={handleRestart}>
            <Button.Icon as={RiRestartLine} />
            {wizardDict.restart}
          </Button.Root>
        ) : (
          // [R7] FancyButton for primary "Next" action
          <FancyButton.Root onClick={() => setCurrentStep(s => s + 1)} size="medium">
            {wizardDict.next}
            <FancyButton.Icon as={RiArrowRightSLine} />
          </FancyButton.Root>
        )}
      </div>
    </div>
  );
};

/* ─── Internal helper ─── */

interface StepperItemProps {
  index: number;
  label: string;
  state: 'completed' | 'active' | 'default';
  isLast: boolean;
  onClick: () => void;
}

const StepperItem = ({ index, label, state, isLast, onClick }: StepperItemProps) => (
  <>
    <button type="button" onClick={onClick} className="cursor-pointer">
      <HorizontalStepper.Item state={state}>
        <HorizontalStepper.ItemIndicator>{index + 1}</HorizontalStepper.ItemIndicator>
        <span className="hidden sm:inline">{label}</span>
      </HorizontalStepper.Item>
    </button>
    {!isLast && <HorizontalStepper.SeparatorIcon />}
  </>
);
