import type { IHttpClient } from '@/http_client';

const isMocked = false;

export const endpointsRetention: Record<string, IHttpClient> = {
  findContractsByIds: {
    url: '/ms-users/contracts/find/by-ids/',
    method: 'POST',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  getContractRecs: {
    url: '/ms-recs/contract_rectvalue',
    method: 'GET',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  getContractRates: {
    url: '/ms-bill/internal-ms/rate/all-by-contract',
    method: 'GET',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  // TODO: confirm endpoint URL with backend
  updateContract: {
    url: '/ms-users/contracts',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  }
};
