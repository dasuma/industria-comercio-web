import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateEstablishmentTariffsVars {
  file: File;
  clear: boolean;
}

const migrateEstablishmentTariffs = ({ file, clear }: MigrateEstablishmentTariffsVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateEstablishmentTariffs,
      url: `${endpointsPradma.migrateEstablishmentTariffs.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateEstablishmentTariffs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: migrateEstablishmentTariffs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH] });
    }
  });
};
