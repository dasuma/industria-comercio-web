// Data layer hooks
export {
  // Clients
  useSearchClients,
  useGetClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  // Establishments
  useSearchEstablishments,
  useGetEstablishment,
  useCreateEstablishment,
  useUpdateEstablishment,
  useDeleteEstablishment,
  // Establishment Activities
  useSearchEstablishmentActivities,
  useGetEstablishmentActivity,
  useCreateEstablishmentActivity,
  useUpdateEstablishmentActivity,
  useDeleteEstablishmentActivity,
  // Activity Types
  useSearchActivityTypes,
  useGetActivityType,
  useCreateActivityType,
  useUpdateActivityType,
  useDeleteActivityType,
  // Activity Categories
  useSearchActivityCategories,
  useGetActivityCategory,
  useCreateActivityCategory,
  useUpdateActivityCategory,
  useDeleteActivityCategory,
  // Users
  useSearchUsers,
  useGetUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  // Migrations
  useMigrateClients,
  useMigrateActivityCategories,
  useMigrateTariffs,
  useMigrateInterestRates,
  useMigrateYearConfigs,
  useMigrateDiscounts,
  useMigrateEstablishmentTariffs
} from './data';

// Components
export { MigrationCard } from './components/MigrationCard';
export { MigrationsWizard } from './components/MigrationsWizard';
export { MigrationSummary } from './components/MigrationSummary';
export { ClientList } from './components/ClientList';
export { EstablishmentList } from './components/EstablishmentList';
export { ActivityCategoryList } from './components/ActivityCategoryList';
export { UserList } from './components/UserList';

// Dictionaries
export { getPradmaDict } from './dictionaries';
export type { PradmaDictionary } from './dictionaries';

// Models
export { DOCUMENT_TYPE, USER_ROLE } from './models/shared';
export type { DocumentType, UserRole } from './models/shared';
export type { Client } from './models/client.interface';
export type { Establishment } from './models/establishment.interface';
export type { EstablishmentActivity } from './models/establishment-activity.interface';
export type { ActivityType } from './models/activity-type.interface';
export type { ActivityCategory } from './models/activity-category.interface';
export type { PradmaUser } from './models/user.interface';
export type { MigrationResult } from './models/migration.interface';

// Types
export type { SearchRequest, SearchResponse, ApiSearchResponse } from './types/search.types';
export type { CreateClientRequest, UpdateClientRequest } from './types/client.requests';
export type {
  CreateEstablishmentRequest,
  UpdateEstablishmentRequest
} from './types/establishment.requests';
export type {
  CreateEstablishmentActivityRequest,
  UpdateEstablishmentActivityRequest
} from './types/establishment-activity.requests';
export type {
  CreateActivityTypeRequest,
  UpdateActivityTypeRequest
} from './types/activity-type.requests';
export type {
  CreateActivityCategoryRequest,
  UpdateActivityCategoryRequest
} from './types/activity-category.requests';
export type { CreatePradmaUserRequest, UpdatePradmaUserRequest } from './types/user.requests';
