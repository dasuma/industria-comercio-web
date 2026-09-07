'use client';

import { useCallback, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebaseAuth } from '@auth/firebase';

// Envía el mail de restablecimiento de contraseña de Firebase. Igual que
// useEmailSignIn expone el `code` del error para que la UI lo traduzca.
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReset = useCallback(async (email: string) => {
    setError(null);
    setIsSent(false);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setIsSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError(code ?? (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsSent(false);
  }, []);

  return { sendReset, isLoading, isSent, error, reset };
};
