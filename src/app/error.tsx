'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, FancyButton } from '@dasuma/pradma-ui';
import { RiRefreshLine } from '@dasuma/pradma-ui/icons';
import { getClientDictionary } from '@/i18n/getClientDictionary';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const [dict] = useState(() => getClientDictionary());

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-bg-weak-25 flex min-h-screen items-center justify-center p-6">
      <section className="bg-bg-white-0 ring-stroke-soft-200 w-full max-w-md space-y-5 rounded-2xl p-8 text-center ring-1">
        <div className="space-y-2">
          <h1 className="text-title-h5 text-text-strong-950">{dict.errors.title}</h1>
          <p className="text-paragraph-sm text-text-sub-600">{dict.errors.description}</p>
        </div>
        <div className="flex flex-col-reverse justify-center gap-3 sm:flex-row">
          {/* [P2] link semántico con estilo de botón secundario */}
          <Button.Root variant="basic" size="medium" asChild>
            <Link href="/">{dict.common.goHome}</Link>
          </Button.Root>
          {/* [R7] reintentar es la acción protagonista */}
          <FancyButton.Root size="medium" onClick={reset}>
            <FancyButton.Icon as={RiRefreshLine} />
            {dict.common.retry}
          </FancyButton.Root>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
