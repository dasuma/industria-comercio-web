import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateYearConfigsVars {
  file: File;
  clear: boolean;
}

const migrateYearConfigs = ({ file, clear }: MigrateYearConfigsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateYearConfigs,
      url: `${endpointsPradma.migrateYearConfigs.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateYearConfigs = () =>
  useMutation({
    mutationFn: migrateYearConfigs
  });
