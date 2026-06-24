import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMigrateInvoices } from './migrateInvoices';

jest.mock('@/http_client', () => ({
  doFetch: jest.fn()
}));

const { doFetch } = jest.requireMock('@/http_client') as { doFetch: jest.Mock };

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestQueryClientWrapper';
  return Wrapper;
};

const mockResponse = {
  table: 'invoices',
  total_records: 100,
  inserted: 95,
  skipped: 5,
  errors: []
};

describe('useMigrateInvoices', () => {
  beforeEach(() => doFetch.mockReset());

  it('calls doFetch with multipart endpoint and clear flag', async () => {
    doFetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMigrateInvoices(), {
      wrapper: createWrapper()
    });

    const file = new File(['content'], 'ESTIYC.DBF');

    act(() => {
      result.current.mutate({ file, clear: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(doFetch).toHaveBeenCalledWith({
      endpoint: expect.objectContaining({
        url: expect.stringContaining('/ms-pradma/migrations/invoices?clear=true'),
        method: 'POST'
      }),
      params: expect.any(FormData)
    });
  });

  it('appends file to FormData', async () => {
    doFetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMigrateInvoices(), {
      wrapper: createWrapper()
    });

    const file = new File(['dbf-content'], 'ESTIYC.DBF');

    act(() => {
      result.current.mutate({ file, clear: false });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const formData = doFetch.mock.calls[0][0].params as FormData;
    expect(formData.get('file')).toBe(file);
  });
});
