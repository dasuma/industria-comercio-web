'use client';

import { type MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import { Badge, CompactButton, Dropdown, Table, Tooltip } from '@biaenergy/ui';
import {
  RiArrowDownLine,
  RiArrowUpCircleLine,
  RiArrowUpLine,
  RiExpandUpDownLine,
  RiMore2Line
} from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { formatNumericDate } from '@/utils/format';
import type { BianetworkDictionary } from '../../dictionaries';
import { STATUS_BADGE_COLOR, USER_TIER } from '../../models/shared';
import type { BiaNetworkUser } from '../../models/user';

type SortDirection = 'asc' | 'desc' | null;
type ColumnKey = 'id' | 'date' | 'name' | 'email' | 'document' | 'type' | 'status' | 'action';

interface ColumnDef {
  key: ColumnKey;
  width: number;
  sortable: boolean;
  align?: 'left' | 'right';
}

const COLUMNS: ColumnDef[] = [
  { key: 'action', width: 40, sortable: false },
  { key: 'id', width: 110, sortable: true },
  { key: 'date', width: 120, sortable: true },
  { key: 'name', width: 150, sortable: true },
  { key: 'email', width: 200, sortable: true },
  { key: 'document', width: 140, sortable: true },
  { key: 'type', width: 110, sortable: true },
  { key: 'status', width: 150, sortable: true }
];

const MIN_COLUMN_WIDTH = 80;

// Texto plano por columna — usado para sort y para el tooltip (full content
// cuando hay truncate). El render visual puede ser más rich (ej: status con dot).
const sortValueOf = (
  user: BiaNetworkUser,
  key: ColumnKey,
  dict: BianetworkDictionary['users']
): string => {
  switch (key) {
    case 'id':
      return user.id;
    case 'date':
      return user.termsAcceptedDate ?? '';
    case 'name':
      return user.fullName ?? '';
    case 'email':
      return user.email ?? '';
    case 'document':
      return user.documentNumber ?? '';
    case 'type':
      return dict.person_type_labels[user.type] ?? '';
    case 'status':
      return dict.status_labels[user.status] ?? '';
    default:
      return '';
  }
};

interface UsersTableProps {
  data: BiaNetworkUser[];
  loading: boolean;
  onRowClick?: (user: BiaNetworkUser) => void;
  onUpgradeToPro?: (user: BiaNetworkUser) => void;
  dict: BianetworkDictionary['users'];
  // Cuando está activo, la tabla ocupa el 100% del contenedor (sin scroll
  // horizontal): los anchos de columna se distribuyen como porcentajes y el
  // contenido que no entra trunca con ellipsis (ya provisto por TruncatedCell).
  compact?: boolean;
}

// Celda con tooltip — el span trunca con ellipsis y el Tooltip muestra el
// contenido completo al hover. Activamos el tooltip siempre (no detectamos
// truncation runtime) — si el contenido no overflowea, el tooltip simplemente
// repite lo visible, costo cero visual.
const TruncatedCell = ({
  full,
  children,
  className
}: {
  full: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <span className={cn('block min-w-0 truncate', className)}>{children ?? full}</span>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">{full}</Tooltip.Content>
  </Tooltip.Root>
);

// Hook de resize columns. Registra un mousedown en el handle, captura la
// posición inicial y la width inicial, y en mousemove actualiza la width.
const useColumnResize = (initial: Record<ColumnKey, number>) => {
  const [widths, setWidths] = useState<Record<ColumnKey, number>>(initial);
  const draggingRef = useRef<{ key: ColumnKey; startX: number; startW: number } | null>(null);

  const startResize = useCallback(
    (key: ColumnKey, event: MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
      draggingRef.current = {
        key,
        startX: event.clientX,
        startW: widths[key]
      };
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      const handleMove = (e: globalThis.MouseEvent): void => {
        const drag = draggingRef.current;
        if (!drag) return;
        const delta = e.clientX - drag.startX;
        const next = Math.max(MIN_COLUMN_WIDTH, drag.startW + delta);
        setWidths(prev => ({ ...prev, [drag.key]: next }));
      };
      const handleUp = (): void => {
        draggingRef.current = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [widths]
  );

  return { widths, startResize };
};

export const UsersTable = ({
  data,
  loading,
  onRowClick,
  onUpgradeToPro,
  dict,
  compact = false
}: UsersTableProps) => {
  const initialWidths = useMemo(
    () => Object.fromEntries(COLUMNS.map(c => [c.key, c.width])) as Record<ColumnKey, number>,
    []
  );
  const { widths, startResize } = useColumnResize(initialWidths);

  const [sort, setSort] = useState<{ key: ColumnKey; dir: Exclude<SortDirection, null> } | null>(
    null
  );

  // Sort cycle: null → asc → desc → null. Click consecutivo en otra column
  // resetea a 'asc'.
  const handleSortClick = useCallback((key: ColumnKey) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sort) return data;
    const sorted = [...data].sort((a, b) => {
      const av = sortValueOf(a, sort.key, dict);
      const bv = sortValueOf(b, sort.key, dict);
      const cmp = av.localeCompare(bv, 'es', { numeric: true, sensitivity: 'base' });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [data, sort, dict]);

  const totalWidth = useMemo(() => Object.values(widths).reduce((acc, w) => acc + w, 0), [widths]);

  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-bg-weak-50 h-12 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="border-stroke-soft-200 text-text-sub-600 rounded-lg border p-6 text-center">
        {dict.empty}
      </p>
    );
  }

  const visibleColumns = COLUMNS.filter(c => c.key !== 'action' || onUpgradeToPro);

  // En modo compacto, las anchuras pixel se reproyectan a porcentajes del total
  // de las columnas visibles → la tabla rellena el contenedor (sin minWidth) y
  // cada col mantiene su proporción relativa, con ellipsis donde no quepa.
  const visibleTotalWidth = visibleColumns.reduce((acc, c) => acc + widths[c.key], 0);
  const colStyleFor = (key: ColumnKey) =>
    compact ? { width: `${(widths[key] / visibleTotalWidth) * 100}%` } : { width: widths[key] };
  const tableStyle = compact
    ? { tableLayout: 'fixed' as const, width: '100%' }
    : { tableLayout: 'fixed' as const, minWidth: totalWidth };

  return (
    <Table.Root style={tableStyle}>
      <colgroup>
        {visibleColumns.map(col => (
          <col key={col.key} style={colStyleFor(col.key)} />
        ))}
      </colgroup>
      <Table.Header>
        <Table.Row>
          {visibleColumns.map(col => {
            const isSorted = sort?.key === col.key;
            const SortIcon = !col.sortable
              ? null
              : isSorted
                ? sort.dir === 'asc'
                  ? RiArrowUpLine
                  : RiArrowDownLine
                : RiExpandUpDownLine;
            return (
              <Table.Head
                key={col.key}
                className={cn(
                  'group/th relative',
                  // La columna `action` solo lleva un CompactButton (size-5 =
                  // 20px), no necesita el px-3 (24px total) default del Cell.
                  // Bajamos a !px-2 (16px total) para que el width 40 alcance.
                  // text-center alinea el botón horizontalmente al medio.
                  col.key === 'action' && '!px-2 text-center'
                )}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSortClick(col.key)}
                    className={cn(
                      'group/sort hover:text-text-strong-950 -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors duration-150 outline-none',
                      'focus-visible:ring-stroke-soft-200 focus-visible:ring-2'
                    )}
                  >
                    <span>{dict.columns[col.key]}</span>
                    {SortIcon && (
                      <SortIcon
                        className={cn(
                          'size-4 shrink-0 transition-opacity duration-150',
                          isSorted ? 'opacity-100' : 'opacity-40 group-hover/sort:opacity-70'
                        )}
                      />
                    )}
                  </button>
                ) : col.key === 'action' ? (
                  // Columna de acciones (botón "..." → dropdown). El header no
                  // lleva label visible porque el icono ya comunica la función;
                  // sr-only para que screen readers la anuncien.
                  <span className="sr-only">{dict.columns.action}</span>
                ) : (
                  dict.columns[col.key]
                )}
                {/* Resize handle: barra de 4px en el borde derecho del th. Se
                    activa solo al hover; al drag, expande la columna. La última
                    columna NO lleva handle (no hay siguiente para empujar). En
                    modo compacto se desactiva (las cols ya son %, no px). */}
                {col.key !== 'action' && !compact && (
                  <span
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Redimensionar columna"
                    onMouseDown={e => startResize(col.key, e)}
                    className={cn(
                      'absolute top-0 -right-px z-10 h-full w-1 cursor-col-resize',
                      'hover:bg-stroke-soft-200 active:bg-primary-base transition-colors duration-150'
                    )}
                  />
                )}
              </Table.Head>
            );
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.map(user => {
          const canUpgrade =
            Boolean(onUpgradeToPro) && user.tierType?.toLowerCase() === USER_TIER.NORMAL;
          // Si no hay acciones disponibles, no renderizamos el botón ni el
          // dropdown — solo `—`. Evita un dropdown vacío y comunica visualmente
          // "no hay nada que hacer acá" sin meter ruido.
          const hasActions = canUpgrade;
          return (
            <Table.Row
              key={user.id}
              onClick={onRowClick ? () => onRowClick(user) : undefined}
              className={onRowClick ? 'hover:bg-bg-weak-50 cursor-pointer' : undefined}
            >
              {onUpgradeToPro && (
                <Table.Cell className="!px-2 text-center">
                  {hasActions ? (
                    <Dropdown.Root>
                      <Dropdown.Trigger asChild>
                        <CompactButton.Root
                          variant="ghost"
                          size="medium"
                          aria-label={dict.upgrade_to_pro}
                          onClick={(event: MouseEvent<HTMLButtonElement>) =>
                            event.stopPropagation()
                          }
                          // Patch — el focus-visible default del CompactButton
                          // invierte bg/text (bg-strong-950 + text-white-0) lo
                          // que se siente "stuck selected" cuando Radix devuelve
                          // focus al trigger tras click-outside-to-close. Forzamos
                          // el visual del hover. Removible cuando publishen el
                          // fix del DS (PR biaenergy/design-system#51).
                          // mx-auto centra horizontalmente el botón en el cell
                          // (CompactButton es display:flex, no respeta
                          // text-align del Cell).
                          className="focus-visible:!bg-bg-weak-50 focus-visible:!text-text-strong-950 focus-visible:!ring-stroke-soft-200 mx-auto focus-visible:!ring-1 focus-visible:!ring-inset"
                        >
                          <CompactButton.Icon as={RiMore2Line} />
                        </CompactButton.Root>
                      </Dropdown.Trigger>
                      <Dropdown.Content
                        align="start"
                        sideOffset={4}
                        // Stop propagation a nivel del Content: el portal de
                        // Radix saca el menú del DOM tree, pero los eventos
                        // sintéticos de React siguen burbujeando hasta el
                        // parent React (la <Table.Row>). Sin esto, click en
                        // un Item dispara el onRowClick (abre detail modal).
                        onClick={(e: MouseEvent) => e.stopPropagation()}
                      >
                        {canUpgrade && (
                          <Dropdown.Item onSelect={() => onUpgradeToPro!(user)}>
                            <Dropdown.ItemIcon as={RiArrowUpCircleLine} />
                            {dict.upgrade_to_pro}
                          </Dropdown.Item>
                        )}
                      </Dropdown.Content>
                    </Dropdown.Root>
                  ) : (
                    <span className="text-text-soft-400">—</span>
                  )}
                </Table.Cell>
              )}
              <Table.Cell className="text-text-sub-600">
                <TruncatedCell full={user.id}>{user.id.slice(0, 8)}…</TruncatedCell>
              </Table.Cell>
              <Table.Cell>
                <TruncatedCell full={formatNumericDate(user.termsAcceptedDate)} />
              </Table.Cell>
              <Table.Cell className="text-text-strong-950 font-medium">
                <TruncatedCell full={user.fullName || '-'} />
              </Table.Cell>
              <Table.Cell>
                <TruncatedCell full={user.email} />
              </Table.Cell>
              <Table.Cell>
                <TruncatedCell full={user.documentNumber} />
              </Table.Cell>
              <Table.Cell>
                <TruncatedCell full={dict.person_type_labels[user.type]} />
              </Table.Cell>
              <Table.Cell>
                <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[user.status]}>
                  {dict.status_labels[user.status]}
                </Badge.Root>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
