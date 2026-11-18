import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import {
  CAPABILITIES,
  CASE_STUDIES,
  HERO_MEDIA,
  HERO_METRICS,
  triggerCvDownload,
} from './data/portfolioData';
import { CaseStudy } from './types/portfolio';
import { ProjectGallery } from './components/ProjectGallery';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CvPreviewModal } from './components/CvPreviewModal';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}

const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-900 p-8 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <p className="font-serif text-lg italic text-zinc-200">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formScope, setFormScope] = useState('UI/UX Design & Web Build');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    setFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#09090B]">
      {/* Sticky Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#FAFAFB]/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
          >
            BuiltByAmos
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 text-sm font-medium text-zinc-600 md:flex"
          >
            <a
              href="#work"
              className="transition-colors hover:text-zinc-950 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Work
            </a>
            <a
              href="#repositories"
              className="transition-colors hover:text-zinc-950 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Repositories
            </a>
            <a
              href="#capabilities"
              className="transition-colors hover:text-zinc-950 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Capabilities
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-zinc-950 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToContact}
              className="hidden min-h-[40px] items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              Hire Me
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3 text-sm font-medium text-zinc-700">
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-zinc-950"
              >
                Work
              </a>
              <a
                href="#repositories"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-zinc-950"
              >
                Repositories
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-zinc-950"
              >
                Capabilities
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-zinc-950"
              >
                Contact
              </a>
              <button
                type="button"
                onClick={scrollToContact}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white"
              >
                Hire Me
              </button>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* Split-Screen Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#2563EB]">
                  Amos Anand · Portfolio &amp; Studio
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
                  Creative UI/UX Designer &amp; Developer
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                  I design clear, human-centered product interfaces and build them
                  into fast, accessible web applications with React, TypeScript,
                  and Tailwind CSS.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  >
                    Hire Me
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={triggerCvDownload}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <Download className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                    Download CV
                  </button>

                  <button
                    type="button"
                    onClick={() => setCvModalOpen(true)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 px-2 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Preview CV
                  </button>
                </div>
              </div>

              <div className="mt-10 border-t border-zinc-200 pt-5 text-xs text-zinc-500">
                <span>Available for freelance &amp; product contracts</span>
                <span aria-hidden="true" className="mx-2 text-zinc-300">
                  ·
                </span>
                <span>React 19 · TypeScript · Design Systems</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900">
                <ResilientImage
                  src={HERO_MEDIA.src}
                  alt={HERO_MEDIA.alt}
                  fallbackTitle="BuiltByAmos Studio Workstation"
                  className="aspect-4/3 h-full w-full object-cover lg:aspect-auto"
                />
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Metric Strip Below Split Hero */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-zinc-200 pt-8 md:grid-cols-4">
            {HERO_METRICS.map((item) => (
              <div key={item.label}>
                <div className="font-mono text-2xl font-semibold tracking-tight text-zinc-950 tabular-nums sm:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subtle Editorial Marquee Ribbon Divider */}
        <div
          className="overflow-hidden border-y border-zinc-200 bg-white py-3.5"
          aria-hidden="true"
        >
          <div className="animate-editorial-marquee flex w-max items-center gap-8 font-serif text-sm italic text-zinc-500 whitespace-nowrap">
            <span>selected works · ui/ux architecture · design systems · web engineering</span>
            <span>·</span>
            <span>selected works · ui/ux architecture · design systems · web engineering</span>
            <span>·</span>
            <span>selected works · ui/ux architecture · design systems · web engineering</span>
            <span>·</span>
            <span>selected works · ui/ux architecture · design systems · web engineering</span>
          </div>
        </div>

        {/* Selected Works / Case Studies */}
        <section id="work" className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-[#2563EB]">
                Selected Works
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-4xl">
                Product design paired with production engineering
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-600">
              Select any case study to inspect the challenge, system architecture,
              and measurable product outcomes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {CASE_STUDIES.map((study) => (
              <article
                key={study.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 ${
                  study.featured ? 'lg:col-span-2 lg:grid lg:grid-cols-12' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStudy(study)}
                  className={`block w-full overflow-hidden bg-zinc-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] ${
                    study.featured ? 'lg:col-span-7' : ''
                  }`}
                >
                  <ResilientImage
                    src={study.imageSrc}
                    alt={study.imageAlt}
                    fallbackTitle={study.title}
                    className="aspect-4/3 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </button>

                <div
                  className={`flex flex-col justify-between p-6 sm:p-8 ${
                    study.featured ? 'lg:col-span-5' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-800">
                        {study.discipline}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{study.year}</span>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                      <button
                        type="button"
                        onClick={() => setSelectedStudy(study)}
                        className="text-left hover:text-[#2563EB] focus-visible:outline-none focus-visible:underline"
                      >
                        {study.title}
                      </button>
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                      {study.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
                    <span className="font-mono text-xs font-medium text-zinc-700 tabular-nums">
                      {study.metrics[0]?.value} {study.metrics[0]?.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedStudy(study)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
                    >
                      View Case Study
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GitHub API Project Gallery */}
        <ProjectGallery defaultUsername="DevelopmentWithAmos" />

        {/* Capabilities Section */}
        <section
          id="capabilities"
          className="border-t border-zinc-200 bg-[#FAFAFB] py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-[#2563EB]">
                Capabilities
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-4xl">
                End-to-end craft from wireframe to production
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.index}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
                >
                  <span className="font-mono text-sm font-medium text-[#2563EB] tabular-nums">
                    {cap.index}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                    {cap.description}
                  </p>
                  <p className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
                    {cap.focusAreas.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Hire Me Section */}
        <section
          id="contact"
          className="border-t border-zinc-200 bg-white py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-xs font-medium tracking-wide text-[#2563EB]">
                  Start a Conversation
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-4xl">
                  Ready to build your next product together?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-600">
                  Share your project timeline, design needs, or engineering scope.
                  I typically reply within one business day.
                </p>

                <div className="mt-8 space-y-4 border-t border-zinc-200 pt-6 text-sm">
                  <div className="flex items-center gap-3 text-zinc-700">
                    <Mail className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    <a
                      href="mailto:amosanand871@gmail.com"
                      className="font-medium hover:text-[#2563EB] hover:underline"
                    >
                      amosanand871@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-700">
                    <ArrowUpRight
                      className="h-4 w-4 text-zinc-400"
                      aria-hidden="true"
                    />
                    <a
                      href="https://github.com/DevelopmentWithAmos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-[#2563EB] hover:underline"
                    >
                      github.com/DevelopmentWithAmos
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFB] p-6 sm:p-8">
                  {formSubmitted ? (
                    <div className="py-8 text-center">
                      <CheckCircle2
                        className="mx-auto h-10 w-10 text-[#2563EB]"
                        aria-hidden="true"
                      />
                      <h3 className="mt-4 text-xl font-semibold text-zinc-950">
                        Inquiry prepared for {formName}
                      </h3>
                      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
                        Your project brief for{' '}
                        <span className="font-medium text-zinc-900">
                          {formScope}
                        </span>{' '}
                        is ready. You can send it directly via your mail client or
                        submit another note.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <a
                          href={`mailto:amosanand871@gmail.com?subject=${encodeURIComponent(
                            `Project Inquiry: ${formScope} — ${formName}`
                          )}&body=${encodeURIComponent(
                            `From: ${formName} (${formEmail})\nScope: ${formScope}\n\n${formMessage}`
                          )}`}
                          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
                        >
                          Open in Mail Client
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 whitespace-nowrap shrink-0"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-medium text-zinc-700"
                          >
                            Your Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Alex Rivera"
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-medium text-zinc-700"
                          >
                            Email Address
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="alex@company.com"
                            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-scope"
                          className="block text-xs font-medium text-zinc-700"
                        >
                          Engagement Scope
                        </label>
                        <select
                          id="contact-scope"
                          value={formScope}
                          onChange={(e) => setFormScope(e.target.value)}
                          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
                        >
                          <option value="UI/UX Design & Web Build">
                            UI/UX Design &amp; Web Build
                          </option>
                          <option value="Design System Architecture">
                            Design System Architecture
                          </option>
                          <option value="Frontend React / TypeScript Engineering">
                            Frontend React / TypeScript Engineering
                          </option>
                          <option value="Product Audit & Redesign">
                            Product Audit &amp; Redesign
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-medium text-zinc-700"
                        >
                          Project Details
                        </label>
                        <textarea
                          id="contact-message"
                          rows={4}
                          required
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Tell me about what you're building, your goals, and target launch window."
                          className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <span className="text-xs text-zinc-500">
                          Or email directly at amosanand871@gmail.com
                        </span>
                        <button
                          type="submit"
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                        >
                          Send Inquiry
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-200 bg-[#FAFAFB] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BuiltByAmos · Amos Anand</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#work" className="hover:text-zinc-950">
              Work
            </a>
            <a href="#repositories" className="hover:text-zinc-950">
              Repositories
            </a>
            <a href="#capabilities" className="hover:text-zinc-950">
              Capabilities
            </a>
            <a
              href="https://github.com/DevelopmentWithAmos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <CaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
        onHireClick={scrollToContact}
      />
      <CvPreviewModal open={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </div>
  );
}

export default App;
