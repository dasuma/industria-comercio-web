import type { IHttpClient } from '@/http_client';

const base = '/ms-pradma';

export const endpointsPradma: Record<string, IHttpClient> = {
  // Clients
  searchClients: {
    url: `${base}/clients/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getClient: {
    url: `${base}/clients`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createClient: {
    url: `${base}/clients`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateClient: {
    url: `${base}/clients`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteClient: {
    url: `${base}/clients`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Establishments
  searchEstablishments: {
    url: `${base}/establishments/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getEstablishment: {
    url: `${base}/establishments`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createEstablishment: {
    url: `${base}/establishments`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateEstablishment: {
    url: `${base}/establishments`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteEstablishment: {
    url: `${base}/establishments`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Establishment Activities
  searchEstablishmentActivities: {
    url: `${base}/establishment-activities/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getEstablishmentActivity: {
    url: `${base}/establishment-activities`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createEstablishmentActivity: {
    url: `${base}/establishment-activities`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateEstablishmentActivity: {
    url: `${base}/establishment-activities`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteEstablishmentActivity: {
    url: `${base}/establishment-activities`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Activity Types
  searchActivityTypes: {
    url: `${base}/activity-types/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getActivityType: {
    url: `${base}/activity-types`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createActivityType: {
    url: `${base}/activity-types`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateActivityType: {
    url: `${base}/activity-types`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteActivityType: {
    url: `${base}/activity-types`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Activity Categories
  searchActivityCategories: {
    url: `${base}/activity-categories/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getActivityCategory: {
    url: `${base}/activity-categories`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createActivityCategory: {
    url: `${base}/activity-categories`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateActivityCategory: {
    url: `${base}/activity-categories`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteActivityCategory: {
    url: `${base}/activity-categories`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Users
  searchUsers: {
    url: `${base}/users/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getUser: {
    url: `${base}/users`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createUser: {
    url: `${base}/users`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  updateUser: {
    url: `${base}/users`,
    method: 'PUT',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  deleteUser: {
    url: `${base}/users`,
    method: 'DELETE',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Migrations (multipart/form-data)
  migrateClients: {
    url: `${base}/migrations/clients`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateActivityCategories: {
    url: `${base}/migrations/activity-categories`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateTariffs: {
    url: `${base}/migrations/tariffs`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateInterestRates: {
    url: `${base}/migrations/interest-rates`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateYearConfigs: {
    url: `${base}/migrations/year-configs`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateDiscounts: {
    url: `${base}/migrations/discounts`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateEstablishments: {
    url: `${base}/migrations/establishments`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  migrateEstablishmentTariffs: {
    url: `${base}/migrations/establishment-tariffs`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  },
  getActivitiesByYear: {
    url: `${base}/establishment-activities/year`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getEstablishmentActivitiesByYear: {
    url: `${base}/establishment-activities/establishment`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Settlements
  saveSettlement: {
    url: `${base}/settlements/save`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createSettlement: {
    url: `${base}/settlements`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  // Invoices
  searchInvoices: {
    url: `${base}/invoices/search`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  createDraftInvoice: {
    url: `${base}/invoices/draft`,
    method: 'POST',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  getInvoicesByEstablishment: {
    url: `${base}/invoices/establishment`,
    method: 'GET',
    requiresAuthorization: true,
    isMocked: false,
    urlMock: ''
  },
  migrateInvoices: {
    url: `${base}/migrations/invoices`,
    method: 'POST',
    requiresAuthorization: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    isMocked: false,
    urlMock: ''
  }
};
