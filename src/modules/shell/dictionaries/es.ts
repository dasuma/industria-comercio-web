import type { NavItemKey, WorkspaceKey } from '../models/nav.types';

const itemDescriptionsEs: Partial<Record<NavItemKey, string>> = {};

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
    invoices: 'Liquidaciones'
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
  search: {
    placeholder: 'Buscar…',
    shortcut: '⌘K',
    label: 'Buscar'
  },
  user: {
    fallbackName: 'Mi cuenta',
    companySettings: 'Settings de empresa',
    myAccount: 'Mi cuenta',
    preferences: 'Preferencias',
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
    back: 'Atrás',
    forward: 'Adelante',
    history: 'Historial',
    aiAssistant: 'Asistente AI',
    newTab: 'Nueva pestaña',
    closeTab: 'Cerrar pestaña'
  }
};

export type ShellDictionary = typeof shellDictEs;
