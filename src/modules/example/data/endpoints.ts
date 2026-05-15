import type { IHttpClient } from '@/http_client';

// El módulo "example" usa jsonplaceholder para que el template funcione
// out-of-the-box sin backend. Reemplazá con tus endpoints reales.
const isMocked = true;
const mockBase = 'https://jsonplaceholder.typicode.com';

export const endpointsExample: Record<string, IHttpClient> = {
  list: {
    url: '/example/posts',
    method: 'GET',
    requiresAuthorization: false,
    isMocked,
    urlMock: `${mockBase}/posts`
  },
  create: {
    url: '/example/posts',
    method: 'POST',
    requiresAuthorization: false,
    isMocked,
    urlMock: `${mockBase}/posts`
  }
};
