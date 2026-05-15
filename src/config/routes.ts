export const PUBLIC_ROUTES = {
  login: '/'
} as const;

export const APP_ROUTES = {
  cgm: '/operations/cgm',
  cgmReport: '/operations/cgm/report',
  cgmRefill: '/operations/cgm/refill',
  cgmAnalysis: '/operations/cgm/analysis',
  supplyPedidos: '/operations/supply/orders',
  supplyProveedores: '/operations/supply/suppliers',
  bianetwork: '/acquisition/bianetwork',
  users: '/acquisition/bianetwork/users',
  usersPro: '/acquisition/bianetwork/users-pro',
  accounts: '/acquisition/bianetwork/accounts',
  transactions: '/acquisition/bianetwork/transactions',
  invoices: '/acquisition/bianetwork/invoices',
  energy: '/energy',
  finance: '/finance',
  retention: '/retention',
  airport: '/airport'
} as const;

export const DEFAULT_AUTHED_ROUTE: string = APP_ROUTES.cgmReport;
