import type { NavItemKey, NavSubTabKey, WorkspaceKey } from '../models/nav.types';

// Override opcional de la descripción del PageHeader por item. Si no hay
// entrada, se usa `descriptions[workspace]`. Tipado como Partial para que
// PageHeader pueda hacer lookup con cualquier `NavItemKey` y caer al
// fallback cuando no haya override.
const itemDescriptionsEs: Partial<Record<NavItemKey, string>> = {
  cgmAnalysis: 'Análisis, informes y reportes de consumo de nuestros clientes.'
};

export const shellDictEs = {
  workspaces: {
    operations: 'Operaciones',
    growth: 'Adquisición',
    energy: 'Energía',
    finance: 'Finanzas',
    retention: 'Retención'
  } satisfies Record<WorkspaceKey, string>,
  descriptions: {
    operations: 'Operación diaria del sistema: monitoreo, control y gestión.',
    growth: 'Gestión de Bia Networkers',
    energy: 'Sección en construcción — próximamente disponible.',
    finance: 'Sección en construcción — próximamente disponible.',
    retention: 'Sección en construcción — próximamente disponible.'
  } satisfies Record<WorkspaceKey, string>,
  items: {
    cgm: 'CGM',
    cgmReport: 'Reporte CGM',
    cgmAnalysis: 'Análisis',
    supply: 'Supply',
    bianetwork: 'Bia Network',
    energy: 'Energía',
    finance: 'Finanzas',
    retention: 'Retención',
    retentionContracts: 'Contratos'
  } satisfies Record<NavItemKey, string>,
  itemDescriptions: itemDescriptionsEs,
  subTabs: {
    users: 'Usuarios',
    usersPro: 'Usuarios Pro',
    accounts: 'Cuentas',
    transactions: 'Transacciones',
    invoices: 'Facturas',
    contracts: 'Contratos'
  } satisfies Record<NavSubTabKey, string>,
  switchSection: 'Cambiar sección',
  picker: {
    title: '¿En qué equipo\ntrabajamos hoy?',
    comingSoon: 'Próximamente',
    // Frases que se concatenan después del nombre — "FNAME, {frase}". Se
    // elige una al azar al montar el picker. Mantenelas en minúscula y
    // sin punto final: el nombre + coma ya inician la oración, y la
    // ausencia de punto las hace sentir conversacionales.
    inspirations: [
      'que sea un gran día',
      'vamos con todo hoy',
      'todo está por hacerse',
      'hoy se construye lo importante',
      'un paso más cerca de la meta',
      'tu energía marca la diferencia',
      'hagamos que cuente',
      'el momento es ahora',
      'el progreso empieza con un click',
      'cada decisión te acerca',
      'lo mejor está por venir',
      'el equipo te necesita',
      'que el día rinda',
      'construyamos algo grande',
      'todo empieza con el primer paso',
      'tu enfoque crea impacto',
      'manos a la obra',
      'que las ideas fluyan',
      'hoy se decide algo bueno',
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
