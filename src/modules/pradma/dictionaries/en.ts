import type { PradmaDictionary } from './es';

export const pradmaDictEn: PradmaDictionary = {
  title: 'Industry & Commerce',
  description: 'Industry and Commerce tax management (PRADMA).',
  clients: {
    title: 'Taxpayers',
    loading: 'Loading taxpayers...',
    empty: 'No taxpayers to show.',
    errorLoading: 'Could not load taxpayers.',
    create: 'Create taxpayer',
    edit: 'Edit taxpayer',
    delete: 'Delete taxpayer',
    deleteConfirm: 'Are you sure you want to delete this taxpayer?',
    success: {
      created: 'Taxpayer created successfully.',
      updated: 'Taxpayer updated successfully.',
      deleted: 'Taxpayer deleted successfully.'
    }
  },
  establishments: {
    title: 'Establishments',
    loading: 'Loading establishments...',
    empty: 'No establishments to show.',
    errorLoading: 'Could not load establishments.',
    create: 'Create establishment',
    edit: 'Edit establishment',
    delete: 'Delete establishment',
    deleteConfirm: 'Are you sure you want to delete this establishment?',
    success: {
      created: 'Establishment created successfully.',
      updated: 'Establishment updated successfully.',
      deleted: 'Establishment deleted successfully.'
    }
  },
  establishmentActivities: {
    title: 'Establishment activities',
    loading: 'Loading activities...',
    empty: 'No activities to show.',
    errorLoading: 'Could not load activities.',
    create: 'Create activity',
    edit: 'Edit activity',
    delete: 'Delete activity',
    deleteConfirm: 'Are you sure you want to delete this activity?',
    success: {
      created: 'Activity created successfully.',
      updated: 'Activity updated successfully.',
      deleted: 'Activity deleted successfully.'
    }
  },
  activityTypes: {
    title: 'Activity types',
    loading: 'Loading activity types...',
    empty: 'No activity types to show.',
    errorLoading: 'Could not load activity types.',
    create: 'Create activity type',
    edit: 'Edit activity type',
    delete: 'Delete activity type',
    deleteConfirm: 'Are you sure you want to delete this activity type?',
    success: {
      created: 'Activity type created successfully.',
      updated: 'Activity type updated successfully.',
      deleted: 'Activity type deleted successfully.'
    }
  },
  activityCategories: {
    title: 'Activity categories',
    loading: 'Loading categories...',
    empty: 'No categories to show.',
    errorLoading: 'Could not load categories.',
    create: 'Create category',
    edit: 'Edit category',
    delete: 'Delete category',
    deleteConfirm: 'Are you sure you want to delete this category?',
    success: {
      created: 'Category created successfully.',
      updated: 'Category updated successfully.',
      deleted: 'Category deleted successfully.'
    }
  },
  users: {
    title: 'Users',
    loading: 'Loading users...',
    empty: 'No users to show.',
    errorLoading: 'Could not load users.',
    create: 'Create user',
    edit: 'Edit user',
    delete: 'Delete user',
    deleteConfirm: 'Are you sure you want to delete this user?',
    success: {
      created: 'User created successfully.',
      updated: 'User updated successfully.',
      deleted: 'User deleted successfully.'
    }
  },
  migrations: {
    title: 'Migrations',
    upload: 'Upload DBF file',
    clearData: 'Clear existing data before migrating',
    success: 'Migration completed successfully.',
    error: 'Error during migration.',
    clients: 'Migrate taxpayers',
    activityCategories: 'Migrate activity categories',
    tariffs: 'Migrate tariffs',
    interestRates: 'Migrate interest rates',
    yearConfigs: 'Migrate year configurations',
    discounts: 'Migrate discounts',
    establishmentTariffs: 'Migrate establishment tariffs'
  },
  common: {
    search: 'Search...',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...',
    serverError: 'An error occurred. Try again.'
  }
};
