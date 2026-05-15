import type { ElementType } from 'react';
import type { NavItemKey, NavSubTabKey, WorkspaceKey } from './nav.types';

export type NavIcon = ElementType;

export interface NavSidebarItemSubTab {
  key: NavSubTabKey;
  href: string;
}

export interface NavSidebarItem {
  kind: 'item';
  key: NavItemKey;
  href: string;
  icon: NavIcon;
  /** Optional sub-tabs that live inside this item (e.g. the top tabs inside
   *  BiaNetwork). When present, the TabsStrip shows `item > subTab` instead
   *  of `workspace > item` so the user sees their exact location. */
  subTabs?: NavSidebarItemSubTab[];
}

export interface NavSidebarGroupChild {
  key: NavItemKey;
  href: string;
}

export interface NavSidebarGroup {
  kind: 'group';
  /** Unique key inside the workspace, used as the accordion identifier. */
  id: string;
  labelKey: NavItemKey;
  icon: NavIcon;
  items: NavSidebarGroupChild[];
}

export type NavSidebarEntry = NavSidebarItem | NavSidebarGroup;

export interface Workspace {
  id: WorkspaceKey;
  iconFill: NavIcon;
  iconLine: NavIcon;
  items: NavSidebarEntry[];
}
