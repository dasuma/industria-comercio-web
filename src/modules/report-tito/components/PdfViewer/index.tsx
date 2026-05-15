import { RiDownloadLine } from '@biaenergy/ui/icons';
import type { ReportTitoDictionary } from '../../dictionaries';

interface PdfViewerProps {
  pdfUrl: string;
  dict: ReportTitoDictionary['pdf'];
}

export const PdfViewer = ({ pdfUrl, dict }: PdfViewerProps) => (
  <div className="bg-bg-white-0 border-stroke-soft-200 overflow-hidden rounded-xl border">
    <div className="border-stroke-soft-200 flex items-center justify-between border-b px-4 py-3">
      <h2 className="text-label-sm text-text-strong-950">{dict.title}</h2>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-base hover:text-primary-dark flex items-center gap-1.5 text-sm transition-colors"
      >
        <RiDownloadLine className="h-4 w-4" />
        {dict.download}
      </a>
    </div>
    <iframe src={pdfUrl} title={dict.title} className="w-full" style={{ height: '80vh' }} />
  </div>
);
