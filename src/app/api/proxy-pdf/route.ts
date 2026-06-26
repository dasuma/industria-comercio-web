import { type NextRequest, NextResponse } from 'next/server';

/**
 * Proxy a PDF from an external URL and force Content-Disposition: inline
 * so the browser renders it inside an <iframe> instead of downloading.
 *
 * Usage: /api/proxy-pdf?url=<encoded-pdf-url>
 */
export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(decodeURIComponent(rawUrl));
  } catch {
    return NextResponse.json({ error: 'Could not reach PDF source' }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: 'PDF source returned an error' }, { status: 502 });
  }

  const buffer = await upstream.arrayBuffer();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600'
    }
  });
}
