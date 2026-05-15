import type { IHttpClient } from '@/http_client';

export const endpointsBianetwork: Record<string, IHttpClient> = {
  getUsers: {
    url: '/ms-bia-network/users',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateUserStatus: {
    url: '/ms-olibia/app-bia-network/users',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  upgradeUserToPro: {
    url: '/ms-bia-network/users',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getAccounts: {
    url: '/ms-olibia/app-bia-network/bank-accounts',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getAccountDetail: {
    url: '/ms-olibia/app-bia-network/bank-accounts',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateAccountStatus: {
    url: '/ms-olibia/app-bia-network/bank-accounts',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getTransactions: {
    url: '/ms-olibia/app-bia-network/transactions/adm/olibia',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getTransactionDetail: {
    url: '/ms-olibia/app-bia-network/transactions/adm/olibia',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateTransactionStatus: {
    url: '/ms-olibia/app-bia-network/transactions',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createBulkDeposits: {
    url: '/ms-bia-network/transactions/bulk-deposits',
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createDepositsFromExcel: {
    url: '/ms-bia-network/transactions/deposits-from-excel',
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  getInvoices: {
    url: '/ms-olibia/app-bia-network/lead-invoices',
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateInvoiceStatus: {
    url: '/ms-olibia/app-bia-network/lead-invoices',
    method: 'PATCH',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  }
};
