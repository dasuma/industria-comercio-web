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
    searchPlaceholder: 'Search by name or ID',
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
    searchPlaceholder: 'Search by name or ID',
    new: 'New establishment',
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
      clientId: 'Taxpayer',
      clientPlaceholder: 'Search taxpayer...',
      clientNoResults: 'No taxpayers found',
      registrationNumber: 'Registration number',
      numberIdentification: 'Identification number',
      documentType: 'Document type'
    },
    tabs: {
      data: 'Data',
      client: 'Taxpayer',
      payments: 'Payments',
      settlements: 'Settlements'
    },
    header: {
      editData: 'Edit details',
      active: 'Active',
      inactive: 'Inactive',
      since: 'Since {date}',
      client: 'Taxpayer',
      registration: 'Registration number',
      document: 'Document',
      lastPaid: 'Last paid settlement'
    },
    form: {
      errors: {
        nameRequired: 'Name is required',
        addressRequired: 'Address is required',
        startDateRequired: 'Start date is required',
        phoneOnlyNumbers: 'Phone must contain only numbers',
        clientIdRequired: 'Taxpayer is required',
        serverError: 'Could not save establishment.',
        deleteError: 'Could not delete establishment.'
      },
      success: {
        created: 'Establishment created successfully.',
        updated: 'Establishment updated successfully.',
        deleted: 'Establishment deleted successfully.'
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
    searchPlaceholder: 'Search by code or name',
    columns: {
      id: 'ID',
      activityTypeCode: 'Type code',
      activityTypeName: 'Type name',
      yearInitial: 'Start year',
      yearEnd: 'End year'
    },
    fields: {
      activityTypeCode: 'Activity code',
      activityTypeName: 'Activity name',
      yearInitial: 'Start year',
      yearEnd: 'End year'
    },
    form: {
      errors: {
        codeRequired: 'Code is required',
        nameRequired: 'Name is required',
        yearRequired: 'Year is required',
        yearInvalid: 'Enter a 4-digit year',
        yearEndBeforeStart: 'End year must be greater than or equal to start year',
        serverError: 'Could not save the economic activity. Try again.'
      },
      success: {
        created: 'Economic activity created successfully.',
        updated: 'Economic activity updated successfully.'
      }
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
    searchPlaceholder: 'Search by email',
    columns: {
      id: 'ID',
      email: 'Email',
      role: 'Role'
    },
    fields: {
      id: 'UID',
      idHint: 'Firebase Authentication UID of the user',
      email: 'Email',
      role: 'Role'
    },
    roles: {
      ADMIN: 'Administrator',
      OPERATOR: 'Operator'
    },
    form: {
      errors: {
        idRequired: 'UID is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email',
        roleRequired: 'Role is required',
        serverError: 'Could not save the user. Try again.'
      },
      success: {
        created: 'User created successfully.',
        updated: 'User updated successfully.'
      }
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
    month: 'month',
    monthsPlural: 'months',
    title: 'New settlement',
    subtitle: 'Pick the year, confirm the sales for each activity and calculate.',
    back: 'Back to settlements',
    calculateFull: 'Calculate settlement',
    pending: {
      one: '1 year pending settlement',
      many: '{count} years pending settlement',
      description: '{years} · One year is settled at a time, starting with the oldest.',
      cta: 'Settle {year}'
    },
    period: {
      title: 'Period',
      derived: 'based on the establishment start and end dates'
    },
    activitiesSection: {
      title: 'Activities and income',
      hint: 'The annual sales of each activity determine the ICA tax.',
      columnActivity: 'Activity',
      columnSales: 'Annual sales',
      registered: 'Registered',
      additional: 'Additional',
      noName: 'No description',
      searchPlaceholder: 'Search activity by code or name…',
      noResults: 'No activities found',
      total: 'Total declared sales',
      empty: 'This establishment has no registered activities for the year. Add at least one.'
    },
    taxesTitle: 'Additional taxes',
    dates: {
      title: 'Document dates',
      today: 'Presentation and settlement: today, {date}',
      custom: 'Presentation {presentation} · Settlement {settlement}'
    },
    summary: {
      activity: '1 activity',
      activities: '{count} activities'
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
      settlementDateFuture: 'Settlement date cannot be in the past',
      activitiesInvalid: 'Fill in the code and sales for every activity'
    },
    result: {
      title: 'Settlement result',
      newSettlement: 'New settlement',
      downloadPdf: 'Save settlement',
      activitiesTitle: 'Activities',
      tariffRate: 'Rate',
      icaTax: 'ICA',
      saved: 'Settlement saved successfully.',
      saveError: 'Could not save the settlement. Try again.',
      savingPdf: 'Saving PDF…',
      discardTitle: 'Discard this settlement?',
      discardDescription:
        'The calculation was not saved. If you close, you will need to calculate it again.',
      discardConfirm: 'Discard'
    }
  },
  migrations: {
    title: 'Migrations',
    upload: 'Upload DBF file',
    clearData: 'Clear existing data before migrating',
    success: 'Migration completed successfully.',
    error: 'Error during migration.',
    migrating: 'Migrating file, this may take a few minutes…',
    recordsMigrated: '{success}/{total} records migrated',
    moreErrors: '… and {count} more errors',
    invalidFile: 'Only .dbf files are accepted',
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
        notRun: 'Not run',
        skipped: 'Skipped'
      }
    }
  },
  invoices: {
    title: 'Settlements',
    loading: 'Loading settlements...',
    empty: 'No settlements to show.',
    emptyHint: 'Settlements are generated from each establishment detail.',
    errorLoading: 'Could not load settlements.',
    searchPlaceholder: 'Search by year, ID or establishment',
    filters: {
      all: 'All'
    },
    sheet: {
      draft: 'Draft',
      detail: 'Detail',
      pdf: 'PDF',
      pdfTitle: 'Settlement PDF',
      activities: 'Activities',
      settlement: 'Settlement',
      activity: 'Activity',
      tariff: 'Rate ‰',
      ica: 'ICA',
      months: 'months'
    },
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
      created: 'Created',
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      expired: 'Expired'
    },
    expirationDate: 'Due'
  },
  sanctions: {
    title: 'Sanctions',
    loading: 'Loading sanctions...',
    empty: 'No sanctions to show.',
    errorLoading: 'Could not load sanctions.',
    create: 'Create sanction',
    edit: 'Edit sanction',
    delete: 'Delete sanction',
    deleteConfirm: 'Are you sure you want to delete this sanction?',
    success: {
      created: 'Sanction created successfully.',
      updated: 'Sanction updated successfully.',
      deleted: 'Sanction deleted successfully.'
    },
    columns: {
      id: 'ID',
      year: 'Year',
      percentage: 'Percentage',
      minSanction: 'Min. sanction',
      minSanctionAlt: 'Min. sanction alt.'
    },
    fields: {
      year: 'Year',
      percentage: 'Percentage (%)',
      minSanction: 'Minimum sanction',
      minSanctionAlt: 'Alternative minimum sanction'
    },
    form: {
      errors: {
        yearRequired: 'Year is required',
        yearInvalid: 'Year must be a valid number',
        percentageRequired: 'Percentage is required',
        percentageInvalid: 'Must be a valid number',
        minSanctionRequired: 'Minimum sanction is required',
        minSanctionInvalid: 'Must be a valid number',
        minSanctionAltRequired: 'Alternative minimum sanction is required',
        minSanctionAltInvalid: 'Must be a valid number',
        serverError: 'Could not save sanction. Try again.'
      },
      success: {
        created: 'Sanction created successfully.',
        updated: 'Sanction updated successfully.'
      }
    }
  },
  interestRates: {
    title: 'Interest Rates',
    loading: 'Loading interest rates...',
    empty: 'No interest rates to show.',
    errorLoading: 'Could not load interest rates.',
    create: 'Create interest rate',
    edit: 'Edit interest rate',
    delete: 'Delete interest rate',
    deleteConfirm: 'Are you sure you want to delete this interest rate?',
    success: {
      created: 'Interest rate created successfully.',
      updated: 'Interest rate updated successfully.',
      deleted: 'Interest rate deleted successfully.'
    },
    columns: {
      id: 'ID',
      year: 'Year',
      startDate: 'Start date',
      endDate: 'End date',
      percentage: 'Percentage',
      interestPercentage: 'Interest'
    },
    fields: {
      year: 'Year',
      startDate: 'Start date',
      endDate: 'End date',
      rateValue1: 'Rate value 1',
      rateValue2: 'Rate value 2',
      rateValue3: 'Rate value 3',
      percentage: 'Percentage (%)',
      surchargePercentage: 'Surcharge percentage (%)',
      interestPercentage: 'Interest percentage (%)',
      rateValuesHint: 'Reference values used by the settlement depending on the delinquency period'
    },
    form: {
      sections: {
        validity: 'Validity',
        rateValues: 'Rate values',
        percentages: 'Percentages'
      },
      errors: {
        yearRequired: 'Year is required',
        yearInvalid: 'Year must be a valid number',
        startDateRequired: 'Start date is required',
        endDateRequired: 'End date is required',
        endDateBeforeStart: 'End date must be after start date',
        percentageRequired: 'Percentage is required',
        percentageInvalid: 'Must be a valid number',
        serverError: 'Could not save interest rate. Try again.'
      },
      success: {
        created: 'Interest rate created successfully.',
        updated: 'Interest rate updated successfully.'
      }
    }
  },
  discounts: {
    title: 'Discounts',
    loading: 'Loading discounts...',
    empty: 'No discounts to show.',
    errorLoading: 'Could not load discounts.',
    create: 'Create discount',
    edit: 'Edit discount',
    delete: 'Delete discount',
    deleteConfirm: 'Are you sure you want to delete this discount?',
    success: {
      created: 'Discount created successfully.',
      updated: 'Discount updated successfully.',
      deleted: 'Discount deleted successfully.'
    },
    columns: {
      id: 'ID',
      year: 'Year',
      startDate: 'Start date',
      endDate: 'End date',
      percentage: 'Percentage'
    },
    fields: {
      year: 'Year',
      startDate: 'Start date',
      endDate: 'End date',
      percentage: 'Percentage (%)'
    },
    form: {
      errors: {
        yearRequired: 'Year is required',
        yearInvalid: 'Year must be a valid number',
        startDateRequired: 'Start date is required',
        endDateRequired: 'End date is required',
        percentageRequired: 'Percentage is required',
        percentageInvalid: 'Must be a valid number',
        endDateBeforeStart: 'End date must be after start date',
        serverError: 'Could not save discount. Try again.'
      },
      success: {
        created: 'Discount created successfully.',
        updated: 'Discount updated successfully.'
      }
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
    of: 'of',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    deleting: 'Deleting...',
    actions: 'Actions',
    clearSearch: 'Clear search',
    searchByYear: 'Search by year',
    noResultsTitle: 'No results',
    noResultsDescription: 'Nothing matches "{query}". Try another term.',
    emptyHint: 'Once you create the first one it will show up here.',
    errorTitle: 'Could not load the data',
    rangeLabel: '{from}–{to} of {total}',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    selectPlaceholder: 'Select...',
    deleteTitle: 'Delete this record?',
    deleteDescription: 'This action cannot be undone.',
    deleteError: 'Could not delete. Try again.',
    optional: 'Optional',
    notAvailable: '—'
  }
};
