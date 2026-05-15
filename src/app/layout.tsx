import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { Inter } from 'next/font/google';
import { Toaster } from '@biaenergy/ui';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';
import { DataAccessProvider } from '@/data/core';
import { AuthProvider } from '@/auth/AuthProvider';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Olibia',
  description: 'El sistema operativo de Bia',
  icons: {
    icon: '/olibia-logo.png',
    shortcut: '/olibia-logo.png',
    apple: '/olibia-logo.png'
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
            <AuthProvider>{children}</AuthProvider>
          </DataAccessProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
