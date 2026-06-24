import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateInvoicesVars {
  file: File;
  clear: boolean;
}

const migrateInvoices = ({ file, clear }: MigrateInvoicesVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateInvoices,
      url: `${endpointsPradma.migrateInvoices.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateInvoices = () =>
  useMutation({
    mutationFn: migrateInvoices
  });
