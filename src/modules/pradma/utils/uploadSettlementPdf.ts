/**
 * uploadSettlementPdf
 *
 * Uploads a settlement PDF blob to the blitz-blob storage service.
 * Path format: {NEXT_PUBLIC_CITY_NAME}/{module}/{establishment_id}/{year}/{MM-DD-HH-mm-ss}.pdf
 *
 * Example: nocaima/ind-com/42/2025/06-24-14-30-00.pdf
 */

import { env } from '@/config/env';
import type { Establishment } from '../models/establishment.interface';

/** Builds the blob storage path for a settlement PDF. */
export function buildSettlementPath(
  establishmentId: number,
  year: number,
  now = new Date()
): string {
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${env.NEXT_PUBLIC_CITY_NAME}/ind-com/${establishmentId}/${year}/${MM}-${DD}-${HH}-${mm}-${ss}`;
}

/**
 * Uploads the PDF blob and returns the public URL of the stored file.
 * Throws on network error or non-OK response.
 */
export async function uploadSettlementPdf(
  pdfBlob: Blob,
  establishment: Establishment,
  year: number
): Promise<string> {
  const path = buildSettlementPath(establishment.id, year);
  const filename = `liquidacion-${establishment.registrationNumber || establishment.id}-${year}.pdf`;

  const formData = new FormData();
  formData.append('path', path);
  formData.append('files', pdfBlob, filename);

  const response = await fetch('/api/upload-pdf', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Error al subir PDF (${response.status})${detail ? ': ' + detail : ''}`);
  }

  // The API may return the URL in different shapes — handle the most common ones:
  // { url: string }  |  { urls: string[] }  |  [{ url: string }]  |  { files: [{ url }] }
  const body = await response.json();
  const url: string | undefined =
    body?.url ?? body?.urls?.[0] ?? body?.[0]?.url ?? body?.files?.[0]?.url;

  if (!url) {
    throw new Error('El servicio de almacenamiento no devolvió una URL válida.');
  }

  return url;
}
