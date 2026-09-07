import type { KeyboardEvent } from 'react';

// Props para que una fila de tabla "clickeable" también sea operable por
// teclado y tenga affordance visual de hover/foco. Se hace spread sobre
// `<Table.Row {...clickableRowProps(fn)}>`.
export const clickableRowProps = (onActivate: () => void) => ({
  role: 'button' as const,
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  },
  className:
    'hover:bg-bg-weak-50 focus-visible:bg-bg-weak-50 cursor-pointer outline-none transition-colors'
});
