import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateInterestRatesVars {
  file: File;
  clear: boolean;
}

const migrateInterestRates = ({ file, clear }: MigrateInterestRatesVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateInterestRates,
      url: `${endpointsPradma.migrateInterestRates.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateInterestRates = () =>
  useMutation({
    mutationFn: migrateInterestRates
  });
