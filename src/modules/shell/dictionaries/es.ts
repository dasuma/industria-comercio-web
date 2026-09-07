import type { NavItemKey, WorkspaceKey } from '../models/nav.types';

const itemDescriptionsEs: Partial<Record<NavItemKey, string>> = {
  clients: 'Personas y empresas responsables del impuesto.',
  establishments: 'Locales y sedes asociados a cada contribuyente.',
  invoices: 'Liquidaciones generadas y su estado de pago.',
  parameters: 'Valores de referencia que alimentan el cálculo del impuesto.',
  activityCategories: 'Códigos de actividad económica y su vigencia.',
  discounts: 'Descuentos por pronto pago por año gravable.',
  interestRates: 'Tasas de interés de mora por período.',
  sanctions: 'Sanciones mínimas y porcentajes por año.',
  administration: 'Usuarios del sistema e importación de datos.',
  users: 'Acceso al sistema y roles.',
  migrations: 'Importación de datos históricos desde archivos DBF.'
};

export const shellDictEs = {
  workspaces: {
    pradma: 'Industria y Comercio'
  } satisfies Record<WorkspaceKey, string>,
  descriptions: {
    pradma: 'Gestión del impuesto de Industria y Comercio.'
  } satisfies Record<WorkspaceKey, string>,
  items: {
    clients: 'Contribuyentes',
    establishments: 'Establecimientos',
    activityCategories: 'Actividades económicas',
    users: 'Usuarios',
    migrations: 'Migraciones',
    invoices: 'Liquidaciones',
    sanctions: 'Sanciones',
    interestRates: 'Tasas de interés',
    discounts: 'Descuentos',
    parameters: 'Parámetros',
    administration: 'Administración'
  } satisfies Record<NavItemKey, string>,
  itemDescriptions: itemDescriptionsEs,
  subTabs: {} satisfies Record<never, string>,
  switchSection: 'Cambiar sección',
  picker: {
    title: 'Industria y Comercio',
    comingSoon: 'Próximamente',
    inspirations: [
      'que sea un gran día',
      'vamos con todo hoy',
      'hoy se construye lo importante',
      'un paso más cerca de la meta',
      'hagamos que cuente',
      'el momento es ahora',
      'manos a la obra',
      'el futuro empieza acá'
    ]
  },
  user: {
    fallbackName: 'Mi cuenta',
    logout: 'Cerrar sesión',
    signingOut: 'Cerrando sesión...',
    themeLight: 'Cambiar a modo claro',
    themeDark: 'Cambiar a modo oscuro'
  },
  actions: {
    sidebarCollapse: 'Reducir navegación',
    sidebarExpand: 'Expandir navegación',
    openNav: 'Abrir navegación',
    closeNav: 'Cerrar navegación',
    newTab: 'Nueva pestaña',
    closeTab: 'Cerrar pestaña'
  }
};

export type ShellDictionary = typeof shellDictEs;
