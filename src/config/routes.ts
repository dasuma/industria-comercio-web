export const PUBLIC_ROUTES = {
  login: '/'
} as const;

export const APP_ROUTES = {
  clients: '/pradma/clients',
  establishments: '/pradma/establishments',
  activityCategories: '/pradma/activity-categories',
  users: '/pradma/users',
  migrations: '/pradma/migrations'
} as const;

export const DEFAULT_AUTHED_ROUTE: string = APP_ROUTES.clients;
