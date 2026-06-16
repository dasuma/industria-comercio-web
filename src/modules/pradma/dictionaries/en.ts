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
    },
    columns: {
      id: 'ID',
      name: 'Name',
      documentType: 'Doc. type',
      email: 'Email',
      phone: 'Phone',
      isCompany: 'Company'
    },
    fields: {
      id: 'Identification number',
      name: 'Name',
      documentType: 'Document type',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      isCompany: 'Is company'
    },
    form: {
      title: 'Taxpayer details',
      createTitle: 'New taxpayer',
      errors: {
        idRequired: 'Identification number is required',
        idOnlyNumbers: 'Only numbers are allowed',
        nameRequired: 'Name is required',
        documentTypeRequired: 'Document type is required',
        addressRequired: 'Address is required',
        phoneRequired: 'Phone is required',
        phoneOnlyNumbers: 'Phone must contain only numbers',
        emailInvalid: 'Invalid email',
        serverError: 'Could not save taxpayer. Try again.'
      },
      success: {
        created: 'Taxpayer created successfully.',
        updated: 'Taxpayer updated successfully.'
      }
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
    },
    columns: {
      id: 'ID',
      registrationNumber: 'Reg. number',
      name: 'Name',
      clientId: 'Taxpayer',
      address: 'Address',
      phone: 'Phone',
      startDate: 'Start date'
    }
  },
  activityCategories: {
    title: 'Economic activities',
    loading: 'Loading economic activities...',
    empty: 'No economic activities to show.',
    errorLoading: 'Could not load economic activities.',
    create: 'Create economic activity',
    edit: 'Edit economic activity',
    delete: 'Delete economic activity',
    deleteConfirm: 'Are you sure you want to delete this economic activity?',
    success: {
      created: 'Economic activity created successfully.',
      updated: 'Economic activity updated successfully.',
      deleted: 'Economic activity deleted successfully.'
    },
    columns: {
      id: 'ID',
      activityTypeCode: 'Type code',
      activityTypeName: 'Type name',
      yearInitial: 'Start year',
      yearEnd: 'End year'
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
    },
    columns: {
      id: 'ID',
      email: 'Email',
      role: 'Role'
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
    establishmentTariffs: 'Migrate establishment tariffs',
    wizard: {
      stepOf: 'Step {current} of {total}',
      back: 'Back',
      next: 'Next',
      restart: 'Start over',
      steps: {
        clients: 'Taxpayers',
        activityCategories: 'Categories',
        tariffs: 'Tariffs',
        interestRates: 'Rates',
        yearConfigs: 'Years',
        discounts: 'Discounts',
        establishmentTariffs: 'Establ.',
        summary: 'Summary'
      },
      descriptions: {
        clients: 'Terceros.DBF → clients',
        activityCategories: 'DSTIYC.DBF → activity_categories',
        tariffs: 'FCTIYC.DBF → tariffs',
        interestRates: 'intpreacd.DBF → interest_rates',
        yearConfigs: 'años.DBF → year_configs',
        discounts: 'dsciyc.DBF → discounts',
        establishmentTariffs: 'ESTIYC.DBF → establishment_tariffs'
      },
      summary: {
        title: 'Migration summary',
        step: 'Step',
        file: 'DBF → Table',
        success: 'Successful',
        failed: 'Failed',
        total: 'Total',
        totals: 'Totals',
        allSuccess: 'All migrations completed without errors.',
        hasErrors: 'Some migrations had errors.',
        notRun: 'Not run'
      }
    }
  },
  common: {
    search: 'Search...',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...',
    serverError: 'An error occurred. Try again.',
    yes: 'Yes',
    no: 'No',
    page: 'Page',
    of: 'of'
  }
};
