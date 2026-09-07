import type { ShellDictionary } from './es';

export const shellDictEn: ShellDictionary = {
  workspaces: {
    pradma: 'Industry & Commerce'
  },
  descriptions: {
    pradma: 'Industry and Commerce tax management.'
  },
  items: {
    clients: 'Taxpayers',
    establishments: 'Establishments',
    activityCategories: 'Economic activities',
    users: 'Users',
    migrations: 'Migrations',
    invoices: 'Settlements',
    sanctions: 'Sanctions',
    interestRates: 'Interest Rates',
    discounts: 'Discounts',
    parameters: 'Parameters',
    administration: 'Administration'
  },
  itemDescriptions: {
    clients: 'People and companies liable for the tax.',
    establishments: 'Premises and branches linked to each taxpayer.',
    invoices: 'Generated settlements and their payment status.',
    parameters: 'Reference values that feed the tax calculation.',
    activityCategories: 'Economic activity codes and their validity.',
    discounts: 'Early-payment discounts per tax year.',
    interestRates: 'Late-payment interest rates per period.',
    sanctions: 'Minimum sanctions and percentages per year.',
    administration: 'System users and data imports.',
    users: 'System access and roles.',
    migrations: 'Historical data import from DBF files.'
  },
  subTabs: {},
  switchSection: 'Change section',
  picker: {
    title: 'Industry & Commerce',
    comingSoon: 'Coming soon',
    inspirations: [
      "let's make today count",
      'great work starts here',
      'one step closer to the goal',
      'the moment is now',
      "let's ship it",
      "let's build something great",
      'progress starts with a click',
      "let's keep moving"
    ]
  },
  user: {
    fallbackName: 'My account',
    logout: 'Sign out',
    signingOut: 'Signing out...',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode'
  },
  actions: {
    sidebarCollapse: 'Collapse navigation',
    sidebarExpand: 'Expand navigation',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    newTab: 'New tab',
    closeTab: 'Close tab'
  }
};
