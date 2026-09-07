'use client';

import { useId } from 'react';
import { cn } from '@/utils/cn';

interface PradmaLogoProps {
  /** Lado del cuadrado en px. El viewBox es 32×32, escala sin pérdida. */
  size?: number;
  /**
   * `navy` — tile con gradient navy propio: para superficies claras (el card
   * del login). `glass` — sin fill, solo el trazo y la P en blanco: para el
   * chrome oscuro, donde un tile navy sobre navy no se leería.
   */
  tone?: 'navy' | 'glass';
  className?: string;
}

// `useId` en vez de ids fijos: dos logos en la misma página compartirían los
// gradientes por id y el segundo pintaría con el paint del primero.
//
// El SVG va `aria-hidden`: los dos usos (login y sidebar) llevan el wordmark
// "PRADMA" como texto al lado, que es el que nombra la marca.
export const PradmaLogo = ({ size = 32, tone = 'navy', className }: PradmaLogoProps) => {
  const uid = useId().replace(/:/g, '');
  const bgId = `pradma-bg-${uid}`;
  const glowTopId = `pradma-glow-top-${uid}`;
  const glowBottomId = `pradma-glow-bottom-${uid}`;
  const isNavy = tone === 'navy';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      className={cn('shrink-0', className)}
    >
      {isNavy && (
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0a1628" />
            <stop offset="1" stopColor="#1a2d50" />
          </linearGradient>
          <radialGradient id={glowTopId} cx="8" cy="10" r="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(180,210,255,0.45)" />
            <stop offset="1" stopColor="rgba(180,210,255,0)" />
          </radialGradient>
          <radialGradient id={glowBottomId} cx="25" cy="22" r="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(180,210,255,0.35)" />
            <stop offset="1" stopColor="rgba(180,210,255,0)" />
          </radialGradient>
        </defs>
      )}

      {isNavy && (
        <>
          <rect width="32" height="32" rx="8" fill={`url(#${bgId})`} />
          <circle cx="8" cy="10" r="6" fill={`url(#${glowTopId})`} />
          <circle cx="25" cy="22" r="5" fill={`url(#${glowBottomId})`} />
        </>
      )}

      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        rx="5"
        stroke={isNavy ? 'white' : 'rgba(255,255,255,0.55)'}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M11 24V8h5.5c1.6 0 2.85.45 3.75 1.35.9.9 1.35 2.1 1.35 3.6 0 1.5-.45 2.7-1.35 3.6-.9.9-2.15 1.35-3.75 1.35H14.2V24H11z M14.2 15.1h2.1c.75 0 1.33-.22 1.73-.65.4-.43.6-1.02.6-1.75s-.2-1.3-.6-1.73c-.4-.43-.98-.65-1.73-.65H14.2v4.78z"
        fill="white"
      />
    </svg>
  );
};
