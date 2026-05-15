import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_AUTHED_ROUTE, PUBLIC_ROUTES } from '@/config/routes';

const PUBLIC_FILE = /\.[\w]+$/;
const PUBLIC_PATHS: string[] = [PUBLIC_ROUTES.login];

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Spanish-only UI: las traducciones inglesas viven en el codebase pero nunca
  // se muestran. Reseteamos cualquier NEXT_LOCALE stale (p.ej. 'en' seteado por
  // versiones previas del proxy) y mutamos la request para que getActiveLocale
  // lo vea ya corregido en este mismo render.
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie !== 'es') {
    request.cookies.set('NEXT_LOCALE', 'es');
    response.cookies.set('NEXT_LOCALE', 'es', { path: '/' });
  }

  const session = request.cookies.get('bia_session')?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic && session) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_AUTHED_ROUTE;
    return NextResponse.redirect(url);
  }

  if (!isPublic && !session) {
    const url = request.nextUrl.clone();
    url.pathname = PUBLIC_ROUTES.login;
    return NextResponse.redirect(url);
  }

  return response;
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)']
};
