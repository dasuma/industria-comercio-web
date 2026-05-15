import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BulkDepositsResponse } from '../../types/transactionResponses';

// El endpoint espera multipart/form-data con un campo `file` (archivo Excel).
// El http_client borra el Content-Type para que el browser ponga el boundary
// automáticamente; basta con pasar el FormData como `params`.
const createDepositsFromExcel = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return doFetch<FormData, BulkDepositsResponse>({
    endpoint: endpointsBianetwork.createDepositsFromExcel,
    params: form
  });
};

export const useCreateDepositsFromExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepositsFromExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
