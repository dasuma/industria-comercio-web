import type { CgmAnalysisDictionary } from './es';

export const cgmAnalysisDictEn: CgmAnalysisDictionary = {
  title: 'Analysis',
  refreshTooltip: 'Refresh consumption',
  refreshSuccess: 'Consumption refreshed',
  cacheError: 'Error refreshing consumption',
  monthLabel: 'Month',
  selectContractFirst: 'Select a contract to continue',
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
  refill: {
    button: 'Refill',
    modalTitle: 'Configure refill',
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Reason or details for the refill…',
    deleteOnlyLabel: 'Delete only (no reinsert)',
    submit: 'Run refill',
    cancel: 'Cancel',
    success: 'Refill started successfully',
    error: 'Error running refill'
  },
  analysis: {
    button: 'Report',
    buttonLoading: 'Generating report',
    buttonReady: 'View report',
    modalTitle: 'Generate report',
    dateRangeLabel: 'Dates',
    dateRangePlaceholder: 'Select a date range',
    periodLabel: 'Period',
    periods: {
      '15m': '15 minutes',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    },
    submit: 'Generate',
    cancel: 'Cancel',
    error: 'Error generating the report',
    rangeError: 'Select a date range',
    pdf: {
      title: 'Generated report',
      download: 'Download PDF',
      regenerate: 'Generate new report'
    }
  }
};
