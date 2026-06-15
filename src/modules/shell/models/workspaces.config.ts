import {
  RiBuildingLine,
  RiBuilding4Line,
  RiBuilding4Fill,
  RiFileListLine,
  RiGroupLine,
  RiPriceTag3Line,
  RiStackLine,
  RiUploadCloud2Line,
  RiUserLine
} from '@biaenergy/ui/icons';
import { APP_ROUTES, DEFAULT_AUTHED_ROUTE } from '@/config/routes';
import type { NavItemKey, WorkspaceKey } from './nav.types';
import type { NavSidebarItem, Workspace } from './nav.interface';

export const workspaces: Workspace[] = [
  {
    id: 'pradma',
    iconFill: RiBuilding4Fill,
    iconLine: RiBuilding4Line,
    items: [
      { kind: 'item', key: 'clients', href: APP_ROUTES.clients, icon: RiGroupLine },
      {
        kind: 'item',
        key: 'establishments',
        href: APP_ROUTES.establishments,
        icon: RiBuildingLine
      },
      {
        kind: 'item',
        key: 'establishmentActivities',
        href: APP_ROUTES.establishmentActivities,
        icon: RiFileListLine
      },
      {
        kind: 'item',
        key: 'activityTypes',
        href: APP_ROUTES.activityTypes,
        icon: RiPriceTag3Line
      },
      {
        kind: 'item',
        key: 'activityCategories',
        href: APP_ROUTES.activityCategories,
        icon: RiStackLine
      },
      { kind: 'item', key: 'users', href: APP_ROUTES.users, icon: RiUserLine },
      {
        kind: 'item',
        key: 'migrations',
        href: APP_ROUTES.migrations,
        icon: RiUploadCloud2Line
      }
    ]
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
  if (first.kind === 'item') return first.subTabs?.[0]?.href ?? first.href;
  return first.items[0]?.href ?? DEFAULT_AUTHED_ROUTE;
};

export const defaultWorkspace: Workspace =
  workspaces.find(workspace =>
    workspace.items.some(entry => {
      if (entry.kind === 'item') return DEFAULT_AUTHED_ROUTE.startsWith(entry.href);
      return entry.items.some(child => DEFAULT_AUTHED_ROUTE.startsWith(child.href));
    })
  ) ?? workspaces[0]!;
export const defaultRoute = DEFAULT_AUTHED_ROUTE;

export interface NavMatch {
  workspace: Workspace;
  itemKey: NavItemKey;
  groupKey?: NavItemKey;
}

export const findNavMatch = (href: string): NavMatch | undefined => {
  for (const workspace of workspaces) {
    for (const entry of workspace.items) {
      if (entry.kind === 'item') {
        const item = entry as NavSidebarItem;
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
