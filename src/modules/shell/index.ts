export { AppShell } from './components/AppShell';
export { WorkspacePicker } from './components/WorkspacePicker';
export { getShellDict } from './dictionaries';
export {
  workspaces,
  defaultRoute,
  defaultWorkspace,
  firstHrefInWorkspace,
  getWorkspaceById
} from './models/workspaces.config';
export type { ShellDictionary } from './dictionaries';
export type {
  Workspace,
  NavSidebarEntry,
  NavSidebarItem,
  NavSidebarGroup
} from './models/nav.interface';
export type { WorkspaceKey, NavItemKey } from './models/nav.types';
