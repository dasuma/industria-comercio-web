import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import { Toaster } from '@dasuma/pradma-ui';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { DataAccessProvider } from '@/data/core';
import { getServerEnv } from '@/config/env';
import { serializePublicConfig, toPublicConfig } from '@/config/publicConfig';
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
  },
  themeColor: '#0a1628'
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
  // Config leída de process.env en runtime (app settings del App Service) y
  // entregada al browser en cada request: misma imagen Docker para toda ciudad.
  // Script inline síncrono en <head>: corre antes que cualquier bundle del cliente.
  const publicConfigScript = serializePublicConfig(toPublicConfig(getServerEnv()));
  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: publicConfigScript }} />
      </head>
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
