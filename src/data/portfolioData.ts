import heroStudioImg from '../assets/images/hero_studio_desk_1794976773154.jpg';
import fintechSystemImg from '../assets/images/work_fintech_system_1794976773974.jpg';
import commerceBrandImg from '../assets/images/work_commerce_brand_1794976773943.jpg';
import designSystemImg from '../assets/images/work_design_system_1794976775850.jpg';
import { CapabilityItem, CaseStudy } from '../types/portfolio';

export const HERO_MEDIA = {
  src: heroStudioImg,
  alt: 'Architectural design and engineering workstation displaying a Swiss grid portfolio layout',
};

export const HERO_METRICS = [
  { value: '24+', label: 'Shipped Digital Products' },
  { value: '4+ Years', label: 'UI/UX & Web Engineering' },
  { value: '99.9%', label: 'Production Uptime Target' },
  { value: '< 1.2s', label: 'Core Web Vital LCP' },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'meridian-treasury',
    title: 'Meridian Treasury Workspace',
    discipline: 'Product UI/UX & Frontend Architecture',
    year: '2026',
    client: 'Meridian Financial Systems',
    summary:
      'Redesigned an institutional cash-flow and portfolio telemetry platform to eliminate visual clutter and surface real-time liquidity decisions.',
    challenge:
      'Analysts navigated six disconnected screens to reconcile daily allocations, causing delayed approvals and frequent export errors.',
    outcome:
      'Consolidated portfolio allocation, transaction history, and forecast curves into a unified split-pane React + TypeScript interface with strict tabular typography.',
    deliverables: ['UX Research', 'Design System', 'React & TypeScript', 'Data Visualization'],
    metrics: [
      { label: 'Task Completion Speed', value: '+42%' },
      { label: 'Onboarding Drop-off', value: '-31%' },
      { label: 'Accessibility Score', value: '100 / 100' },
    ],
    imageSrc: fintechSystemImg,
    imageAlt: 'Laptop displaying the Meridian Treasury minimalist financial workspace on a concrete plinth',
    featured: true,
  },
  {
    id: 'studio-lignum',
    title: 'Studio Lignum Architectural Storefront',
    discipline: 'Brand Direction & E-Commerce UX',
    year: '2025',
    client: 'Lignum Bespoke Furnishings',
    summary:
      'Crafted a serene, editorial digital flagship showcasing handcrafted timber and limestone furniture with sub-second page transitions.',
    challenge:
      'High-resolution product photography slowed mobile checkout flows and obscured material specifications.',
    outcome:
      'Engineered an adaptive image pipeline, tactile finish selector, and single-page slide-over drawer that balanced editorial calm with conversion clarity.',
    deliverables: ['Art Direction', 'Wireframing', 'Responsive Web App', 'Performance Optimization'],
    metrics: [
      { label: 'Checkout Conversion', value: '+28%' },
      { label: 'Mobile Bounce Rate', value: '-24%' },
      { label: 'Lighthouse Performance', value: '99 / 100' },
    ],
    imageSrc: commerceBrandImg,
    imageAlt: 'Frameless tablet displaying the Studio Lignum architectural furniture storefront',
  },
  {
    id: 'forma-ui-tokens',
    title: 'Forma Modular Design System',
    discipline: 'Design Systems & Component Engineering',
    year: '2025',
    client: 'BuiltByAmos Studio Standard',
    summary:
      'Built a cross-product token architecture and accessible React component library governing spacing, typography scales, and keyboard navigation.',
    challenge:
      'Engineering teams duplicated buttons, modals, and form validation states across four separate web applications.',
    outcome:
      'Delivered a documented token specification and zero-dependency Tailwind + TypeScript primitives adopted across every client build.',
    deliverables: ['Token Specification', 'Figma Library', 'Accessible Primitives', 'Documentation'],
    metrics: [
      { label: 'UI Build Velocity', value: '2.4x' },
      { label: 'CSS Bundle Footprint', value: '14 KB' },
      { label: 'WCAG AA Compliance', value: 'Verified' },
    ],
    imageSrc: designSystemImg,
    imageAlt: 'Overhead studio view of the Forma Modular Design System specification and color tokens',
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    index: '01.',
    title: 'UI/UX Product Architecture',
    description:
      'Translating ambiguous product requirements into structured information hierarchies, interactive wireframes, and high-contrast interfaces.',
    focusAreas: ['User Flows', 'Wireframing', 'Usability Audits', 'Interactive Prototypes'],
  },
  {
    index: '02.',
    title: 'Design Systems & Visual Craft',
    description:
      'Establishing disciplined typographic scales, color budgets, and reusable component primitives built for long-term product consistency.',
    focusAreas: ['Design Tokens', 'Figma Libraries', 'Editorial Layouts', 'WCAG AA Accessibility'],
  },
  {
    index: '03.',
    title: 'Full-Stack Web Engineering',
    description:
      'Shipping resilient, responsive web applications with modern React, TypeScript, Tailwind CSS, and clean REST API integrations.',
    focusAreas: ['React 19 & TypeScript', 'Tailwind CSS', 'API Integration', 'State Architecture'],
  },
  {
    index: '04.',
    title: 'Performance & Launch Readiness',
    description:
      'Optimizing asset pipelines, semantic markup, Core Web Vitals, and technical SEO so every launch performs smoothly under real traffic.',
    focusAreas: ['Core Web Vitals', 'Technical SEO', 'Responsive Testing', 'Clean Code Handoff'],
  },
];

export const CV_CONTENT = `AMOS ANAND — BUILTBYAMOS
Creative UI/UX Designer & Web Developer
GitHub: https://github.com/DevelopmentWithAmos
Email: amosanand871@gmail.com

SUMMARY
Independent UI/UX designer and full-stack web developer focused on high-clarity digital products, design systems, and fast, accessible TypeScript/React web applications.

CORE COMPETENCIES
- UI/UX Design: Information Architecture, Wireframing, Prototyping, Usability Testing, WCAG AA Accessibility
- Frontend Engineering: React 19, TypeScript, Next.js, Vite, Tailwind CSS, HTML5, CSS3
- Backend & Tooling: Node.js, Express, REST APIs, Git/GitHub Workflows, Performance Optimization & Technical SEO

SELECTED PROJECTS
1. Meridian Treasury Workspace (2026) — Unified split-pane financial telemetry and allocation interface (+42% task completion speed).
2. Studio Lignum Flagship Storefront (2025) — Editorial e-commerce experience for bespoke architectural furnishings (+28% checkout conversion).
3. Forma Modular Design System (2025) — Accessible React + TypeScript token and component system (14 KB CSS footprint).

AVAILABILITY
Open for freelance product design, design system engagements, and end-to-end web development.
`;

export function triggerCvDownload(): void {
  const blob = new Blob([CV_CONTENT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Amos_Anand_BuiltByAmos_CV.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
