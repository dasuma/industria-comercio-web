export type WorkspaceKey = 'operations' | 'growth' | 'energy' | 'finance' | 'retention' | 'airport';
export type NavItemKey =
  | 'cgm'
  | 'cgmReport'
  | 'cgmRefill'
  | 'cgmAnalysis'
  | 'supply'
  | 'pedidos'
  | 'proveedores'
  | 'bianetwork'
  | 'energy'
  | 'finance'
  | 'retention'
  | 'airport';
// Sub-tabs anidados dentro de un item del sidebar (ej. los tabs internos de
// BiaNetwork: Usuarios, Usuarios Pro, etc.). Tienen su propio namespace de
// claves para que el TabsStrip pueda mostrar el último nivel jerárquico
// (item > subTab) en el label.
export type NavSubTabKey = 'users' | 'usersPro' | 'accounts' | 'transactions' | 'invoices';
