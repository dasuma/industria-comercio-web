import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateClientsVars {
  file: File;
  clear: boolean;
}

const migrateClients = ({ file, clear }: MigrateClientsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateClients,
      url: `${endpointsPradma.migrateClients.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateClients = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: migrateClients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH] });
    }
  });
};
