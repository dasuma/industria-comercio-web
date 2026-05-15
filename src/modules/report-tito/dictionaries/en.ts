import type { ReportTitoDictionary } from './es';

export const reportTitoDictEn: ReportTitoDictionary = {
  title: 'CGM Analysis',
  search: {
    label: 'Search contract'
  },
  form: {
    startDateLabel: 'Start date',
    endDateLabel: 'End date',
    periodLabel: 'Period',
    periods: {
      '15m': '15 minutes',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    },
    submit: 'Generate report',
    selectContractFirst: 'Select a contract to continue',
    error: 'Error generating the report'
  },
  pdf: {
    title: 'Generated report',
    download: 'Download PDF'
  }
};
