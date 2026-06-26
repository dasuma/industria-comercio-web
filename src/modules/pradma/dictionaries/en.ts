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
    },
    fields: {
      name: 'Name',
      address: 'Address',
      phone: 'Phone',
      description: 'Description',
      startDate: 'Start date',
      endDate: 'End date',
      clientId: 'Identification number'
    },
    tabs: {
      data: 'Data',
      client: 'Client',
      payments: 'Payments',
      settlements: 'Settlements',
      settle: 'Settle'
    },
    form: {
      errors: {
        nameRequired: 'Name is required',
        addressRequired: 'Address is required',
        startDateRequired: 'Start date is required',
        phoneOnlyNumbers: 'Phone must contain only numbers',
        clientIdRequired: 'Taxpayer is required',
        serverError: 'Could not save establishment.'
      },
      success: {
        created: 'Establishment created successfully.',
        updated: 'Establishment updated successfully.'
      }
    },
    comingSoon: 'Coming soon'
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
  settle: {
    year: 'Settlement year',
    noYearAvailable: 'This establishment is up to date with its settlements.',
    months: 'Settlement months',
    startDate: 'Start date',
    endDate: 'End date',
    presentationDate: 'Presentation date',
    settlementDate: 'Settlement date',
    calculate: 'Calculate',
    steps: {
      period: 'Period',
      activities: 'Activities'
    },
    activities: {
      add: 'Add activity',
      defaultActivity: 'Main activity',
      activity: 'Activity',
      activityCode: 'Activity code',
      activityName: 'Activity name',
      selectActivity: 'Select activity...',
      ventasAnuales: 'Annual sales',
      impuestoJuegos: 'Permitted games and street vendor tax',
      menosSaldo: 'Less credit balance from previous year',
      menosAnticipo: 'Less advance from previous year',
      menosRetenciones: 'Less withholdings applied',
      optionalTaxes: {
        title: 'Optional taxes',
        avisosTableros: 'Signs and billboards tax',
        sobretasaBomberil: 'Fire brigade surcharge',
        estampillaCMGRD: 'CMGRD stamp',
        valorNovedad: 'Novelty value'
      }
    },
    baseGravable: {
      title: 'Tax base',
      row8: '8 - Total ordinary and extraordinary income for the period nationwide',
      row9: '9 - Less income outside this municipality or district',
      row10: '10 - Total income in this municipality (line 8 minus 9)',
      row11: '11 - Less returns, rebates and discounts',
      row12: '12 - Less income from exports',
      row13: '13 - Less income from sale of fixed assets',
      row14: '14 - Less excluded, non-taxable and other non-taxed income',
      row15: '15 - Less other exempt activities in this municipality',
      row16: '16 - Total taxable income (line 10 minus 11, 12, 13, 14 and 15)'
    },
    errors: {
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      presentationDateRequired: 'Presentation date is required',
      presentationDateFuture: 'Presentation date cannot be in the past',
      settlementDateRequired: 'Settlement date is required',
      settlementDateFuture: 'Settlement date cannot be in the past'
    },
    result: {
      title: 'Settlement result',
      newSettlement: 'New settlement',
      downloadPdf: 'Save settlement',
      activitiesTitle: 'Activities',
      tariffRate: 'Rate',
      icaTax: 'ICA'
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
    establishments: 'Migrate establishments',
    establishmentTariffs: 'Migrate establishment tariffs',
    invoices: 'Migrate invoices',
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
        establishments: 'Establ.',
        establishmentTariffs: 'Tariffs est.',
        invoices: 'Invoices',
        summary: 'Summary'
      },
      descriptions: {
        clients: 'Terceros.DBF → clients',
        activityCategories: 'DSTIYC.DBF → activity_categories',
        tariffs: 'FCTIYC.DBF → tariffs',
        interestRates: 'intpreacd.DBF → interest_rates',
        yearConfigs: 'años.DBF → year_configs',
        discounts: 'dsciyc.DBF → discounts',
        establishments: 'ESTIYC.DBF → establishments',
        establishmentTariffs: 'ESTIYC.DBF → establishment_tariffs',
        invoices: 'ESTIYC.DBF → invoices'
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
  invoices: {
    title: 'Settlements',
    loading: 'Loading settlements...',
    empty: 'No settlements to show.',
    errorLoading: 'Could not load settlements.',
    columns: {
      id: 'ID',
      establishment: 'Establishment',
      year: 'Year',
      status: 'Status',
      total: 'Total',
      presentationDate: 'Presentation date'
    },
    status: {
      draft: 'Draft',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue'
    }
  },
  common: {
    search: 'Search...',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    saving: 'Saving...',
    serverError: 'An error occurred. Try again.',
    yes: 'Yes',
    no: 'No',
    page: 'Page',
    of: 'of'
  }
};
