import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  SESSION_EMAIL_COOKIE,
  SESSION_TOKEN_COOKIE,
  SESSION_USER_ID_COOKIE
} from '@/auth/sessionCookies';

const sessionPayloadSchema = z.object({
  idToken: z.string().min(1),
  userId: z.string().min(1),
  email: z.string().default('')
});

// 60 minutes en segundos — coincide con la vida del Firebase ID token y deja
// que SessionProvider haga el refresh proactivo cada 50 min (con margen).
const SESSION_MAX_AGE_SECONDS = 60 * 60;

const baseCookieOptions = (request: NextRequest) => ({
  httpOnly: true,
  secure: request.nextUrl.protocol === 'https:',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS
});

// Crea/rota la sesión: el cliente manda el Firebase ID token recién obtenido
// (signIn o getIdToken(true)) y el server lo guarda en una cookie httpOnly.
// El cliente NUNCA toca document.cookie con el token — toda autorización al
// backend BIA viaja vía /api/proxy, que lee la cookie server-side.
export const POST = async (request: NextRequest) => {
  const body = await request.json().catch(() => null);
  const parsed = sessionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { idToken, userId, email } = parsed.data;
  const response = NextResponse.json({ ok: true });
  const options = baseCookieOptions(request);

  response.cookies.set(SESSION_TOKEN_COOKIE, idToken, options);
  response.cookies.set(SESSION_USER_ID_COOKIE, userId, options);
  response.cookies.set(SESSION_EMAIL_COOKIE, email, options);

  return response;
};

// Limpia la sesión. Se llama desde useAuth.logout() ANTES de signOut() para
// que, si Firebase falla, la sesión local quede invalidada igual.
export const DELETE = async (request: NextRequest) => {
  const response = NextResponse.json({ ok: true });
  const options = { ...baseCookieOptions(request), maxAge: 0 };

  response.cookies.set(SESSION_TOKEN_COOKIE, '', options);
  response.cookies.set(SESSION_USER_ID_COOKIE, '', options);
  response.cookies.set(SESSION_EMAIL_COOKIE, '', options);

  return response;
};
