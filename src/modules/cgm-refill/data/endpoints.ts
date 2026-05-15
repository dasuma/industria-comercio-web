import type { IHttpClient } from '@/http_client';

const isMocked = false;

export const endpointsCgmRefill: Record<string, IHttpClient> = {
  searchContracts: {
    url: '/ms-users/contracts/search',
    method: 'POST',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  refill: {
    url: '/ms-bia-consumptions/v1/meters/consumption/delete-refill',
    method: 'POST',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  widgets: {
    url: '/ms-bia-consumptions/v1/analitics/widgets',
    method: 'POST',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  clearWidgetsCache: {
    url: '/ms-bia-consumptions/v1/analitics/widgets/cache',
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  }
};
