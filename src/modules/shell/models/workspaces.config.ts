import {
  RiCoinsFill,
  RiCoinsLine,
  RiCustomerService2Fill,
  RiCustomerService2Line,
  RiFlashlightFill,
  RiFlashlightLine,
  RiLineChartFill,
  RiLineChartLine,
  RiNetworkLine,
  RiPulseLine,
  RiTargetFill,
  RiTargetLine,
  RiTruckLine,
  RiToolsFill,
  RiToolsLine
} from '@biaenergy/ui/icons';
import { APP_ROUTES, DEFAULT_AUTHED_ROUTE } from '@/config/routes';
import type { NavItemKey, NavSubTabKey, WorkspaceKey } from './nav.types';
import type { NavSidebarItem, Workspace } from './nav.interface';

export const workspaces: Workspace[] = [
  {
    id: 'operations',
    iconFill: RiToolsFill,
    iconLine: RiToolsLine,
    items: [
      {
        kind: 'group',
        id: 'cgm',
        labelKey: 'cgm',
        icon: RiPulseLine,
        items: [
          { key: 'cgmReport', href: APP_ROUTES.cgmReport },
          { key: 'cgmRefill', href: APP_ROUTES.cgmRefill },
          { key: 'cgmAnalysis', href: APP_ROUTES.cgmAnalysis }
        ]
      },
      {
        kind: 'group',
        id: 'supply',
        labelKey: 'supply',
        icon: RiTruckLine,
        items: [
          { key: 'pedidos', href: APP_ROUTES.supplyPedidos },
          { key: 'proveedores', href: APP_ROUTES.supplyProveedores }
        ]
      }
    ]
  },
  {
    id: 'growth',
    iconFill: RiLineChartFill,
    iconLine: RiLineChartLine,
    items: [
      {
        kind: 'item',
        key: 'bianetwork',
        href: APP_ROUTES.bianetwork,
        icon: RiNetworkLine,
        subTabs: [
          { key: 'users', href: APP_ROUTES.users },
          { key: 'usersPro', href: APP_ROUTES.usersPro },
          { key: 'accounts', href: APP_ROUTES.accounts },
          { key: 'transactions', href: APP_ROUTES.transactions },
          { key: 'invoices', href: APP_ROUTES.invoices }
        ]
      }
    ]
  },
  // Placeholders: cada uno expone un único item que apunta a una página
  // "Próximamente". Mantenerlos como workspaces reales (no como cards
  // ficticios en el picker) hace que aparezcan en el switcher del sidebar
  // y en TabsStrip exactamente como Operaciones/Adquisición — sin código
  // especial. Cuando una sección madure, basta con agregarle items reales.
  {
    id: 'energy',
    iconFill: RiFlashlightFill,
    iconLine: RiFlashlightLine,
    items: [{ kind: 'item', key: 'energy', href: APP_ROUTES.energy, icon: RiFlashlightLine }]
  },
  {
    id: 'finance',
    iconFill: RiCoinsFill,
    iconLine: RiCoinsLine,
    items: [{ kind: 'item', key: 'finance', href: APP_ROUTES.finance, icon: RiCoinsLine }]
  },
  {
    id: 'retention',
    iconFill: RiCustomerService2Fill,
    iconLine: RiCustomerService2Line,
    items: [
      { kind: 'item', key: 'retention', href: APP_ROUTES.retention, icon: RiCustomerService2Line }
    ]
  },
  {
    id: 'airport',
    iconFill: RiTargetFill,
    iconLine: RiTargetLine,
    items: [{ kind: 'item', key: 'airport', href: APP_ROUTES.airport, icon: RiTargetLine }]
  }
];

const workspacesById = new Map<WorkspaceKey, Workspace>(workspaces.map(w => [w.id, w]));

export const getWorkspaceById = (id: WorkspaceKey): Workspace | undefined => workspacesById.get(id);

export const findWorkspaceByHref = (href: string): Workspace | undefined =>
  workspaces.find(workspace =>
    workspace.items.some(entry => {
      if (entry.kind === 'item') return href === entry.href || href.startsWith(`${entry.href}/`);
      return entry.items.some(child => href === child.href || href.startsWith(`${child.href}/`));
    })
  );

export const findItemByHref = (
  href: string
): { workspace: Workspace; href: string } | undefined => {
  for (const workspace of workspaces) {
    for (const entry of workspace.items) {
      if (entry.kind === 'item' && (href === entry.href || href.startsWith(`${entry.href}/`))) {
        return { workspace, href: entry.href };
      }
      if (entry.kind === 'group') {
        const child = entry.items.find(c => href === c.href || href.startsWith(`${c.href}/`));
        if (child) return { workspace, href: child.href };
      }
    }
  }
  return undefined;
};

export const firstHrefInWorkspace = (workspace: Workspace): string => {
  const first = workspace.items[0];
  if (!first) return DEFAULT_AUTHED_ROUTE;
  // Si el item tiene sub-tabs, navegar directo al primero — la ruta padre
  // suele tener un redirect server-side, y entrar por ahí provoca un cambio
  // de label en la tab ("Growth › BiaNetwork" → "BiaNetwork › Usuarios") que
  // dispara el text-swap en pleno mount y deja el span en estado invisible.
  if (first.kind === 'item') return first.subTabs?.[0]?.href ?? first.href;
  return first.items[0]?.href ?? DEFAULT_AUTHED_ROUTE;
};

export const defaultWorkspace: Workspace = workspaces[0]!;
export const defaultRoute = DEFAULT_AUTHED_ROUTE;

/**
 * Resolves the deepest navigation match for a pathname:
 * - If the pathname matches a sub-tab inside an item, returns
 *   `{ itemKey, subTabKey }` so the TabsStrip can label it as
 *   "<item> > <subTab>".
 * - If the pathname matches a child of a group, returns
 *   `{ itemKey: childKey, groupKey }` so the TabsStrip labels it as
 *   "<group> > <child>" (same shape as the sub-tab case — the group is
 *   the "section" the user is inside).
 * - Otherwise returns just the matched `item` so the TabsStrip falls
 *   back to "<workspace> > <item>".
 *
 * Sub-tab match wins over item match — `bianetwork` matches both `/acquisition/bianetwork`
 * and `/acquisition/bianetwork/users-pro` via startsWith, but if the latter
 * also matches a registered subTab, that's the intended deepest level.
 */
export interface NavMatch {
  workspace: Workspace;
  itemKey: NavItemKey;
  subTabKey?: NavSubTabKey;
  groupKey?: NavItemKey;
}

export const findNavMatch = (href: string): NavMatch | undefined => {
  for (const workspace of workspaces) {
    for (const entry of workspace.items) {
      if (entry.kind === 'item') {
        // Try sub-tabs first (deeper level).
        const item = entry as NavSidebarItem;
        if (item.subTabs) {
          const sub = item.subTabs.find(s => href === s.href || href.startsWith(`${s.href}/`));
          if (sub) return { workspace, itemKey: item.key, subTabKey: sub.key };
        }
        if (href === item.href || href.startsWith(`${item.href}/`)) {
          return { workspace, itemKey: item.key };
        }
      } else {
        const child = entry.items.find(c => href === c.href || href.startsWith(`${c.href}/`));
        if (child) return { workspace, itemKey: child.key, groupKey: entry.labelKey };
      }
    }
  }
  return undefined;
};
