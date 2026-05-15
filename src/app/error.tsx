'use client';

import { useEffect } from 'react';
import { Button } from '@biaenergy/ui';
import { RiRefreshLine } from '@biaenergy/ui/icons';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-title-h5 text-text-strong-950">Ocurrió un error</h1>
        <p className="text-paragraph-sm text-text-sub-600">
          No pudimos completar la operación. Intenta de nuevo o vuelve al inicio.
        </p>
        <Button.Root variant="primary" mode="filled" size="medium" onClick={reset}>
          <Button.Icon as={RiRefreshLine} />
          Reintentar
        </Button.Root>
      </section>
    </main>
  );
};

export default ErrorPage;
