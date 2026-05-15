import type { IHttpClient } from '@/http_client';

export const endpointsReportTito: Record<string, IHttpClient> = {
  getReport: {
    url: '/ms-tito/consumptions',
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  }
};
