import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateDiscountsVars {
  file: File;
  clear: boolean;
}

const migrateDiscounts = ({ file, clear }: MigrateDiscountsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateDiscounts,
      url: `${endpointsPradma.migrateDiscounts.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateDiscounts = () =>
  useMutation({
    mutationFn: migrateDiscounts
  });
