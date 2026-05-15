import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { SESSION_TOKEN_COOKIE } from '@/auth/sessionCookies';

const FORWARDED_RESPONSE_HEADERS = ['content-type', 'content-disposition', 'content-length'];

const proxy = async (request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => {
  const { path } = await params;
  const target = `${env.NEXT_PUBLIC_BACKEND_URL}/${path.join('/')}${request.nextUrl.search}`;

  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.delete('host');

  if (!forwardHeaders.get('authorization')) {
    const token = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value;
    if (token) forwardHeaders.set('Authorization', `Bearer ${token}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const init: RequestInit & { duplex?: string } = {
    method: request.method,
    headers: forwardHeaders,
    ...(hasBody && { body: request.body, duplex: 'half' })
  };

  const upstream = await fetch(target, init);

  const responseHeaders = new Headers();
  for (const header of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
