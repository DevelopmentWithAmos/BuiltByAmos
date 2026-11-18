import React, { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { CV_CONTENT, triggerCvDownload } from '../data/portfolioData';

interface CvPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export const CvPreviewModal: React.FC<CvPreviewModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <p className="text-xs font-medium text-[#2563EB]">Curriculum Vitae</p>
            <h3
              id="cv-modal-title"
              className="mt-1 text-xl font-semibold tracking-tight text-zinc-950"
            >
              Amos Anand — BuiltByAmos
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close CV preview"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <pre className="mt-6 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-[#FAFAFB] p-5 font-mono text-xs leading-relaxed text-zinc-700">
          {CV_CONTENT}
        </pre>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 whitespace-nowrap shrink-0"
          >
            Close
          </button>
          <button
            type="button"
            onClick={triggerCvDownload}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
};
