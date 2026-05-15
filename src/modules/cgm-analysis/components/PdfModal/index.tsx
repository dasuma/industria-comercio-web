'use client';

import { Button, Modal } from '@biaenergy/ui';
import { RiDownloadLine, RiBarChartLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getCgmAnalysisDict } from '../../dictionaries';

interface PdfModalProps {
  locale: Locale;
  pdfUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegenerate: () => void;
}

export const PdfModal = ({ locale, pdfUrl, open, onOpenChange, onRegenerate }: PdfModalProps) => {
  const dict = getCgmAnalysisDict(locale);
  const p = dict.analysis.pdf;

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="max-w-5xl">
        <Modal.Header title={p.title} />
        <Modal.Body className="p-0">
          <iframe src={pdfUrl} title={p.title} className="h-[70vh] w-full" />
        </Modal.Body>
        <Modal.Footer>
          <Button.Root asChild variant="neutral" mode="stroke" size="medium">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button.Icon as={RiDownloadLine} />
              {p.download}
            </a>
          </Button.Root>
          <Button.Root variant="primary" mode="filled" size="medium" onClick={onRegenerate}>
            <Button.Icon as={RiBarChartLine} />
            {p.regenerate}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
