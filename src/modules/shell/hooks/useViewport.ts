'use client';

import { useEffect, useState } from 'react';

export interface ViewportState {
  isMobile: boolean;
  isCompact: boolean;
}

// Dos breakpoints distintos:
// - isMobile (< sm, 640px): la nav se vuelve drawer.
// - isCompact (< lg, 1024px): incluye el rango mobile + un rango intermedio
//   (sm..lg) donde, al entrar, auto-cerramos el sidebar (como un click
//   implícito al toggle), pero el toggle sigue visible y el usuario puede
//   reabrirlo manualmente si quiere.
export const useViewport = (): ViewportState => {
  const [state, setState] = useState<ViewportState>({ isMobile: false, isCompact: false });

  useEffect(() => {
    const mqlMobile = window.matchMedia('(max-width: 639px)');
    const mqlCompact = window.matchMedia('(max-width: 1023px)');
    const update = (): void => {
      setState({ isMobile: mqlMobile.matches, isCompact: mqlCompact.matches });
    };
    update();
    mqlMobile.addEventListener('change', update);
    mqlCompact.addEventListener('change', update);
    return () => {
      mqlMobile.removeEventListener('change', update);
      mqlCompact.removeEventListener('change', update);
    };
  }, []);

  return state;
};
