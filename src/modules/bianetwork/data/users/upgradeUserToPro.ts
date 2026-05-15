import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';

const upgradeUserToPro = (userId: string) =>
  doFetch<Record<string, never>, void>({
    endpoint: endpointsBianetwork.upgradeUserToPro,
    value: `/${userId}/upgrade-to-pro`,
    params: {}
  });

export const useUpgradeUserToPro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upgradeUserToPro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_USERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_USERS_PRO] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
