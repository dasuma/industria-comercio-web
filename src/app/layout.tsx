import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import { Toaster } from '@biaenergy/ui';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { DataAccessProvider } from '@/data/core';
import { SessionProvider } from '@/auth/SessionProvider';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Pradma — Industria y Comercio',
  description: 'Sistema de gestión de Industria y Comercio',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/pradma-logo.png'
  }
};

// Spanish-first: ignoramos accept-language del browser. Solo respetamos la
// cookie NEXT_LOCALE si está seteada explícitamente.
const resolveLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get('NEXT_LOCALE')?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;
  return defaultLocale;
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await resolveLocale();
  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <DataAccessProvider>
            <SessionProvider>{children}</SessionProvider>
          </DataAccessProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
