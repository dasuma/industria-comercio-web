import type { CgmReportDictionary } from './es';

export const cgmReportDictEn: CgmReportDictionary = {
  title: 'CGM Reports',
  createReport: 'Report',
  filterAll: 'All',
  filterTypeLabel: 'Type',
  filterKindLabel: 'Kind',
  filterTypePlaceholder: 'Report type',
  filterKindPlaceholder: 'Report kind',
  reportTypes: {
    DAILY: 'Daily',
    MONTHLY: 'Monthly'
  },
  reportKinds: {
    DEFAULT: 'Default',
    COMMERCIALIZATION: 'Commercialization',
    COMMERCIALIZATION_BACKUP: 'Commercialization Backup',
    AGPE: 'AGPE',
    AGPE_BACKUP: 'AGPE Backup'
  },
  reportStatus: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    NOTIFIED: 'Notified'
  },
  columns: {
    id: 'ID',
    reportDate: 'Report date',
    createdAt: 'Sent at',
    type: 'Type',
    kind: 'Kind',
    status: 'Status',
    contracts: 'Contracts',
    download: 'Download'
  },
  modal: {
    title: 'Create new report',
    description: 'The report will be processed asynchronously. Check the list for results.',
    contractIdsLabel: 'Contract IDs',
    contractIdsPlaceholder: 'e.g. 101, 102, 103',
    contractIdsHint: 'Enter IDs separated by commas.',
    typeLabel: 'Report type',
    typePlaceholder: 'Select a type',
    kindLabel: 'Kind',
    kindPlaceholder: 'Select a kind',
    dateLabel: 'Date',
    submit: 'Create',
    cancel: 'Cancel',
    success: 'Report processing started',
    error: 'Error creating report'
  },
  pagination: {
    previous: 'Previous',
    next: 'Next'
  },
  compactMode: 'Compact mode',
  empty: 'No reports available'
};
