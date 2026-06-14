import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { MigrationResponse } from '../../types/migration.types';

interface MigrateActivityCategoriesVars {
  file: File;
  clear: boolean;
}

const migrateActivityCategories = ({ file, clear }: MigrateActivityCategoriesVars) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, MigrationResponse>({
    endpoint: {
      ...endpointsPradma.migrateActivityCategories,
      url: `${endpointsPradma.migrateActivityCategories.url}?clear=${clear}`
    },
    params: form
  });
};

export const useMigrateActivityCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: migrateActivityCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH] });
    }
  });
};
