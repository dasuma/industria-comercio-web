'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    {children}
  </NextThemeProvider>
);
