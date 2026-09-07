'use client';

import { useCallback, useState } from 'react';
import { Button, FancyButton, HorizontalStepper } from '@dasuma/pradma-ui';
import { RiArrowLeftSLine, RiArrowRightSLine, RiRestartLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import { interpolate } from '@/utils/format';
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

// El orden importa: cada paso depende de los anteriores (establecimientos
// necesitan contribuyentes, facturas necesitan establecimientos, etc.).
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
const emptyResults = (): (MigrationResult | null)[] =>
  Array.from({ length: STEPS.length }, () => null);
const emptySkipped = (): boolean[] => Array.from({ length: STEPS.length }, () => false);

interface MigrationsWizardProps {
  dict: PradmaDictionary;
}

export const MigrationsWizard = ({ dict }: MigrationsWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Hasta dónde llegó el usuario: el stepper solo permite volver a pasos ya
  // visitados (completados u omitidos), nunca saltar hacia adelante.
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [results, setResults] = useState<(MigrationResult | null)[]>(emptyResults);
  const [skipped, setSkipped] = useState<boolean[]>(emptySkipped);

  const wizardDict = dict.migrations.wizard;
  const isSummary = currentStep === STEPS.length;

  const handleComplete = useCallback((index: number, result: MigrationResult) => {
    setResults(prev => {
      const next = [...prev];
      next[index] = result;
      return next;
    });
    setSkipped(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  const goTo = useCallback((step: number) => {
    setCurrentStep(step);
    setMaxVisitedStep(prev => Math.max(prev, step));
  }, []);

  const handleNext = useCallback(() => {
    // Avanzar sin correr el paso lo marca como omitido para el resumen.
    if (results[currentStep] === null) {
      setSkipped(prev => {
        const next = [...prev];
        next[currentStep] = true;
        return next;
      });
    }
    goTo(currentStep + 1);
  }, [currentStep, results, goTo]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setMaxVisitedStep(0);
    setResults(emptyResults());
    setSkipped(emptySkipped());
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
            disabled={i > maxVisitedStep}
            onClick={() => goTo(i)}
          />
        ))}
        <StepperItem
          index={STEPS.length}
          label={wizardDict.steps.summary}
          state={getStepState(STEPS.length)}
          isLast
          disabled={STEPS.length > maxVisitedStep}
          onClick={() => goTo(STEPS.length)}
        />
      </HorizontalStepper.Root>

      {/* Step indicator */}
      <p className="text-text-sub-600 text-paragraph-sm">
        {interpolate(wizardDict.stepOf, { current: currentStep + 1, total: TOTAL_STEPS })}
      </p>

      {/* Content */}
      <div className="mx-auto w-full max-w-lg">
        {isSummary ? (
          <MigrationSummary results={results} skipped={skipped} steps={STEPS} dict={dict} />
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
        {/* [R7] Atrás es terciario (ghost) junto a la primary "Siguiente" */}
        <Button.Root
          variant="basic"
          mode="ghost"
          onClick={() => setCurrentStep(s => s - 1)}
          disabled={currentStep === 0}
        >
          <Button.Icon as={RiArrowLeftSLine} />
          {wizardDict.back}
        </Button.Root>

        {isSummary ? (
          <Button.Root variant="basic" onClick={handleRestart}>
            <Button.Icon as={RiRestartLine} />
            {wizardDict.restart}
          </Button.Root>
        ) : (
          // [R7] FancyButton for primary "Next" action
          <FancyButton.Root onClick={handleNext} size="medium">
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
  disabled: boolean;
  onClick: () => void;
}

// HorizontalStepper.Item ya renderiza un <button>: no lo envolvemos en otro.
const StepperItem = ({ index, label, state, isLast, disabled, onClick }: StepperItemProps) => (
  <>
    <HorizontalStepper.Item
      state={state}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-current={state === 'active' ? 'step' : undefined}
      className={cn(disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')}
    >
      <HorizontalStepper.ItemIndicator state={state}>{index + 1}</HorizontalStepper.ItemIndicator>
      <span className="hidden sm:inline">{label}</span>
    </HorizontalStepper.Item>
    {!isLast && <HorizontalStepper.SeparatorIcon />}
  </>
);
