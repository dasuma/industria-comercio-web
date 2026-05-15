'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Avatar, Dropdown } from '@biaenergy/ui';
import {
  RiBuilding4Line,
  RiExpandUpDownLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiSettings3Line,
  RiSunLine,
  RiUserLine
} from '@biaenergy/ui/icons';
import { useAuth } from '@/auth/useAuth';
import { usePersistedUserAvatar } from '@/auth/usePersistedUserAvatar';
import { useLogout } from '@modules/auth';
import { cn } from '@/utils/cn';
import type { ShellDictionary } from '../../dictionaries';
import { selectSidebarCollapsed, useShellUiStore } from '../../store/ui.store';

interface UserMenuProps {
  dict: ShellDictionary['user'];
}

const getInitials = (name: string | null | undefined, email: string | null | undefined): string => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    return (first + last).toUpperCase() || (email?.[0] ?? '?').toUpperCase();
  }
  return (email?.[0] ?? '?').toUpperCase();
};

interface UserAvatarProps {
  photoURL: string | null;
  initials: string;
  alt: string;
}

// Sub-componente: cuando el `<img>` falla en cargar (cache roto, URL
// caducada de Google CDN) lo retrata como fallback de iniciales. Sin esto
// el Avatar Root mostraba el broken-image icon del browser superpuesto a
// los children.
const UserAvatar = ({ photoURL, initials, alt }: UserAvatarProps) => {
  const [failed, setFailed] = useState(false);
  const [trackedSrc, setTrackedSrc] = useState(photoURL);
  if (trackedSrc !== photoURL) {
    setTrackedSrc(photoURL);
    setFailed(false);
  }
  const showImage = !!photoURL && !failed;
  return (
    <Avatar.Root size="32" color="blue" className="shrink-0">
      {showImage ? (
        <Avatar.Image src={photoURL} alt={alt} onError={() => setFailed(true)} />
      ) : (
        initials
      )}
    </Avatar.Root>
  );
};

const getOrganizationFromEmail = (email: string | null | undefined): string => {
  if (!email) return '';
  const [, domain] = email.split('@');
  if (!domain) return '';
  const [name] = domain.split('.');
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
};

export const UserMenu = ({ dict }: UserMenuProps) => {
  const { user } = useAuth();
  const { logout, isLoading } = useLogout();
  const collapsed = useShellUiStore(selectSidebarCollapsed);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const persistedPhotoURL = usePersistedUserAvatar(user?.uid, user?.photoURL);

  if (!user) return null;

  const displayName = user.displayName ?? user.email ?? dict.fallbackName;
  const initials = getInitials(user.displayName, user.email);
  const organization = getOrganizationFromEmail(user.email);
  const themeAriaLabel = isDark ? dict.themeLight : dict.themeDark;

  return (
    <div className="shrink-0 px-1.5 pt-2 pb-3">
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <button
            type="button"
            aria-label={dict.fallbackName}
            className="group focus-visible:ring-stroke-strong-950 dark:hover:bg-bg-white-0/60 flex h-14 w-full cursor-pointer items-center gap-2 rounded-lg px-1 transition outline-none hover:bg-neutral-200/70 focus-visible:ring-2"
          >
            <UserAvatar photoURL={persistedPhotoURL} initials={initials} alt={displayName} />
            <span
              className={cn(
                'flex min-w-0 flex-1 flex-col items-start text-left transition-opacity duration-200',
                collapsed ? 'opacity-0' : 'opacity-100'
              )}
            >
              <span className="text-label-sm text-text-strong-950 truncate font-medium">
                {displayName}
              </span>
              {organization && (
                <span className="text-paragraph-xs text-text-sub-600 truncate">{organization}</span>
              )}
            </span>
            <span
              className={cn(
                'ring-stroke-soft-200 group-hover:bg-bg-white-0 flex size-6 shrink-0 items-center justify-center rounded-md ring-1 transition-[opacity,background] duration-200',
                collapsed ? 'opacity-0' : 'opacity-100'
              )}
              aria-hidden
            >
              <RiExpandUpDownLine className="text-text-soft-400 size-3.5" />
            </span>
          </button>
        </Dropdown.Trigger>

        <Dropdown.Content side="top" align="start" sideOffset={8} className="min-w-[280px] p-1.5">
          <div className="flex items-center gap-2 px-2 py-3">
            <UserAvatar photoURL={persistedPhotoURL} initials={initials} alt={displayName} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-label-sm text-text-strong-950 truncate font-medium">
                {displayName}
              </span>
              {user.email && (
                <span className="text-paragraph-xs text-text-sub-600 truncate">{user.email}</span>
              )}
            </div>
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                setTheme(isDark ? 'light' : 'dark');
              }}
              onPointerDown={event => event.stopPropagation()}
              aria-label={themeAriaLabel}
              className="text-text-sub-600 hover:text-text-strong-950 focus-visible:ring-stroke-strong-950 dark:hover:bg-bg-white-0/60 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition outline-none hover:bg-neutral-200/70 focus-visible:ring-2"
            >
              <span className="bia-icon-swap" data-state={isDark ? 'b' : 'a'}>
                <span className="bia-icon-swap-item" data-icon="a">
                  <RiMoonLine className="size-[18px]" />
                </span>
                <span className="bia-icon-swap-item" data-icon="b">
                  <RiSunLine className="size-[18px]" />
                </span>
              </span>
            </button>
          </div>

          <Dropdown.Separator />

          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={RiBuilding4Line} />
            {dict.companySettings}
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={RiUserLine} />
            {dict.myAccount}
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={RiSettings3Line} />
            {dict.preferences}
          </Dropdown.Item>

          <Dropdown.Separator />

          <Dropdown.Item disabled={isLoading} onSelect={() => void logout()}>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            {isLoading ? dict.signingOut : dict.logout}
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
};
