/**
 * generateSettlementPdf
 *
 * Generates the official ICA settlement form as a PDF Blob.
 * Matches the layout of the official Nocaima declaration form.
 *
 * Usage (client-side only — call from click handlers, never during SSR):
 *   const blob = await generateSettlementPdf(data, establishment, client);
 *   const url = URL.createObjectURL(blob);
 */

import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { env } from '@/config/env';
import type { SettlementResponse } from '../types/settlement.types';
import type { Establishment } from '../models/establishment.interface';
import type { Client } from '../models/client.interface';

// ─── Municipality config ────────────────────────────────────────────────────
// Update these values per deployment.
const MUNI = {
  name: 'ALCALDIA MUNICIPAL DE NOCAIMA',
  department: 'SECRETARIA FINANCIERA Y ADMINISTRATIVA',
  taxLabel: 'LIQUIDACION INDUSTRIA, COMERCIO Y COMPLEMENTARIOS',
  nit: '899999718.9',
  /** 13-digit GS1 Global Location Number used in GS1-128 barcode (415 AI). */
  gs1Gln: '7709998107366',
  bank: 'BANCO AGRARIO',
  slogan: 'Nocaima Una Tarea De Todos',
  /** URL-safe slug used as the root folder in blob storage paths. */
  slug: 'nocaima'
} as const;

export { MUNI };

const CITY_BASE_URL = env.NEXT_PUBLIC_CITY_URL ?? 'https://blitz-city.azurewebsites.net';

// ─── Layout constants ────────────────────────────────────────────────────────
const M = 10; // page margin mm
const PW = 210; // A4 width mm
const CW = PW - M * 2; // content width mm

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso: string): string =>
  new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

const fmtCop = (v: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(v);

/** Returns the finalY of the last autoTable call. */
const lastY = (doc: jsPDF): number =>
  // jspdf-autotable sets doc.lastAutoTable after each call
  (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? M;

/** Builds the GS1-128 barcode content string. */
const buildBarcodeText = (
  gln: string,
  invoiceId: number,
  amount: number,
  presentationDate: string
): string => {
  const ref = String(invoiceId).padStart(12, '0');
  const date = presentationDate.replace(/-/g, ''); // YYYYMMDD
  return `(415)${gln}(8020)${ref}(3900)${Math.round(amount)}(96)${date}`;
};

/** Renders a GS1-128 barcode to a data URL. Returns null on failure. */
async function barcodeDataUrl(text: string): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  try {
    // bwip-js uses conditional exports — cast to browser interface to satisfy
    // TypeScript which resolves the node entry by default during type-check.
    type BwipBrowser = {
      toCanvas: (canvas: HTMLCanvasElement, opts: Record<string, unknown>) => HTMLCanvasElement;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bwipjs = (await import('bwip-js' as any)) as unknown as BwipBrowser;
    const canvas = document.createElement('canvas');
    bwipjs.toCanvas(canvas, {
      bcid: 'gs1-128',
      text,
      scale: 3,
      height: 12,
      includetext: false
    });
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

interface CityConfig {
  shieldDataUrl: string | null;
  gln: string | null;
}

/**
 * Fetches city/module config from the cities API.
 * URL: /ms-city/city/{city_code}/{app_code}
 * Returns the shield as a data URL and the GS1 GLN for the barcode.
 */
async function fetchCityConfig(): Promise<CityConfig> {
  if (typeof window === 'undefined') return { shieldDataUrl: null, gln: null };
  try {
    const res = await fetch(
      `${CITY_BASE_URL}/ms-city/city/${env.NEXT_PUBLIC_CITY_NAME}/${env.NEXT_PUBLIC_APP_NAME}`
    );
    if (!res.ok) return { shieldDataUrl: null, gln: null };
    const data = await res.json();

    // GLN for GS1-128 barcode
    const gln: string | null = data?.gln ?? data?.barcode ?? data?.nit ?? null;

    // Shield image → convert to data URL for jsPDF
    const imgUrl: string | undefined = data?.img || data?.logo_img || data?.logo;
    if (!imgUrl) return { shieldDataUrl: null, gln };

    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) return { shieldDataUrl: null, gln };
    const blob = await imgRes.blob();
    const shieldDataUrl = await new Promise<string | null>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });

    return { shieldDataUrl, gln };
  } catch {
    return { shieldDataUrl: null, gln: null };
  }
}

// ─── Section drawers ──────────────────────────────────────────────────────────

function drawHeader(
  doc: jsPDF,
  y: number,
  establishment: Establishment,
  year: number,
  shieldDataUrl: string | null
): number {
  const H = 28;
  const LOGO_W = 22;
  const REG_W = 32;
  const TXT_LEFT = M + LOGO_W;
  const TXT_RIGHT = M + CW - REG_W;
  const TXT_CX = (TXT_LEFT + TXT_RIGHT) / 2;
  const REG_CX = TXT_RIGHT + REG_W / 2;

  doc.setLineWidth(0.3);
  doc.setDrawColor(0);
  doc.rect(M, y, CW, H);

  // Shield / logo
  if (shieldDataUrl) {
    doc.addImage(shieldDataUrl, M + 1, y + 1, LOGO_W - 2, H - 2);
  } else {
    doc.setFillColor(235, 235, 235);
    doc.rect(M, y, LOGO_W, H, 'F');
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text('ESCUDO', M + LOGO_W / 2, y + H / 2, { align: 'center', baseline: 'middle' });
    doc.setTextColor(0);
  }

  // Vertical separators
  doc.line(M + LOGO_W, y, M + LOGO_W, y + H);
  doc.line(TXT_RIGHT, y, TXT_RIGHT, y + H);

  // Municipality text (center block)
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(MUNI.name, TXT_CX, y + 7, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(MUNI.department, TXT_CX, y + 12, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(MUNI.taxLabel, TXT_CX, y + 17, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${MUNI.nit}`, TXT_CX, y + 22.5, { align: 'center' });

  // Right block: Registro / Year
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('REGISTRO No.', REG_CX, y + 6, { align: 'center' });
  doc.setFontSize(11);
  doc.text(String(establishment.id), REG_CX, y + 12.5, { align: 'center' });

  doc.line(TXT_RIGHT, y + H / 2, M + CW, y + H / 2);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AÑO', REG_CX, y + 18, { align: 'center' });
  doc.setFontSize(12);
  doc.text(String(year), REG_CX, y + 25, { align: 'center' });

  return y + H;
}

function drawIdentification(
  doc: jsPDF,
  y: number,
  data: SettlementResponse,
  establishment: Establishment,
  client: Client | undefined,
  totalAmount: number
): number {
  const nit = establishment.numberIdentification || String(client?.id ?? '—');
  const rows: [string, string][] = [
    ['Número de Identificación Tributaria (NIT):', nit],
    ['Propietario / Pagador:', client?.name ?? '—'],
    ['Razón Social del Establecimiento:', data.establishment_name],
    ['Dirección:', data.address],
    ['Fecha Presentación Declaración:', fmtDate(data.presentation_date)],
    ['Fecha Liquidación:', fmtDate(data.settlement_date)],
    ['Valor Liquidación:', fmtCop(totalAmount)]
  ];

  autoTable(doc, {
    startY: y + 1,
    head: [['B.  IDENTIFICACIÓN', '']],
    body: rows,
    margin: { left: M, right: M },
    tableWidth: CW,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: {
      fillColor: [210, 210, 210],
      textColor: 0,
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }
    },
    columnStyles: {
      0: { cellWidth: 78, fontStyle: 'bold' },
      1: { fontStyle: 'normal' }
    },
    theme: 'grid'
  });

  return lastY(doc);
}

function drawActivities(doc: jsPDF, y: number, data: SettlementResponse): number {
  // Section header
  autoTable(doc, {
    startY: y + 2,
    head: [['C.  ACTIVIDADES GRAVADAS', '', '', '']],
    body: [],
    margin: { left: M, right: M },
    tableWidth: CW,
    headStyles: {
      fillColor: [210, 210, 210],
      textColor: 0,
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }
    },
    theme: 'grid'
  });

  const body = data.activities.map(a => [
    `${a.activity_code} - ${a.activity_name}`,
    String(a.tariff_rate),
    fmtCop(a.annual_sales),
    fmtCop(a.tax)
  ]);

  autoTable(doc, {
    startY: lastY(doc),
    head: [['ACTIVIDADES GRAVADAS', 'TARIFA', 'INGRESOS GRAVADOS', 'IMPUESTO']],
    body,
    margin: { left: M, right: M },
    tableWidth: CW,
    styles: { fontSize: 6.5, cellPadding: 1.3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', fontSize: 6.5 },
    columnStyles: {
      0: { cellWidth: 106 },
      1: { cellWidth: 22, halign: 'right' },
      2: { cellWidth: 33, halign: 'right' },
      3: { cellWidth: 29, halign: 'right' }
    },
    theme: 'grid'
  });

  return lastY(doc);
}

function drawLiquidacion(doc: jsPDF, y: number, data: SettlementResponse): number {
  autoTable(doc, {
    startY: y + 2,
    head: [['D.  LIQUIDACIÓN PRIVADA DE IMPUESTO DE INDUSTRIA Y COMERCIO', '', '']],
    body: [],
    margin: { left: M, right: M },
    tableWidth: CW,
    headStyles: {
      fillColor: [210, 210, 210],
      textColor: 0,
      fontStyle: 'bold',
      fontSize: 7,
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 }
    },
    theme: 'grid'
  });

  const body = data.rows.map(row => [
    String(row.number),
    row.name,
    row.value === 0 ? '$ 0' : fmtCop(row.value)
  ]);

  autoTable(doc, {
    startY: lastY(doc),
    head: [['No.', 'CONCEPTO', 'VALOR']],
    body,
    margin: { left: M, right: M },
    tableWidth: CW,
    styles: { fontSize: 6.5, cellPadding: 1.3 },
    headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', fontSize: 6.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 148 },
      2: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
    },
    theme: 'grid'
  });

  return lastY(doc);
}

function drawSignatures(doc: jsPDF, y: number): number {
  const H = 22;
  const COL = CW / 3;
  const labels = ['FIRMA DEL DECLARANTE', 'FIRMA DEL CONTADOR', 'REVISOR FISCAL'];

  y += 3;
  doc.setLineWidth(0.3);
  doc.rect(M, y, CW, H);

  labels.forEach((label, i) => {
    const sx = M + i * COL;
    if (i > 0) doc.line(sx, y, sx, y + H);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(label, sx + COL / 2, y + 3.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('NOMBRE: _______________________________', sx + 3, y + 10);
    doc.text('CC / CE / TI / No: ____________________', sx + 3, y + 16.5);
  });

  return y + H;
}

async function drawBarcodeAndStub(
  doc: jsPDF,
  y: number,
  data: SettlementResponse,
  establishment: Establishment,
  client: Client | undefined,
  totalAmount: number,
  year: number,
  barcodeText: string
): Promise<number> {
  const H = 32;
  const BAR_W = Math.floor(CW * 0.56);
  const STUB_W = CW - BAR_W - 2;
  const STUB_X = M + BAR_W + 2;

  y += 3;
  doc.setLineWidth(0.3);
  doc.rect(M, y, BAR_W, H);
  doc.rect(STUB_X, y, STUB_W, H);

  // ── Barcode section ────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(fmtDate(data.presentation_date), M + 3, y + 5);

  const imgUrl = await barcodeDataUrl(barcodeText);
  if (imgUrl) {
    const imgW = BAR_W - 6;
    doc.addImage(imgUrl, 'PNG', M + 3, y + 8, imgW, 13);
  }

  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text(barcodeText, M + BAR_W / 2, y + 25, {
    align: 'center',
    maxWidth: BAR_W - 4
  });

  // ── Payment stub ───────────────────────────────────────────────
  const SW = STUB_W - 4;
  const SXC = STUB_X + STUB_W / 2;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text(MUNI.name, SXC, y + 4, { align: 'center', maxWidth: SW });

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${MUNI.nit}`, SXC, y + 8, { align: 'center' });

  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text('LIQUIDACION OFICIAL INDUSTRIA Y COMERCIO', SXC, y + 11.5, {
    align: 'center',
    maxWidth: SW
  });

  const contributor = client?.name ?? establishment.numberIdentification;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.text(`CONTRIBUYENTE: ${contributor}`, STUB_X + 2, y + 15, { maxWidth: SW });
  doc.text(`REGISTRO No: ${establishment.id}   PERIODO: ${year}`, STUB_X + 2, y + 18.5);
  doc.text(`FECHA LÍMITE: ${fmtDate(data.presentation_date)}`, STUB_X + 2, y + 22);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`VALOR A PAGAR: ${fmtCop(totalAmount)}`, STUB_X + 2, y + 27);

  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  doc.text(MUNI.slogan, SXC, y + 31, { align: 'center' });
  doc.setTextColor(0);

  return y + H;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateSettlementPdf(
  data: SettlementResponse,
  establishment: Establishment,
  client: Client | undefined,
  invoiceId: number
): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const year = new Date(data.start_date + 'T12:00:00').getFullYear();
  // Last row by number = total to pay
  const totalRow = [...data.rows].sort((a, b) => b.number - a.number)[0];
  const totalAmount = totalRow?.value ?? 0;

  const { shieldDataUrl, gln } = await fetchCityConfig();
  const resolvedGln = gln ?? MUNI.gs1Gln;

  const barcodeContent = buildBarcodeText(
    resolvedGln,
    invoiceId,
    totalAmount,
    data.presentation_date
  );
  let y = M;

  // 1. Header
  y = drawHeader(doc, y, establishment, year, shieldDataUrl);

  // 2. Identification
  y = drawIdentification(doc, y, data, establishment, client, totalAmount);

  // 3. Activities
  y = drawActivities(doc, y, data);

  // 4. Liquidación rows
  y = drawLiquidacion(doc, y, data);

  // 5. Signatures
  y = drawSignatures(doc, y);

  // 6. Barcode + payment stub
  await drawBarcodeAndStub(doc, y, data, establishment, client, totalAmount, year, barcodeContent);

  return doc.output('blob');
}
