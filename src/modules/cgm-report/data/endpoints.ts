import type { IHttpClient } from '@/http_client';

const isMocked = false;

export const endpointsCgmReport: Record<string, IHttpClient> = {
  list: {
    url: '/ms-bia-consumptions/v1/reports/list',
    method: 'GET',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  },
  create: {
    url: '/ms-bia-consumptions/v1/reports/projects/consumption',
    method: 'POST',
    requiresAuthorization: true,
    isMocked,
    urlMock: ''
  }
};
