import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateEstablishmentsVars {
  file: File;
  clear: boolean;
}

const migrateEstablishments = ({ file, clear }: MigrateEstablishmentsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateEstablishments,
      url: `${endpointsPradma.migrateEstablishments.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateEstablishments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: migrateEstablishments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH] });
    }
  });
};
