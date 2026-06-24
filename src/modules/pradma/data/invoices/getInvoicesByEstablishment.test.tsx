import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useGetInvoicesByEstablishment } from './getInvoicesByEstablishment';

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

const mockRawInvoices = [
  {
    id: 1,
    establishment_id: 10,
    year: 2023,
    status: 'paid',
    presentation_date: null,
    expiration_date: '2023-01-01T00:00:00Z',
    total: 150000,
    details: [
      {
        id: 1,
        invoice_id: 1,
        kind: 'impuesto',
        amount: 150000,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

describe('useGetInvoicesByEstablishment', () => {
  beforeEach(() => doFetch.mockReset());

  it('calls doFetch with establishment id in URL', async () => {
    doFetch.mockResolvedValueOnce(mockRawInvoices);

    const { result } = renderHook(() => useGetInvoicesByEstablishment(10), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(doFetch).toHaveBeenCalledWith({
      endpoint: expect.objectContaining({
        url: expect.stringContaining('/ms-pradma/invoices/establishment'),
        method: 'GET'
      }),
      value: '/10'
    });
  });

  it('adapts snake_case response to camelCase', async () => {
    doFetch.mockResolvedValueOnce(mockRawInvoices);

    const { result } = renderHook(() => useGetInvoicesByEstablishment(10), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]).toMatchObject({
      id: 1,
      establishmentId: 10,
      year: 2023,
      status: 'paid',
      total: 150000,
      details: [expect.objectContaining({ invoiceId: 1, kind: 'impuesto', amount: 150000 })]
    });
  });

  it('does not fetch when establishmentId is null', () => {
    const { result } = renderHook(() => useGetInvoicesByEstablishment(null), {
      wrapper: createWrapper()
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(doFetch).not.toHaveBeenCalled();
  });
});
