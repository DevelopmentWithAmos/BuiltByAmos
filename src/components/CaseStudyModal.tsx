import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CaseStudy } from '../types/portfolio';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onHireClick: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  onHireClick,
}) => {
  useEffect(() => {
    if (!study) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [study, onClose]);

  if (!study) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-900">{study.client}</span>
            <span aria-hidden="true">·</span>
            <span>{study.discipline}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{study.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h3
            id="case-study-modal-title"
            className="text-2xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-3xl"
          >
            {study.title}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            {study.summary}
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <img
              src={study.imageSrc}
              alt={study.imageAlt}
              referrerPolicy="no-referrer"
              className="aspect-4/3 w-full object-cover"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-y border-zinc-200 py-6 sm:grid-cols-3">
            {study.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-mono text-2xl font-semibold tracking-tight text-zinc-950 tabular-nums">
                  {metric.value}
                </div>
                <div className="mt-1 text-xs text-zinc-500">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-zinc-950">Challenge</h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {study.challenge}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950">
                Architecture &amp; Outcome
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {study.outcome}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-zinc-500">
              Deliverables: {study.deliverables.join(' · ')}
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onHireClick();
              }}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
            >
              Discuss a Similar Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
