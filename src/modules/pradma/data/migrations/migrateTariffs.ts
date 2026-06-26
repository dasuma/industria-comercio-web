import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateTariffsVars {
  file: File;
  clear: boolean;
}

const migrateTariffs = ({ file, clear }: MigrateTariffsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateTariffs,
      url: `${endpointsPradma.migrateTariffs.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateTariffs = () =>
  useMutation({
    mutationFn: migrateTariffs
  });
