'use client';

import { Button } from '@biaenergy/ui';
import { useGetExamples } from '../../data/list/getExamples';
import { getExampleDict } from '../../dictionaries';
import type { Locale } from '@/i18n/config';

interface ExampleListProps {
  locale: Locale;
}

export const ExampleList = ({ locale }: ExampleListProps) => {
  const dict = getExampleDict(locale);
  const { data, isLoading, isError, refetch } = useGetExamples();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-bg-weak-50 h-16 animate-pulse rounded-lg" />
        ))}
        <span className="sr-only">{dict.list.loading}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="border-stroke-soft-200 flex flex-col items-start gap-2 rounded-lg border p-4"
      >
        <p className="text-text-strong-950">{dict.list.errorLoading}</p>
        <Button.Root variant="neutral" mode="stroke" size="small" onClick={() => refetch()}>
          {dict.list.retry}
        </Button.Root>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="border-stroke-soft-200 text-text-sub-600 rounded-lg border p-4">
        {dict.list.empty}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.slice(0, 10).map(example => (
        <li key={example.id} className="border-stroke-soft-200 rounded-lg border p-4">
          <h3 className="text-text-strong-950 font-medium">{example.title}</h3>
          <p className="text-text-sub-600 mt-1 text-sm">{example.body}</p>
        </li>
      ))}
    </ul>
  );
};
