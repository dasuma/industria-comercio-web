import type { RetentionDictionary } from './es';

export const retentionDictEn: RetentionDictionary = {
  tabs: {
    contracts: 'Contracts'
  },
  contracts: {
    search: {
      title: 'Contracts',
      placeholder: 'Select a contract to view its details'
    },
    detail: {
      tabs: {
        basics: 'Basic data',
        company: 'Company',
        technical: 'Technical data',
        contractRates: 'Contract Rates',
        recs: 'RECs',
        vas: 'VAs',
        users: 'Users'
      },
      sections: {
        contract: 'Contract',
        admin: 'Administrator',
        company: 'Company',
        technical: 'Technical data',
        users: 'Users'
      },
      fields: {
        id: 'ID',
        address: 'Address',
        city: 'City',
        country: 'Country',
        niu: 'NIU',
        sui: 'SUI',
        sic: 'SIC',
        source: 'Source',
        startsAt: 'Start date',
        internalCode: 'BIA Code',
        isCurrent: 'Active',
        isCommercial: 'Commercial',
        isUrban: 'Urban',
        documentType: 'Doc. type',
        documentNumber: 'Document',
        email: 'Email',
        phone: 'Phone',
        name: 'Name',
        status: 'Status',
        meterId: 'Meter',
        meterIntegrated: 'Integrated',
        meterRealtime: 'Real-time',
        tensionLevel: 'Tension level',
        nominalVoltage: 'Nominal voltage',
        phaseCount: 'Phases',
        timezone: 'Timezone',
        factorCurrent: 'Current factor',
        factorEnergy: 'Energy factor',
        factorPower: 'Power factor',
        factorVoltage: 'Voltage factor',
        solarCapacity: 'Solar capacity',
        hasRenewable: 'Renewable',
        consumptionAverage: 'Avg. consumption',
        lastMarketer: 'Last marketer',
        withReactiveCharges: 'Reactive charges',
        serviceCut: 'Service cut',
        role: 'Role',
        billingEmail: 'Billing'
      },
      yes: 'Yes',
      no: 'No',
      recs: {
        id: 'ID',
        recValue: 'REC value',
        startDate: 'Start',
        endDate: 'End',
        userId: 'User',
        createdAt: 'Created',
        empty: 'No RECs for this contract'
      },
      edit: 'Edit',
      save: 'Save',
      saving: 'Saving…',
      cancel: 'Cancel',
      saveSuccess: 'Contract updated',
      saveError: 'Error saving contract'
    }
  }
};
