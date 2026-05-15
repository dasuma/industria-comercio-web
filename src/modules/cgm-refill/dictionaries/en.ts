import type { CgmRefillDictionary } from './es';

export const cgmRefillDictEn: CgmRefillDictionary = {
  title: 'CGM Consumption',
  refreshCache: 'Refresh consumption',
  search: {
    label: 'Search contract',
    placeholder: 'Enter a value…',
    noResults: 'No results',
    searching: 'Searching…',
    fields: {
      id: 'ID',
      name: 'Name',
      sic: 'SIC'
    }
  },
  contractInfo: {
    title: 'Contract information',
    name: 'Name',
    sic: 'SIC',
    id: 'Contract ID',
    sicAgpe: 'SIC AGPE',
    startsAt: 'Start date',
    billingEndsAt: 'Billing end date',
    consumptionAverage: 'Consumption average'
  },
  form: {
    title: 'Configure refill',
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Reason or details for the refill…',
    deleteOnlyLabel: 'Delete only (no reinsert)',
    submit: 'Run refill',
    cancel: 'Cancel',
    success: 'Refill started successfully',
    error: 'Error running refill',
    selectContractFirst: 'Select a contract to continue'
  }
};
