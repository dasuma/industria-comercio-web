import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const BLOB_BASE_URL = process.env.NEXT_PUBLIC_BLOB_URL ?? 'https://blitz-blob.azurewebsites.net';

/**
 * Proxies a multipart PDF upload to the blob storage service.
 * Avoids CORS restrictions when uploading from the browser.
 *
 * Expects: FormData { path: string, files: Blob }
 * Returns: the JSON body from the blob service (contains the public URL).
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const upstream = await fetch(`${BLOB_BASE_URL}/api/files/v2/upload`, {
    method: 'POST',
    body: formData
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    return NextResponse.json(
      { error: `Error al subir archivo (${upstream.status})${detail ? ': ' + detail : ''}` },
      { status: upstream.status }
    );
  }

  const body = await upstream.json();
  return NextResponse.json(body);
}
