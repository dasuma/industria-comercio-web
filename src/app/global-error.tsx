'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <section style={{ maxWidth: '32rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Algo salió muy mal</h1>
            <p style={{ marginTop: '0.5rem', color: '#666' }}>
              Hubo un error al cargar la aplicación. Intenta de nuevo.
            </p>
            <button
              onClick={reset}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #ccc' }}
            >
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
