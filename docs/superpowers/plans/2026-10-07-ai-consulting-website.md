# AI Consulting Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the statically generated, SEO-first lead-generation website for an outcome-positioned AI consulting company, with validated MDX content, original 2D/3D system visuals, a booking CTA on every page and an ROI calculator lead magnet.

**Architecture:** Next.js App Router renders every route to static HTML at build time from Zod-validated MDX collections under `content/`. A small design system (Tailwind tokens, two fonts) and a component library produce the pages; 2D diagrams are inline SVG React components picked by id from frontmatter, and 3D scenes are lazy React Three Fiber islands with server-rendered poster fallbacks. SEO (metadata, JSON-LD, sitemap, robots, OG images) and conversion (CTA band, ROI calculator, lead capture, analytics) are libraries with unit tests; Playwright and Lighthouse CI gate every route.

**Tech Stack:** Next.js 15 (App Router, TypeScript strict), React 19, Tailwind CSS 4, Zod, gray-matter + next-mdx-remote (RSC), @react-three/fiber + @react-three/drei + three, motion (Framer Motion), Vitest + Testing Library + jsdom, Playwright, @lhci/cli, pnpm 10, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-07-ai-consulting-website-design.md`

## Global Constraints

- Every route is statically generated; no page's content depends on client-side rendering (spec §1, §5).
- Exactly one `<h1>` per page, a canonical URL, at least one JSON-LD block, one primary CTA per page (spec §1, §9).
- Lighthouse mobile ≥ 95 Performance, Accessibility, SEO; Best Practices ≥ 90 on every route (spec §11).
- First-load JS for a non-3D page < 100 KB gzipped; each 3D route island < 150 KB gzipped, procedural geometry only, no external model files (spec §8, §11).
- Every 3D scene has a static poster, shown under `prefers-reduced-motion`, missing WebGL, low memory or slow connection; pointer/scroll interaction is optional (spec §8).
- No stock robots, no gradient backgrounds, one accent colour reserved for CTA and links (spec §7).
- Company name, positioning, booking URL, pricing, founders, target queries live only in `site.config.ts` (spec §6).
- Case studies with `illustrative: true` show a visible "Illustrative example" badge (spec §6).
- URLs exactly: `/services/[slug]`, `/industries/[slug]`, `/case-studies/[slug]`, `/insights/[slug]`, `/tools/ai-roi-calculator` (spec §5, §9).
- Titles ≤ 60 characters, descriptions ≤ 155 characters (spec §9).
- Dangling cross-references or invalid frontmatter fail `pnpm build` naming file and field (spec §10).
- `hreflang` is omitted (spec §9).
- Package manager is pnpm; commit after every task.

## Review Focus

1. A frontmatter `seo.title` over 60 characters must fail the build with the file path and field named, not silently truncate. Test added in Task 3.
2. The ROI calculator with zero headcount or zero hours must show zero savings and "no payback" rather than NaN or Infinity. Test added in Task 13.
3. The lead-capture route receiving a malformed email or an empty body must return 400 with field errors and never a stack trace. Test added in Task 13.
4. With `prefers-reduced-motion: reduce`, every 3D scene must render its poster and never mount a WebGL canvas. Test added in Task 15 (Playwright) and Task 14 (unit).
5. A service whose `caseStudy` slug points at a case study of a different `service` must still build (cross-link is one-directional) but a slug that does not exist at all must fail. Test added in Task 3.

---

## File Structure

```
TechExperiment/
  package.json, pnpm-lock.yaml, next.config.ts, tsconfig.json, postcss.config.mjs
  eslint.config.mjs, vitest.config.ts, vitest.setup.ts, playwright.config.ts, lighthouserc.json
  site.config.ts                      all brand/positioning/booking/pricing values
  content/
    services/*.mdx                    6 files
    industries/*.mdx                  4 files
    case-studies/*.mdx                3 files
    insights/*.mdx                    3 files
  public/
    posters/*.svg                     static 3D posters
    logos/*.svg                       placeholder client logos
  src/
    app/
      layout.tsx, page.tsx, not-found.tsx, error.tsx, globals.css
      sitemap.ts, robots.ts, opengraph-image.tsx
      services/page.tsx, services/[slug]/page.tsx
      industries/page.tsx, industries/[slug]/page.tsx
      case-studies/page.tsx, case-studies/[slug]/page.tsx
      insights/page.tsx, insights/[slug]/page.tsx
      tools/ai-roi-calculator/page.tsx
      about/page.tsx, contact/page.tsx, privacy/page.tsx, terms/page.tsx
      api/leads/route.ts
    components/
      Nav.tsx, Footer.tsx, Hero.tsx, ProofBar.tsx, SectionHeading.tsx
      ServiceCard.tsx, IndustryCard.tsx, CaseStudyCard.tsx, StatBlock.tsx, Quote.tsx
      ProcessSteps.tsx, FAQ.tsx, CTABand.tsx, Breadcrumbs.tsx, IllustrativeBadge.tsx
      Prose.tsx, JsonLd.tsx, Mdx.tsx
      roi/ROICalculator.tsx, roi/LeadGate.tsx
      diagrams/index.tsx (registry), diagrams/Diagram.tsx (frame), diagrams/*Diagram.tsx (6)
      scenes/SceneFrame.tsx, scenes/useSceneAllowed.ts, scenes/*Scene.tsx (4), scenes/registry.ts
    content/
      schemas.ts, load.ts, validate.ts
    lib/
      seo.ts (metadata + json-ld), analytics.ts, roi.ts, leads/provider.ts, utils.ts
  tests/
    unit/*.test.ts(x)
    e2e/routes.spec.ts, e2e/reduced-motion.spec.ts
```

---

### Task 1: Project scaffold, config and test harness

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `site.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Test: `tests/unit/site-config.test.ts`

**Interfaces:**
- Produces: `siteConfig` (default export of `site.config.ts`) with the shape below; alias `@/` → `src/`, `@content/` → `content/`, `@site-config` → `site.config.ts`.

- [ ] **Step 1: Scaffold Next.js**

```bash
cd ~/Documents/TechExperiment
pnpm dlx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack --yes
```

If it refuses because the directory is not empty (docs/ and .git exist), run it in a temp dir and copy everything except `.git` over:

```bash
pnpm dlx create-next-app@15 /tmp/scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack --yes
rsync -a --exclude .git /tmp/scaffold/ ~/Documents/TechExperiment/
```

- [ ] **Step 2: Add dependencies**

```bash
pnpm add zod gray-matter next-mdx-remote motion three @react-three/fiber @react-three/drei
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/three @playwright/test @lhci/cli
```

- [ ] **Step 3: Write `site.config.ts`**

```ts
// site.config.ts
export const siteConfig = {
  name: "Northstar AI",                       // placeholder company name
  legalName: "Northstar AI Consulting Ltd",   // placeholder
  domain: "https://example.com",              // placeholder; no trailing slash
  tagline: "Cut operating cost with agentic AI workflows",
  positioning:
    "We help mid-to-large enterprises cut operating cost using agentic AI workflows.",
  headlineNumber: { value: "31%", label: "average operating cost reduction in pilots" },
  bookingUrl: "https://cal.com/example/ai-audit-30",
  contactEmail: "hello@example.com",
  social: { linkedin: "https://www.linkedin.com/company/example" },
  pricing: { discoverySprint: 15000, pilot: 60000, scale: 150000, currency: "USD" },
  targetQueries: [
    "AI automation consulting",
    "agentic workflow consulting",
    "LLM integration services",
    "AI strategy for enterprises",
    "AI consulting for logistics",
  ],
  founders: [
    { id: "founder-1", name: "Founder Name", role: "Founder & CEO", bio: "20 years building operations software; previously led AI at a logistics platform.", linkedin: "https://www.linkedin.com/in/example" },
  ],
  securityPosture: "GDPR-aligned; SOC 2 on the roadmap",
  showSecurityPosture: true,
  analytics: { provider: "none" as "none" | "plausible" | "ga4", id: "" },
  markets: ["US", "UK", "Middle East", "India"],
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
```

- [ ] **Step 4: Configure tsconfig paths**

Edit `tsconfig.json` `compilerOptions.paths`:

```json
"paths": {
  "@/*": ["./src/*"],
  "@content/*": ["./content/*"],
  "@site-config": ["./site.config.ts"]
}
```

Ensure `"strict": true` is set.

- [ ] **Step 5: Configure Vitest**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@content": path.resolve(__dirname, "content"),
      "@site-config": path.resolve(__dirname, "site.config.ts"),
    },
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

Add scripts to `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "lhci": "lhci autorun"
}
```

- [ ] **Step 6: Write the failing test**

```ts
// tests/unit/site-config.test.ts
import { describe, it, expect } from "vitest";
import { siteConfig } from "@site-config";

describe("siteConfig", () => {
  it("has five target queries", () => {
    expect(siteConfig.targetQueries).toHaveLength(5);
  });
  it("has a domain without trailing slash", () => {
    expect(siteConfig.domain.endsWith("/")).toBe(false);
  });
  it("has a booking url", () => {
    expect(siteConfig.bookingUrl).toMatch(/^https:\/\//);
  });
});
```

- [ ] **Step 7: Run tests**

Run: `pnpm test`
Expected: 3 passing.

- [ ] **Step 8: Replace the scaffold home page with a placeholder and verify build**

```tsx
// src/app/page.tsx
export default function Home() {
  return <main><h1>Placeholder</h1></main>;
}
```

Run: `pnpm build`
Expected: build succeeds, `/` listed as static (○).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with config and test harness"
```

---

### Task 2: Design tokens, fonts, root layout, Nav and Footer

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`, `src/lib/utils.ts`
- Test: `tests/unit/nav.test.tsx`

**Interfaces:**
- Produces: `<Nav />`, `<Footer />` (server components, no props); `cn(...classes)` in `src/lib/utils.ts`; CSS custom properties `--color-bg`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-line`, `--color-surface`; Tailwind utilities `bg-bg text-ink text-muted text-accent bg-accent border-line bg-surface font-display font-sans`.

- [ ] **Step 1: Write tokens in `globals.css`** (Tailwind 4 syntax)

```css
@import "tailwindcss";

:root {
  --color-bg: #f7f4ee;
  --color-surface: #ffffff;
  --color-ink: #141414;
  --color-muted: #5c5a55;
  --color-line: #e3ded4;
  --color-accent: #0f5c4a;
  --color-accent-ink: #ffffff;
  --color-diagram: #8a8378;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121311;
    --color-surface: #1a1b19;
    --color-ink: #f2efe8;
    --color-muted: #a39f96;
    --color-line: #2a2b28;
    --color-accent: #6fd3b4;
    --color-accent-ink: #0b1a15;
    --color-diagram: #6d685f;
  }
}

@theme inline {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-ink: var(--color-ink);
  --color-muted: var(--color-muted);
  --color-line: var(--color-line);
  --color-accent: var(--color-accent);
  --color-accent-ink: var(--color-accent-ink);
  --color-diagram: var(--color-diagram);
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --text-step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-step-1: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  --text-step-2: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-step-3: clamp(2rem, 1.6rem + 1.8vw, 3rem);
  --text-step-4: clamp(2.5rem, 1.9rem + 3vw, 4.5rem);
  --text-step-5: clamp(3rem, 2.2rem + 4.5vw, 6rem);
}

html { background: var(--color-bg); color: var(--color-ink); }
body { font-family: var(--font-sans); font-size: var(--text-step-0); line-height: 1.6; }
.container-x { width: 100%; max-width: 1200px; margin-inline: auto; padding-inline: 1rem; }
@media (min-width: 768px) { .container-x { padding-inline: 2.5rem; } }
.prose-x { max-width: 68ch; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

- [ ] **Step 2: Write `src/lib/utils.ts`**

```ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
export function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}
```

- [ ] **Step 3: Write failing Nav test**

```tsx
// tests/unit/nav.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "@/components/Nav";
import { siteConfig } from "@site-config";

describe("Nav", () => {
  it("renders the company name and primary links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute("href", "/");
    for (const label of ["Services", "Industries", "Case studies", "Insights", "About"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute("href", "/contact");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test tests/unit/nav.test.tsx`
Expected: FAIL, cannot resolve `@/components/Nav`.

- [ ] **Step 5: Implement Nav and Footer**

```tsx
// src/components/Nav.tsx
import Link from "next/link";
import { siteConfig } from "@site-config";

const links = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="border-b border-line">
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-xl tracking-tight">{siteConfig.name}</Link>
        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="text-sm text-muted hover:text-ink">{l.label}</Link></li>
          ))}
        </ul>
        <Link href="/contact" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink">Book a call</Link>
      </nav>
    </header>
  );
}
```

```tsx
// src/components/Footer.tsx
import Link from "next/link";
import { siteConfig } from "@site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg">{siteConfig.name}</p>
          <p className="prose-x mt-2 text-sm text-muted">{siteConfig.positioning}</p>
          {siteConfig.showSecurityPosture && <p className="mt-2 text-xs text-muted">{siteConfig.securityPosture}</p>}
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/industries">Industries</Link></li>
          <li><Link href="/case-studies">Case studies</Link></li>
          <li><Link href="/insights">Insights</Link></li>
          <li><Link href="/tools/ai-roi-calculator">AI ROI calculator</Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/privacy">Privacy</Link></li>
          <li><Link href="/terms">Terms</Link></li>
          <li><a href={siteConfig.social.linkedin} rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
      <div className="container-x pb-8 text-xs text-muted">© {new Date().getFullYear()} {siteConfig.legalName}</div>
    </footer>
  );
}
```

- [ ] **Step 6: Root layout with fonts**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@site-config";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.positioning,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Run tests and build**

Run: `pnpm test && pnpm build`
Expected: Nav test passes; build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fonts, root layout, nav and footer"
```

---

### Task 3: Content schemas, loader and cross-reference validator

**Files:**
- Create: `src/content/schemas.ts`, `src/content/load.ts`, `src/content/validate.ts`
- Test: `tests/unit/content-schemas.test.ts`, `tests/unit/content-load.test.ts`, `tests/fixtures/content/**`

**Interfaces:**
- Produces:
  - `ServiceSchema, IndustrySchema, CaseStudySchema, InsightSchema` (Zod) and types `Service, Industry, CaseStudy, Insight` (each includes `slug`, `body: string` raw MDX, plus frontmatter).
  - `DiagramId` union: `"rag-pipeline" | "agent-loop" | "automation-flow" | "enterprise-stack" | "engagement-model" | "before-after"`.
  - `loadCollection(name, rootDir?)`, `getServices(), getIndustries(), getCaseStudies(), getInsights()`, `getBySlug(collection, slug)`.
  - `validateContent(rootDir?)` returns `{ ok: true } | { ok: false; errors: string[] }`; errors read `content/services/x.mdx: seo.title must be 60 characters or fewer`.

- [ ] **Step 1: Write failing schema tests**

```ts
// tests/unit/content-schemas.test.ts
import { describe, it, expect } from "vitest";
import { ServiceSchema, CaseStudySchema } from "@/content/schemas";

const validService = {
  title: "AI Automation & Agentic Workflows",
  summary: "Automate multi-step operational work with agents that plan, act and verify.",
  targetQuery: "AI automation consulting",
  problem: "Teams spend hours on repetitive, multi-system work.",
  approach: ["Map the process", "Build the agent", "Measure"],
  deliverables: ["Agent", "Runbook"],
  timelineWeeks: 8,
  caseStudy: "logistics-claims-automation",
  faq: [{ q: "How long?", a: "Eight weeks." }],
  diagram: "agent-loop",
  seo: { title: "AI Automation Consulting", description: "Agentic workflow consulting for enterprises." },
};

describe("ServiceSchema", () => {
  it("accepts a valid service", () => {
    expect(ServiceSchema.safeParse(validService).success).toBe(true);
  });
  it("rejects seo.title over 60 characters", () => {
    const r = ServiceSchema.safeParse({ ...validService, seo: { ...validService.seo, title: "x".repeat(61) } });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path.join(".")).toBe("seo.title");
  });
  it("rejects unknown diagram id", () => {
    expect(ServiceSchema.safeParse({ ...validService, diagram: "robot" }).success).toBe(false);
  });
});

describe("CaseStudySchema", () => {
  it("requires result unit and date", () => {
    const r = CaseStudySchema.safeParse({
      title: "T", client: "Confidential logistics company", industry: "logistics", service: "ai-automation",
      situation: "s", built: "b", result: { metric: "cost", value: 31, period: "per year" },
      quote: { text: "q", name: "n", role: "r" }, illustrative: true, diagram: "automation-flow",
      seo: { title: "t", description: "d" },
    });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/content-schemas.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement schemas**

```ts
// src/content/schemas.ts
import { z } from "zod";

export const DIAGRAM_IDS = ["rag-pipeline", "agent-loop", "automation-flow", "enterprise-stack", "engagement-model", "before-after"] as const;
export type DiagramId = (typeof DIAGRAM_IDS)[number];

const Seo = z.object({
  title: z.string().min(10).max(60, "must be 60 characters or fewer"),
  description: z.string().min(50).max(155, "must be 155 characters or fewer"),
});
const Faq = z.array(z.object({ q: z.string().min(5), a: z.string().min(10) })).min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a kebab-case slug");

export const ServiceSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  targetQuery: z.string().min(3),
  problem: z.string().min(20),
  approach: z.array(z.string().min(3)).min(3),
  deliverables: z.array(z.string().min(3)).min(2),
  timelineWeeks: z.number().int().positive(),
  caseStudy: slug,
  faq: Faq,
  diagram: z.enum(DIAGRAM_IDS),
  seo: Seo,
});

export const IndustrySchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  targetQuery: z.string().min(3),
  pains: z.array(z.string().min(10)).min(3),
  compliance: z.array(z.string().min(5)).min(1),
  caseStudy: slug,
  services: z.array(slug).min(1),
  faq: Faq,
  seo: Seo,
});

export const CaseStudySchema = z.object({
  title: z.string().min(3),
  client: z.string().min(3),
  industry: slug,
  service: slug,
  situation: z.string().min(40),
  built: z.string().min(40),
  result: z.object({
    metric: z.string().min(3),
    value: z.number(),
    unit: z.string().min(1),
    period: z.string().min(3),
    date: z.string().regex(/^\d{4}-\d{2}$/, "must be YYYY-MM"),
  }),
  quote: z.object({ text: z.string().min(20), name: z.string().min(2), role: z.string().min(2) }),
  illustrative: z.boolean(),
  diagram: z.enum(DIAGRAM_IDS),
  seo: Seo,
});

export const InsightSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(40).max(200),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string().min(2),
  targetQuery: z.string().min(3),
  relatedServices: z.array(slug).min(1),
  faq: Faq,
  seo: Seo,
});

export type ServiceFrontmatter = z.infer<typeof ServiceSchema>;
export type IndustryFrontmatter = z.infer<typeof IndustrySchema>;
export type CaseStudyFrontmatter = z.infer<typeof CaseStudySchema>;
export type InsightFrontmatter = z.infer<typeof InsightSchema>;

type WithSlugBody<T> = T & { slug: string; body: string };
export type Service = WithSlugBody<ServiceFrontmatter>;
export type Industry = WithSlugBody<IndustryFrontmatter>;
export type CaseStudy = WithSlugBody<CaseStudyFrontmatter>;
export type Insight = WithSlugBody<InsightFrontmatter>;

export const collections = {
  services: ServiceSchema,
  industries: IndustrySchema,
  "case-studies": CaseStudySchema,
  insights: InsightSchema,
} as const;
export type CollectionName = keyof typeof collections;
```

- [ ] **Step 4: Run schema tests**

Run: `pnpm test tests/unit/content-schemas.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write failing loader/validator tests with fixtures**

Create fixture dir `tests/fixtures/content/` mirroring `content/` with one valid file per collection and the cross references consistent. Example files:

```mdx
<!-- tests/fixtures/content/services/ai-automation.mdx -->
---
title: AI Automation & Agentic Workflows
summary: Automate multi-step operational work with agents that plan, act and verify their own output.
targetQuery: AI automation consulting
problem: Teams spend hours on repetitive, multi-system work that nobody enjoys and everybody gets wrong.
approach: ["Map the process end to end", "Build the agent with human checkpoints", "Measure against a baseline"]
deliverables: ["Production agent", "Runbook and monitoring"]
timelineWeeks: 8
caseStudy: logistics-claims-automation
faq:
  - q: How long does an engagement take?
    a: Most pilots ship in eight weeks from kickoff.
diagram: agent-loop
seo:
  title: AI Automation Consulting for Enterprises
  description: Agentic workflow consulting that cuts operating cost. Pilots in eight weeks with measured results.
---
Body text here.
```

```mdx
<!-- tests/fixtures/content/case-studies/logistics-claims-automation.mdx -->
---
title: Claims handling cut from 4 days to 6 hours
client: Confidential logistics company
industry: logistics
service: ai-automation
situation: A regional carrier processed 1,200 damage claims a month by hand across email, a TMS and a spreadsheet, taking four days each.
built: An agent that reads claim emails, pulls shipment data from the TMS, drafts a decision with evidence, and routes exceptions to a human.
result: { metric: "claim cycle time", value: 94, unit: "%", period: "reduction", date: "2026-06" }
quote: { text: "We stopped hiring for the claims desk and moved two people to customer success.", name: "Head of Operations", role: "Confidential logistics company" }
illustrative: true
diagram: automation-flow
seo:
  title: Logistics AI case study — claims automation
  description: How an agentic workflow cut claim cycle time 94% for a regional carrier. Illustrative example with the architecture that was built.
---
Body.
```

Add `tests/fixtures/content/industries/logistics.mdx` (caseStudy: logistics-claims-automation, services: [ai-automation]) and `tests/fixtures/content/insights/how-much-does-an-ai-pilot-cost.mdx` (relatedServices: [ai-automation], author: founder-1) following the schemas.

```ts
// tests/unit/content-load.test.ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { loadCollection, getBySlug } from "@/content/load";
import { validateContent } from "@/content/validate";

const fixtures = path.resolve(__dirname, "../fixtures/content");

describe("loadCollection", () => {
  it("loads services with slug and body", () => {
    const services = loadCollection("services", fixtures);
    expect(services).toHaveLength(1);
    expect(services[0].slug).toBe("ai-automation");
    expect(services[0].body).toContain("Body text here.");
  });
  it("getBySlug returns undefined for unknown slug", () => {
    expect(getBySlug("services", "nope", fixtures)).toBeUndefined();
  });
  it("throws with file path and field on invalid frontmatter", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.mkdirSync(path.join(tmp, "services"));
    const src = fs.readFileSync(path.join(fixtures, "services/ai-automation.mdx"), "utf8");
    fs.writeFileSync(path.join(tmp, "services/bad.mdx"), src.replace("title: AI Automation Consulting for Enterprises", "title: " + "x".repeat(61)));
    expect(() => loadCollection("services", tmp)).toThrow(/services\/bad\.mdx: seo\.title must be 60 characters or fewer/);
  });
});

describe("validateContent", () => {
  it("passes on consistent fixtures", () => {
    expect(validateContent(fixtures)).toEqual({ ok: true });
  });
  it("fails on a dangling case study reference", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.cpSync(fixtures, tmp, { recursive: true });
    const p = path.join(tmp, "services/ai-automation.mdx");
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("caseStudy: logistics-claims-automation", "caseStudy: missing-study"));
    const r = validateContent(tmp);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/services\/ai-automation\.mdx: caseStudy "missing-study" does not exist/);
  });
  it("allows a service to link a case study tagged with a different service", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "content-"));
    fs.cpSync(fixtures, tmp, { recursive: true });
    const p = path.join(tmp, "case-studies/logistics-claims-automation.mdx");
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace("service: ai-automation", "service: custom-ai-agents"));
    // custom-ai-agents service does not exist in fixtures, so the case study's own ref fails; add it
    fs.copyFileSync(path.join(tmp, "services/ai-automation.mdx"), path.join(tmp, "services/custom-ai-agents.mdx"));
    expect(validateContent(tmp)).toEqual({ ok: true });
  });
});
```

- [ ] **Step 6: Run to verify failure**

Run: `pnpm test tests/unit/content-load.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 7: Implement loader and validator**

```ts
// src/content/load.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { collections, type CollectionName, type Service, type Industry, type CaseStudy, type Insight } from "./schemas";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

type Loaded = { services: Service; industries: Industry; "case-studies": CaseStudy; insights: Insight };

export function loadCollection<N extends CollectionName>(name: N, rootDir: string = CONTENT_ROOT): Loaded[N][] {
  const dir = path.join(rootDir, name);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = collections[name].safeParse(data);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(`${name}/${file}: ${issue.path.join(".")} ${issue.message}`);
    }
    return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), body: content.trim() } as Loaded[N];
  });
}

export function getBySlug<N extends CollectionName>(name: N, slug: string, rootDir?: string): Loaded[N] | undefined {
  return loadCollection(name, rootDir).find((e) => e.slug === slug);
}

export const getServices = () => loadCollection("services");
export const getIndustries = () => loadCollection("industries");
export const getCaseStudies = () => loadCollection("case-studies");
export const getInsights = () =>
  loadCollection("insights").sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
```

```ts
// src/content/validate.ts
import { loadCollection, CONTENT_ROOT } from "./load";
import { siteConfig } from "@site-config";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateContent(rootDir: string = CONTENT_ROOT): ValidationResult {
  const errors: string[] = [];
  let services, industries, caseStudies, insights;
  try {
    services = loadCollection("services", rootDir);
    industries = loadCollection("industries", rootDir);
    caseStudies = loadCollection("case-studies", rootDir);
    insights = loadCollection("insights", rootDir);
  } catch (e) {
    return { ok: false, errors: [(e as Error).message] };
  }
  const serviceSlugs = new Set(services.map((s) => s.slug));
  const industrySlugs = new Set(industries.map((s) => s.slug));
  const caseSlugs = new Set(caseStudies.map((s) => s.slug));
  const founderIds = new Set(siteConfig.founders.map((f) => f.id));

  for (const s of services)
    if (!caseSlugs.has(s.caseStudy)) errors.push(`services/${s.slug}.mdx: caseStudy "${s.caseStudy}" does not exist`);
  for (const i of industries) {
    if (!caseSlugs.has(i.caseStudy)) errors.push(`industries/${i.slug}.mdx: caseStudy "${i.caseStudy}" does not exist`);
    for (const sv of i.services) if (!serviceSlugs.has(sv)) errors.push(`industries/${i.slug}.mdx: services "${sv}" does not exist`);
  }
  for (const c of caseStudies) {
    if (!industrySlugs.has(c.industry)) errors.push(`case-studies/${c.slug}.mdx: industry "${c.industry}" does not exist`);
    if (!serviceSlugs.has(c.service)) errors.push(`case-studies/${c.slug}.mdx: service "${c.service}" does not exist`);
  }
  for (const a of insights) {
    if (!founderIds.has(a.author)) errors.push(`insights/${a.slug}.mdx: author "${a.author}" is not in siteConfig.founders`);
    for (const sv of a.relatedServices) if (!serviceSlugs.has(sv)) errors.push(`insights/${a.slug}.mdx: relatedServices "${sv}" does not exist`);
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}
```

- [ ] **Step 8: Wire validation into the build**

Create `scripts/validate-content.ts`:

```ts
import { validateContent } from "../src/content/validate";
const r = validateContent();
if (!r.ok) { console.error("Content validation failed:\n" + r.errors.map((e) => "  - " + e).join("\n")); process.exit(1); }
console.log("Content OK");
```

Add `pnpm add -D tsx` and change the build script: `"build": "tsx scripts/validate-content.ts && next build"`. Note: `scripts/validate-content.ts` imports `@site-config` through `validate.ts`; tsx honours `tsconfig.json` paths, so this resolves.

- [ ] **Step 9: Run tests**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: content schemas, loader and cross-reference validation"
```

---

### Task 4: Seed content (6 services, 4 industries, 3 case studies, 3 insights)

**Files:**
- Create: `content/services/{ai-automation,llm-rag-integration,ai-strategy-readiness,custom-ai-agents,enterprise-ai-solutions,ai-talent-staffing}.mdx`
- Create: `content/industries/{logistics,retail,healthcare,financial-services}.mdx`
- Create: `content/case-studies/{logistics-claims-automation,retail-returns-assistant,healthcare-prior-auth-agents}.mdx`
- Create: `content/insights/{how-much-does-an-ai-pilot-cost,rag-vs-fine-tuning-enterprise-documents,ai-readiness-checklist}.mdx`
- Test: `tests/unit/content-real.test.ts`

**Interfaces:**
- Consumes: schemas from Task 3.
- Produces: the real collections `getServices()` etc. return; slugs listed above are relied on by every page task.

- [ ] **Step 1: Write failing test against real content**

```ts
// tests/unit/content-real.test.ts
import { describe, it, expect } from "vitest";
import { getServices, getIndustries, getCaseStudies, getInsights } from "@/content/load";
import { validateContent } from "@/content/validate";

describe("real content", () => {
  it("has the launch counts", () => {
    expect(getServices().map((s) => s.slug)).toEqual([
      "ai-automation", "ai-strategy-readiness", "ai-talent-staffing", "custom-ai-agents", "enterprise-ai-solutions", "llm-rag-integration",
    ]);
    expect(getIndustries()).toHaveLength(4);
    expect(getCaseStudies()).toHaveLength(3);
    expect(getInsights()).toHaveLength(3);
  });
  it("validates cross references", () => {
    expect(validateContent()).toEqual({ ok: true });
  });
  it("marks all launch case studies illustrative", () => {
    expect(getCaseStudies().every((c) => c.illustrative)).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/content-real.test.ts`
Expected: FAIL (empty collections).

- [ ] **Step 3: Write the six services**

Values per service (all share the fields shown in the first full file; vary only what the table lists):

| slug | title | targetQuery | caseStudy | diagram | timelineWeeks |
|---|---|---|---|---|---|
| ai-automation | AI Automation & Agentic Workflows | AI automation consulting | logistics-claims-automation | agent-loop | 8 |
| llm-rag-integration | LLM & RAG Integration | LLM integration services | retail-returns-assistant | rag-pipeline | 6 |
| ai-strategy-readiness | AI Strategy & Readiness | AI strategy for enterprises | healthcare-prior-auth-agents | engagement-model | 3 |
| custom-ai-agents | Custom AI Agents | build vs buy an AI agent | healthcare-prior-auth-agents | agent-loop | 10 |
| enterprise-ai-solutions | Enterprise AI Solutions | enterprise AI solutions | logistics-claims-automation | enterprise-stack | 16 |
| ai-talent-staffing | AI Talent & Staffing | AI engineers staffing | retail-returns-assistant | engagement-model | 2 |

Full first file (write the other five with the same shape and their own copy, problem, approach, deliverables and three FAQs each, written as specific, buyer-facing prose; no "leverage AI"):

```mdx
---
title: AI Automation & Agentic Workflows
summary: Agents that plan, act across your systems and verify their own output, built around one costly operational process.
targetQuery: AI automation consulting
problem: Operations teams lose thousands of hours a year to multi-step work that spans email, ERP, spreadsheets and a ticketing tool. Rules-based RPA breaks the moment an input changes shape.
approach:
  - "Map one process end to end with the people who run it, including the exceptions"
  - "Build an agent with explicit tool access, human checkpoints and an audit trail"
  - "Run it beside the current process for four weeks and measure against the baseline"
  - "Hand over with runbooks, monitoring and a retraining plan"
deliverables:
  - "Production agent deployed in your cloud"
  - "Baseline and post-pilot measurement report"
  - "Runbook, monitoring dashboard and escalation rules"
timelineWeeks: 8
caseStudy: logistics-claims-automation
faq:
  - q: How is this different from RPA?
    a: RPA replays clicks and breaks when a form changes. An agent reads the input, decides what to do, calls your systems through APIs and asks a human when it is unsure.
  - q: What does a pilot cost?
    a: Pilots start from the figure on this page and are fixed-price. The discovery sprint before it tells you the expected saving before you commit.
  - q: Which systems can the agent use?
    a: Anything with an API or a database, and anything a person can do in a browser as a last resort. Access is scoped per tool and logged.
diagram: agent-loop
seo:
  title: AI Automation Consulting for Enterprises
  description: Agentic workflow consulting that cuts operating cost. Fixed-price pilots in eight weeks, measured against your baseline.
---

## Who this is for

Heads of operations and finance leaders with a process that costs more than a team's salary and is too variable for RPA.

## What we build

An agent with a bounded job: read the inbound work, pull what it needs from your systems, make a decision with evidence, and route anything uncertain to a person. Every action is logged and reversible.

## What you get after eight weeks

A measured result against your baseline, a runbook your team owns, and a decision about scaling backed by numbers rather than a demo.
```

- [ ] **Step 4: Write the four industries**

| slug | title | targetQuery | caseStudy | services |
|---|---|---|---|---|
| logistics | Logistics & Supply Chain | AI consulting for logistics | logistics-claims-automation | [ai-automation, custom-ai-agents] |
| retail | Retail & E-commerce | AI consulting for retail | retail-returns-assistant | [llm-rag-integration, ai-automation] |
| healthcare | Healthcare | AI consulting for healthcare | healthcare-prior-auth-agents | [custom-ai-agents, ai-strategy-readiness] |
| financial-services | Financial Services | AI consulting for financial services | logistics-claims-automation | [enterprise-ai-solutions, ai-strategy-readiness] |

Each needs three or more `pains`, at least one `compliance` line (logistics: "Customs and carrier data residency"; retail: "PCI DSS scope for payment data"; healthcare: "HIPAA, PHI handling and BAA"; financial-services: "SOC 2, model risk management guidance"), three FAQs, and `seo` under the limits. Body: three short sections, "Where the cost hides", "What we have built", "Compliance notes".

- [ ] **Step 5: Write the three case studies**

| slug | title | industry | service | result | date |
|---|---|---|---|---|---|
| logistics-claims-automation | Claims handling cut from 4 days to 6 hours | logistics | ai-automation | claim cycle time, 94, %, reduction | 2026-06 |
| retail-returns-assistant | Returns desk answers 70% of tickets without a human | retail | llm-rag-integration | tickets resolved by assistant, 70, %, of monthly volume | 2026-05 |
| healthcare-prior-auth-agents | Prior authorisation drafted in 9 minutes, not 2 days | healthcare | custom-ai-agents | prior-auth drafting time, 92, %, reduction | 2026-08 |

All three: `illustrative: true`, `client: "Confidential [industry] company"`, a situation and built paragraph with real-sounding specifics (volumes, systems named generically), a quote attributed by role, `diagram: before-after` for retail and healthcare and `automation-flow` for logistics. Body: "Situation", "What was built", "Result", "What we would do differently".

- [ ] **Step 6: Write the three insights**

| slug | title | targetQuery | relatedServices |
|---|---|---|---|
| how-much-does-an-ai-pilot-cost | How much does an AI pilot cost in 2026? | how much does an AI pilot cost | [ai-strategy-readiness, ai-automation] |
| rag-vs-fine-tuning-enterprise-documents | RAG vs fine-tuning for enterprise documents | RAG vs fine-tuning | [llm-rag-integration] |
| ai-readiness-checklist | The AI readiness checklist we run before any pilot | AI readiness checklist | [ai-strategy-readiness] |

`author: founder-1`, `publishedAt`/`updatedAt` 2026-10-07, three FAQs, 600 to 900 words each with H2 sections and a stated point of view (e.g. "Most enterprise AI pilots fail because they start with a model, not a process").

- [ ] **Step 7: Run tests**

Run: `pnpm test`
Expected: all pass, including `content-real`.

- [ ] **Step 8: Commit**

```bash
git add content tests
git commit -m "content: seed services, industries, illustrative case studies and insights"
```

---

### Task 5: SEO library — metadata and JSON-LD builders

**Files:**
- Create: `src/lib/seo.ts`, `src/components/JsonLd.tsx`
- Test: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces:
  - `buildMetadata({ title, description, path, type? }): Metadata` — sets title, description, `alternates.canonical`, openGraph (url, title, description, type), twitter card.
  - `organizationJsonLd()`, `webSiteJsonLd()`, `serviceJsonLd(service)`, `articleJsonLd({ title, description, path, publishedAt, updatedAt, authorName })`, `faqJsonLd(faq)`, `personJsonLd(founder)`, `breadcrumbJsonLd([{ name, path }])`.
  - `absoluteUrl(path)`.
  - `<JsonLd data={object | object[]} />` renders `<script type="application/ld+json">`.

- [ ] **Step 1: Write failing tests**

```ts
// tests/unit/seo.test.ts
import { describe, it, expect } from "vitest";
import { buildMetadata, absoluteUrl, faqJsonLd, breadcrumbJsonLd, organizationJsonLd, serviceJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

describe("seo", () => {
  it("absoluteUrl joins domain and path", () => {
    expect(absoluteUrl("/services/ai-automation")).toBe(`${siteConfig.domain}/services/ai-automation`);
  });
  it("buildMetadata sets canonical and og url", () => {
    const m = buildMetadata({ title: "AI Automation Consulting", description: "x".repeat(60), path: "/services/ai-automation" });
    expect(m.alternates?.canonical).toBe("/services/ai-automation");
    expect((m.openGraph as { url?: string }).url).toBe(absoluteUrl("/services/ai-automation"));
    expect(m.title).toBe("AI Automation Consulting");
  });
  it("buildMetadata throws on over-length title", () => {
    expect(() => buildMetadata({ title: "x".repeat(61), description: "y".repeat(60), path: "/" })).toThrow(/60/);
  });
  it("faqJsonLd maps questions", () => {
    const ld = faqJsonLd([{ q: "Q?", a: "A." }]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("A.");
  });
  it("breadcrumbJsonLd numbers positions from 1", () => {
    const ld = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[1].item).toBe(absoluteUrl("/services"));
  });
  it("organizationJsonLd uses config", () => {
    expect(organizationJsonLd().name).toBe(siteConfig.name);
  });
  it("serviceJsonLd names provider", () => {
    const ld = serviceJsonLd({ slug: "ai-automation", title: "AI Automation", summary: "s".repeat(40) });
    expect(ld.provider.name).toBe(siteConfig.name);
    expect(ld.url).toBe(absoluteUrl("/services/ai-automation"));
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/seo.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/lib/seo.ts
import type { Metadata } from "next";
import { siteConfig } from "@site-config";

export const absoluteUrl = (path: string) => `${siteConfig.domain}${path.startsWith("/") ? path : `/${path}`}`;

export function buildMetadata(args: { title: string; description: string; path: string; type?: "website" | "article" }): Metadata {
  if (args.title.length > 60) throw new Error(`title must be 60 characters or fewer: "${args.title}"`);
  if (args.description.length > 155) throw new Error(`description must be 155 characters or fewer for ${args.path}`);
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: args.path },
    openGraph: { url: absoluteUrl(args.path), title: args.title, description: args.description, type: args.type ?? "website", siteName: siteConfig.name },
    twitter: { card: "summary_large_image", title: args.title, description: args.description },
  };
}

const ctx = "https://schema.org";

export const organizationJsonLd = () => ({
  "@context": ctx, "@type": "Organization", "@id": `${siteConfig.domain}/#org`,
  name: siteConfig.name, legalName: siteConfig.legalName, url: siteConfig.domain,
  description: siteConfig.positioning, sameAs: [siteConfig.social.linkedin], email: siteConfig.contactEmail,
  founder: siteConfig.founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.role })),
});

export const webSiteJsonLd = () => ({ "@context": ctx, "@type": "WebSite", url: siteConfig.domain, name: siteConfig.name, publisher: { "@id": `${siteConfig.domain}/#org` } });

export const serviceJsonLd = (s: { slug: string; title: string; summary: string }) => ({
  "@context": ctx, "@type": "Service", name: s.title, description: s.summary, serviceType: s.title,
  url: absoluteUrl(`/services/${s.slug}`), provider: { "@type": "Organization", "@id": `${siteConfig.domain}/#org`, name: siteConfig.name },
  areaServed: siteConfig.markets,
});

export const articleJsonLd = (a: { title: string; description: string; path: string; publishedAt: string; updatedAt: string; authorName: string }) => ({
  "@context": ctx, "@type": "Article", headline: a.title, description: a.description, url: absoluteUrl(a.path),
  datePublished: a.publishedAt, dateModified: a.updatedAt,
  author: { "@type": "Person", name: a.authorName }, publisher: { "@id": `${siteConfig.domain}/#org` },
  mainEntityOfPage: absoluteUrl(a.path),
});

export const faqJsonLd = (faq: Array<{ q: string; a: string }>) => ({
  "@context": ctx, "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const personJsonLd = (f: { name: string; role: string; bio: string; linkedin: string }) => ({
  "@context": ctx, "@type": "Person", name: f.name, jobTitle: f.role, description: f.bio, sameAs: [f.linkedin],
  worksFor: { "@id": `${siteConfig.domain}/#org` },
});

export const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  "@context": ctx, "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});
```

```tsx
// src/components/JsonLd.tsx
export function JsonLd({ data }: { data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test tests/unit/seo.test.ts`
Expected: PASS (7).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/components/JsonLd.tsx tests/unit/seo.test.ts
git commit -m "feat: metadata and JSON-LD builders"
```

---

### Task 6: Core UI components

**Files:**
- Create: `src/components/SectionHeading.tsx`, `src/components/CTABand.tsx`, `src/components/Breadcrumbs.tsx`, `src/components/IllustrativeBadge.tsx`, `src/components/FAQ.tsx`, `src/components/StatBlock.tsx`, `src/components/Quote.tsx`, `src/components/ProcessSteps.tsx`, `src/components/ServiceCard.tsx`, `src/components/IndustryCard.tsx`, `src/components/CaseStudyCard.tsx`, `src/components/ProofBar.tsx`, `src/components/Prose.tsx`, `src/components/Mdx.tsx`
- Create: `public/logos/{logo-1..6}.svg` (generic wordmark placeholders: a rounded rect and the text "Client 1" … "Client 6")
- Test: `tests/unit/components.test.tsx`

**Interfaces:**
- Consumes: `cn`, `formatMoney` (Task 2); `faqJsonLd` (Task 5); `CaseStudy, Service, Industry` types (Task 3).
- Produces:
  - `<SectionHeading eyebrow? title as?="h2" | "h1" children? />`
  - `<CTABand title? body? />` — primary link to `siteConfig.bookingUrl` with text "Book a 30-min AI audit", `data-cta="primary"`.
  - `<Breadcrumbs items={[{name,path}]} />` renders nav + BreadcrumbList JSON-LD.
  - `<IllustrativeBadge />` renders the text "Illustrative example".
  - `<FAQ items={[{q,a}]} />` renders `<details>` list + FAQPage JSON-LD.
  - `<StatBlock value label />`, `<Quote text name role />`.
  - `<ProcessSteps />` renders Discovery sprint / Pilot / Scale with "from" prices from config.
  - `<ServiceCard service />`, `<IndustryCard industry />`, `<CaseStudyCard caseStudy />` (shows badge when illustrative).
  - `<ProofBar />` renders logos + headline number from config.
  - `<Prose>` wrapper with typographic styles; `<Mdx source={string} />` async server component compiling MDX via `next-mdx-remote/rsc`.

- [ ] **Step 1: Write failing tests**

```tsx
// tests/unit/components.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { siteConfig } from "@site-config";

const cs = {
  slug: "logistics-claims-automation", title: "Claims handling cut", client: "Confidential logistics company",
  industry: "logistics", service: "ai-automation", situation: "s".repeat(40), built: "b".repeat(40),
  result: { metric: "claim cycle time", value: 94, unit: "%", period: "reduction", date: "2026-06" },
  quote: { text: "q".repeat(20), name: "n", role: "r" }, illustrative: true, diagram: "automation-flow" as const,
  seo: { title: "t".repeat(10), description: "d".repeat(50) }, body: "",
};

describe("components", () => {
  it("CTABand links to the booking url with primary marker", () => {
    render(<CTABand />);
    const a = screen.getByRole("link", { name: /book a 30-min ai audit/i });
    expect(a).toHaveAttribute("href", siteConfig.bookingUrl);
    expect(a).toHaveAttribute("data-cta", "primary");
  });
  it("FAQ renders questions and FAQPage json-ld", () => {
    const { container } = render(<FAQ items={[{ q: "How long?", a: "Eight weeks." }]} />);
    expect(screen.getByText("How long?")).toBeInTheDocument();
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('"FAQPage"');
  });
  it("CaseStudyCard shows illustrative badge and result", () => {
    render(<CaseStudyCard caseStudy={cs} />);
    expect(screen.getByText("Illustrative example")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /claims handling cut/i })).toHaveAttribute("href", "/case-studies/logistics-claims-automation");
  });
  it("ProcessSteps shows three stages with from-prices", () => {
    render(<ProcessSteps />);
    expect(screen.getByText("Discovery sprint")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("Scale")).toBeInTheDocument();
    expect(screen.getAllByText(/from \$/i)).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/components.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement components**

```tsx
// src/components/SectionHeading.tsx
import { cn } from "@/lib/utils";
export function SectionHeading({ eyebrow, title, as: As = "h2", children, className }: { eyebrow?: string; title: string; as?: "h1" | "h2"; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">{eyebrow}</p>}
      <As className={cn("font-display tracking-tight", As === "h1" ? "text-[length:var(--text-step-4)] leading-[1.02]" : "text-[length:var(--text-step-3)] leading-[1.08]")}>{title}</As>
      {children && <div className="prose-x mt-4 text-muted">{children}</div>}
    </div>
  );
}
```

```tsx
// src/components/CTABand.tsx
import { siteConfig } from "@site-config";
export function CTABand({ title = "See where agentic workflows would cut your operating cost", body = "A 30-minute audit: you describe one process, we tell you what it would cost to automate and what it would save." }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="container-x my-24">
      <div className="rounded-3xl border border-line bg-surface p-8 md:p-14">
        <h2 id="cta-title" className="font-display text-[length:var(--text-step-3)] leading-[1.08] tracking-tight">{title}</h2>
        <p className="prose-x mt-4 text-muted">{body}</p>
        <a href={siteConfig.bookingUrl} data-cta="primary" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Book a 30-min AI audit</a>
      </div>
    </section>
  );
}
```

```tsx
// src/components/Breadcrumbs.tsx
import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-8 text-sm text-muted">
      <ol className="flex flex-wrap gap-2">
        {all.map((it, i) => (
          <li key={it.path} className="flex gap-2">
            {i < all.length - 1 ? <Link href={it.path} className="hover:text-ink">{it.name}</Link> : <span aria-current="page" className="text-ink">{it.name}</span>}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </nav>
  );
}
```

```tsx
// src/components/IllustrativeBadge.tsx
export function IllustrativeBadge() {
  return <span className="inline-block rounded-full border border-line px-2 py-0.5 text-xs text-muted" title="Numbers are representative of engagements of this type">Illustrative example</span>;
}
```

```tsx
// src/components/FAQ.tsx
import { JsonLd } from "./JsonLd";
import { faqJsonLd } from "@/lib/seo";
export function FAQ({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <section className="container-x my-20">
      <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">Questions buyers ask</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
            <p className="prose-x mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}
```

```tsx
// src/components/StatBlock.tsx
export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[length:var(--text-step-4)] leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}
```

```tsx
// src/components/Quote.tsx
export function Quote({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <figure className="border-l-2 border-accent pl-6">
      <blockquote className="font-display text-[length:var(--text-step-2)] leading-snug">“{text}”</blockquote>
      <figcaption className="mt-3 text-sm text-muted">{name}, {role}</figcaption>
    </figure>
  );
}
```

```tsx
// src/components/ProcessSteps.tsx
import { siteConfig } from "@site-config";
import { formatMoney } from "@/lib/utils";
const steps = [
  { name: "Discovery sprint", weeks: "2 weeks", body: "We map one process, quantify the saving and write the pilot plan. You get a go/no-go number.", price: siteConfig.pricing.discoverySprint },
  { name: "Pilot", weeks: "6–8 weeks", body: "We build the agent, run it beside the current process and measure against the baseline.", price: siteConfig.pricing.pilot },
  { name: "Scale", weeks: "Quarterly", body: "We roll out across teams and regions, with monitoring and a retraining cadence.", price: siteConfig.pricing.scale },
];
export function ProcessSteps() {
  return (
    <section className="container-x my-20">
      <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">How an engagement runs</h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.name} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs text-muted">Step {i + 1} · {s.weeks}</p>
            <h3 className="mt-2 font-display text-xl">{s.name}</h3>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
            <p className="mt-4 text-sm font-medium">from {formatMoney(s.price, siteConfig.pricing.currency)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

```tsx
// src/components/CaseStudyCard.tsx
import Link from "next/link";
import type { CaseStudy } from "@/content/schemas";
import { IllustrativeBadge } from "./IllustrativeBadge";
export function CaseStudyCard({ caseStudy: c }: { caseStudy: CaseStudy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6">
      <p className="font-display text-[length:var(--text-step-3)] leading-none">{c.result.value}{c.result.unit}</p>
      <p className="mt-1 text-sm text-muted">{c.result.metric} {c.result.period} · {c.result.date}</p>
      <h3 className="mt-4 text-lg font-medium"><Link href={`/case-studies/${c.slug}`} className="hover:underline">{c.title}</Link></h3>
      <p className="mt-1 text-sm text-muted">{c.client}</p>
      {c.illustrative && <div className="mt-4"><IllustrativeBadge /></div>}
    </article>
  );
}
```

`ServiceCard` and `IndustryCard` follow the same shape: a link card with `title`, `summary`, and `targetQuery` as a muted eyebrow, linking to `/services/${slug}` and `/industries/${slug}`.

```tsx
// src/components/ProofBar.tsx
import { siteConfig } from "@site-config";
import { StatBlock } from "./StatBlock";
export function ProofBar() {
  return (
    <section aria-label="Proof" className="container-x my-16 grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <StatBlock value={siteConfig.headlineNumber.value} label={siteConfig.headlineNumber.label} />
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-70">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <li key={n}><img src={`/logos/logo-${n}.svg`} alt={`Client ${n} logo placeholder`} width={96} height={28} loading="lazy" /></li>
        ))}
      </ul>
    </section>
  );
}
```

```tsx
// src/components/Prose.tsx
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-x [&_h2]:font-display [&_h2]:text-[length:var(--text-step-2)] [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:mt-6 [&_h3]:font-medium [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline">{children}</div>;
}
```

```tsx
// src/components/Mdx.tsx
import { compileMDX } from "next-mdx-remote/rsc";
import { Prose } from "./Prose";
export async function Mdx({ source }: { source: string }) {
  const { content } = await compileMDX({ source });
  return <Prose>{content}</Prose>;
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: core UI components"
```

---

### Task 7: 2D diagram library and registry

**Files:**
- Create: `src/components/diagrams/Diagram.tsx`, `src/components/diagrams/Reveal.tsx`, `src/components/diagrams/RagPipelineDiagram.tsx`, `AgentLoopDiagram.tsx`, `AutomationFlowDiagram.tsx`, `EnterpriseStackDiagram.tsx`, `EngagementModelDiagram.tsx`, `BeforeAfterDiagram.tsx`, `src/components/diagrams/index.tsx`
- Test: `tests/unit/diagrams.test.tsx`

**Interfaces:**
- Consumes: `DIAGRAM_IDS, DiagramId` (Task 3).
- Produces: `diagrams: Record<DiagramId, { Component: () => JSX.Element; caption: string; description: string }>` and `<DiagramById id />` which renders the component inside `<Diagram>` with its caption and an sr-only description.

- [ ] **Step 1: Write failing test**

```tsx
// tests/unit/diagrams.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { diagrams, DiagramById } from "@/components/diagrams";
import { DIAGRAM_IDS } from "@/content/schemas";

describe("diagrams", () => {
  it("has a component for every diagram id", () => {
    for (const id of DIAGRAM_IDS) expect(diagrams[id]).toBeDefined();
  });
  it("renders an svg with an accessible description", () => {
    const { container } = render(<DiagramById id="rag-pipeline" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("img", { name: /retrieval-augmented generation/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test tests/unit/diagrams.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement frame, reveal, and the RAG diagram in full**

```tsx
// src/components/diagrams/Reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <g>{children}</g>;
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.g>
  );
}
```

```tsx
// src/components/diagrams/Diagram.tsx
export function Diagram({ title, description, caption, viewBox, children }: { title: string; description: string; caption: string; viewBox: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <figure className="my-10">
      <svg viewBox={viewBox} role="img" aria-labelledby={`${id}-t ${id}-d`} className="w-full text-ink" fontFamily="var(--font-sans)" fontSize="12">
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{description}</desc>
        {children}
      </svg>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function Box({ x, y, w = 120, h = 48, label, sub }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={10} fill="var(--color-surface)" stroke="var(--color-line)" />
      <text x={w / 2} y={sub ? h / 2 - 4 : h / 2 + 4} textAnchor="middle" fill="currentColor" fontWeight={500}>{label}</text>
      {sub && <text x={w / 2} y={h / 2 + 12} textAnchor="middle" fill="var(--color-muted)" fontSize="10">{sub}</text>}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g stroke="var(--color-diagram)" fill="var(--color-diagram)">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.5} />
      <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} transform={`rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI} ${x2} ${y2})`} />
    </g>
  );
}
```

```tsx
// src/components/diagrams/RagPipelineDiagram.tsx
import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
const stages = ["Ingest", "Chunk", "Embed", "Store", "Retrieve", "Generate"];
const subs = ["PDF, email, tickets", "Semantic sections", "Vector per chunk", "Vector index", "Top-k by query", "Grounded answer"];
export function RagPipelineDiagram() {
  return (
    <Diagram title="Retrieval-augmented generation pipeline" description="Six stages left to right: documents are ingested, split into chunks, embedded into vectors, stored in an index, retrieved by a query, and used to generate a grounded answer with citations." caption="How a RAG system turns your documents into answers with citations." viewBox="0 0 860 140">
      {stages.map((s, i) => (
        <Reveal key={s} delay={i * 0.08}>
          <Box x={10 + i * 142} y={40} label={s} sub={subs[i]} />
          {i < stages.length - 1 && <Arrow x1={130 + i * 142} y1={64} x2={152 + i * 142} y2={64} />}
        </Reveal>
      ))}
      <Reveal delay={0.6}><Box x={10 + 4 * 142} y={100} w={120} h={28} label="Query" /><Arrow x1={70 + 4 * 142} y1={100} x2={70 + 4 * 142} y2={90} /></Reveal>
    </Diagram>
  );
}
```

Implement the other five with the same primitives:

- `AgentLoopDiagram`: six boxes on a ring (goal, plan, call tools, observe, verify, done) with arrows clockwise and a "Human checkpoint" box attached to verify. viewBox `0 0 520 420`.
- `AutomationFlowDiagram`: trigger → three steps → decision diamond (drawn with a rotated rect) → two outcomes (auto-complete, hand to person). viewBox `0 0 860 220`.
- `EnterpriseStackDiagram`: five full-width horizontal layers stacked (Applications, Orchestration & agents, Models, Data, Governance & security as a bracket on the right). viewBox `0 0 860 300`.
- `EngagementModelDiagram`: three boxes with weeks and "from $" sub text read from `siteConfig.pricing`. viewBox `0 0 860 120`.
- `BeforeAfterDiagram`: two columns; left "Before" with four manual steps and "4 days", right "After" with agent + human check and "6 hours"; props `before: string[]; after: string[]; beforeLabel; afterLabel` with defaults. viewBox `0 0 860 260`.

```ts
// src/components/diagrams/index.tsx
import type { DiagramId } from "@/content/schemas";
import { RagPipelineDiagram } from "./RagPipelineDiagram";
import { AgentLoopDiagram } from "./AgentLoopDiagram";
import { AutomationFlowDiagram } from "./AutomationFlowDiagram";
import { EnterpriseStackDiagram } from "./EnterpriseStackDiagram";
import { EngagementModelDiagram } from "./EngagementModelDiagram";
import { BeforeAfterDiagram } from "./BeforeAfterDiagram";

export const diagrams: Record<DiagramId, { Component: () => React.JSX.Element }> = {
  "rag-pipeline": { Component: RagPipelineDiagram },
  "agent-loop": { Component: AgentLoopDiagram },
  "automation-flow": { Component: AutomationFlowDiagram },
  "enterprise-stack": { Component: EnterpriseStackDiagram },
  "engagement-model": { Component: EngagementModelDiagram },
  "before-after": { Component: BeforeAfterDiagram },
};

export function DiagramById({ id }: { id: DiagramId }) {
  const { Component } = diagrams[id];
  return <Component />;
}
```

(Each diagram carries its own title, description and caption inside `<Diagram>`, so the registry only needs the component.)

- [ ] **Step 4: Run tests**

Run: `pnpm test tests/unit/diagrams.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/diagrams tests/unit/diagrams.test.tsx
git commit -m "feat: 2D system diagram library"
```

---

### Task 8: Home page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/Hero.tsx`
- Test: covered by Playwright in Task 16; unit test `tests/unit/hero.test.tsx`

**Interfaces:**
- Consumes: `ProofBar, CaseStudyCard, ServiceCard, ProcessSteps, CTABand, JsonLd, SectionHeading`, `getCaseStudies, getServices`, `organizationJsonLd, webSiteJsonLd, buildMetadata`.
- Produces: `<Hero />` with an `aside` slot `visual?: React.ReactNode` (Task 14 drops the 3D scene in). Only one `<h1>` on the page: the Hero's.

- [ ] **Step 1: Failing test**

```tsx
// tests/unit/hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "@/components/Hero";
import { siteConfig } from "@site-config";

it("Hero renders h1 with tagline and primary CTA", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(siteConfig.tagline);
  expect(screen.getByRole("link", { name: /book a 30-min ai audit/i })).toHaveAttribute("href", siteConfig.bookingUrl);
});
```

- [ ] **Step 2: Run to verify failure** — `pnpm test tests/unit/hero.test.tsx` → FAIL.

- [ ] **Step 3: Implement Hero and page**

```tsx
// src/components/Hero.tsx
import Link from "next/link";
import { siteConfig } from "@site-config";
export function Hero({ visual }: { visual?: React.ReactNode }) {
  return (
    <section className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">Agentic AI consulting</p>
        <h1 className="font-display text-[length:var(--text-step-5)] leading-[0.98] tracking-tight">{siteConfig.tagline}</h1>
        <p className="prose-x mt-6 text-lg text-muted">{siteConfig.positioning} Fixed-price pilots, measured against your baseline, in eight weeks.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={siteConfig.bookingUrl} data-cta="primary" className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Book a 30-min AI audit</a>
          <Link href="/case-studies" className="rounded-full border border-line px-6 py-3 font-medium">See the case studies</Link>
        </div>
      </div>
      <div className="relative aspect-square md:aspect-[4/5]">{visual}</div>
    </section>
  );
}
```

```tsx
// src/app/page.tsx
import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { SectionHeading } from "@/components/SectionHeading";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { getCaseStudies, getServices } from "@/content/load";
import { buildMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: `${siteConfig.name} — ${siteConfig.tagline}`.slice(0, 60), description: siteConfig.positioning, path: "/" });

export default function Home() {
  const caseStudies = getCaseStudies();
  const services = getServices();
  return (
    <main>
      <Hero />
      <ProofBar />
      <section className="container-x my-20">
        <SectionHeading eyebrow="Proof" title="Three processes, three measured results">We publish the number, the unit and the date. Illustrative studies are labelled.</SectionHeading>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{caseStudies.map((c) => <CaseStudyCard key={c.slug} caseStudy={c} />)}</div>
      </section>
      <section className="container-x my-20">
        <SectionHeading eyebrow="Services" title="One costly process at a time" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      </section>
      <ProcessSteps />
      <CTABand />
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
    </main>
  );
}
```

- [ ] **Step 4: Run tests and build** — `pnpm test && pnpm build` → pass; `/` static.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: home page"`

---

### Task 9: Services index and detail pages

**Files:**
- Create: `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getServices, getBySlug`, `DiagramById`, `CaseStudyCard`, `FAQ`, `ProcessSteps`, `CTABand`, `Breadcrumbs`, `JsonLd`, `Mdx`, `buildMetadata`, `serviceJsonLd`.
- Produces: routes `/services` and `/services/[slug]` with `generateStaticParams`.

- [ ] **Step 1: Implement index**

```tsx
// src/app/services/page.tsx
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { getServices } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI consulting services for operations leaders", description: "Six services, each built around one costly process: automation, LLM and RAG integration, strategy, custom agents, enterprise solutions and staffing.", path: "/services" });

export default function ServicesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Services" title="Pick the process. We bring the agents.">Every engagement starts with one measurable process and ends with a number you can take to the board.</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{getServices().map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      </section>
      <CTABand />
    </main>
  );
}
```

- [ ] **Step 2: Implement detail**

```tsx
// src/app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { DiagramById } from "@/components/diagrams";
import { FAQ } from "@/components/FAQ";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { Mdx } from "@/components/Mdx";
import { getServices, getBySlug } from "@/content/load";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return getServices().map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getBySlug("services", slug);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getBySlug("services", slug);
  if (!s) notFound();
  const cs = getBySlug("case-studies", s.caseStudy);
  return (
    <main>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: s.title, path: `/services/${s.slug}` }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow={s.targetQuery} title={s.title}>{s.summary}</SectionHeading>
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-[length:var(--text-step-2)]">The problem</h2>
            <p className="prose-x mt-3 text-muted">{s.problem}</p>
            <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Our approach</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">{s.approach.map((a) => <li key={a}>{a}</li>)}</ol>
            <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Deliverables</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
            <p className="mt-6 text-sm text-muted">Typical timeline: {s.timelineWeeks} weeks</p>
          </div>
          <div>{cs && <CaseStudyCard caseStudy={cs} />}</div>
        </div>
        <DiagramById id={s.diagram} />
        <Mdx source={s.body} />
      </section>
      <ProcessSteps />
      <FAQ items={s.faq} />
      <CTABand />
      <JsonLd data={serviceJsonLd(s)} />
    </main>
  );
}
```

- [ ] **Step 3: Build** — `pnpm build` → six `/services/[slug]` paths listed as SSG.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: services pages"`

---

### Task 10: Industries and case-study pages

**Files:**
- Create: `src/app/industries/page.tsx`, `src/app/industries/[slug]/page.tsx`, `src/app/case-studies/page.tsx`, `src/app/case-studies/[slug]/page.tsx`

**Interfaces:** same consumers as Task 9 plus `Quote, StatBlock, IllustrativeBadge, articleJsonLd`.

- [ ] **Step 1: Industries index** — same shape as services index: h1 "AI consulting by industry", `IndustryCard` grid, metadata title "AI consulting by industry: logistics, retail, healthcare, finance" (≤60), description ≤155, Breadcrumbs, CTABand.

- [ ] **Step 2: Industry detail**

```tsx
// src/app/industries/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { Mdx } from "@/components/Mdx";
import { getIndustries, getBySlug, getServices } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return getIndustries().map((i) => ({ slug: i.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const i = getBySlug("industries", slug);
  return i ? buildMetadata({ title: i.seo.title, description: i.seo.description, path: `/industries/${slug}` }) : {};
}
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const i = getBySlug("industries", slug); if (!i) notFound();
  const cs = getBySlug("case-studies", i.caseStudy);
  const services = getServices().filter((s) => i.services.includes(s.slug));
  return (
    <main>
      <Breadcrumbs items={[{ name: "Industries", path: "/industries" }, { name: i.title, path: `/industries/${i.slug}` }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow={i.targetQuery} title={i.title}>{i.summary}</SectionHeading>
        <div className="mt-12 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-display text-[length:var(--text-step-2)]">Where the cost hides</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">{i.pains.map((p) => <li key={p}>{p}</li>)}</ul>
            <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Compliance notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">{i.compliance.map((c) => <li key={c}>{c}</li>)}</ul>
            <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Relevant services</h2>
            <ul className="mt-3 space-y-2">{services.map((s) => <li key={s.slug}><Link className="text-accent underline" href={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul>
          </div>
          <div>{cs && <CaseStudyCard caseStudy={cs} />}</div>
        </div>
        <Mdx source={i.body} />
      </section>
      <FAQ items={i.faq} />
      <CTABand />
    </main>
  );
}
```

- [ ] **Step 3: Case studies index** — h1 "AI case studies with numbers, units and dates", grid of `CaseStudyCard`, a one-line note "Studies marked illustrative are representative of engagements of this type; real numbers replace them as clients approve publication."

- [ ] **Step 4: Case study detail**

```tsx
// src/app/case-studies/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatBlock } from "@/components/StatBlock";
import { Quote } from "@/components/Quote";
import { IllustrativeBadge } from "@/components/IllustrativeBadge";
import { DiagramById } from "@/components/diagrams";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { Mdx } from "@/components/Mdx";
import { getCaseStudies, getBySlug } from "@/content/load";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const dynamicParams = false;
export function generateStaticParams() { return getCaseStudies().map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = getBySlug("case-studies", slug);
  return c ? buildMetadata({ title: c.seo.title, description: c.seo.description, path: `/case-studies/${slug}`, type: "article" }) : {};
}
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const c = getBySlug("case-studies", slug); if (!c) notFound();
  const industry = getBySlug("industries", c.industry); const service = getBySlug("services", c.service);
  return (
    <main>
      <Breadcrumbs items={[{ name: "Case studies", path: "/case-studies" }, { name: c.title, path: `/case-studies/${c.slug}` }]} />
      <section className="container-x py-12">
        {c.illustrative && <div className="mb-4"><IllustrativeBadge /></div>}
        <SectionHeading as="h1" eyebrow={c.client} title={c.title} />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <StatBlock value={`${c.result.value}${c.result.unit}`} label={`${c.result.metric} ${c.result.period}, ${c.result.date}`} />
          <div className="md:col-span-2 text-sm text-muted">
            {industry && <p>Industry: <Link className="text-accent underline" href={`/industries/${industry.slug}`}>{industry.title}</Link></p>}
            {service && <p>Service: <Link className="text-accent underline" href={`/services/${service.slug}`}>{service.title}</Link></p>}
          </div>
        </div>
        <h2 className="mt-12 font-display text-[length:var(--text-step-2)]">Situation</h2>
        <p className="prose-x mt-3">{c.situation}</p>
        <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">What was built</h2>
        <p className="prose-x mt-3">{c.built}</p>
        <DiagramById id={c.diagram} />
        <div className="my-12"><Quote text={c.quote.text} name={c.quote.name} role={c.quote.role} /></div>
        <Mdx source={c.body} />
      </section>
      <CTABand />
      <JsonLd data={articleJsonLd({ title: c.title, description: c.seo.description, path: `/case-studies/${c.slug}`, publishedAt: `${c.result.date}-01`, updatedAt: `${c.result.date}-01`, authorName: siteConfig.name })} />
    </main>
  );
}
```

- [ ] **Step 5: Build** — `pnpm build` → 4 industry and 3 case-study static paths.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: industries and case study pages"`

---

### Task 11: Insights pages

**Files:**
- Create: `src/app/insights/page.tsx`, `src/app/insights/[slug]/page.tsx`

- [ ] **Step 1: Index** — h1 "Answers to the questions a VP types at 11pm", list of articles (title link, summary, date), a "Subscribe" form that posts to `/api/leads` with `source: "subscribe"` (the route exists after Task 13; until then the form's `action` attribute points there and submits natively). Metadata title "AI insights for operations and finance leaders".

- [ ] **Step 2: Detail**

```tsx
// src/app/insights/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { Mdx } from "@/components/Mdx";
import { getInsights, getBySlug, getServices } from "@/content/load";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const dynamicParams = false;
export function generateStaticParams() { return getInsights().map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const a = getBySlug("insights", slug);
  return a ? buildMetadata({ title: a.seo.title, description: a.seo.description, path: `/insights/${slug}`, type: "article" }) : {};
}
export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const a = getBySlug("insights", slug); if (!a) notFound();
  const author = siteConfig.founders.find((f) => f.id === a.author)!;
  const related = getServices().filter((s) => a.relatedServices.includes(s.slug));
  return (
    <main>
      <Breadcrumbs items={[{ name: "Insights", path: "/insights" }, { name: a.title, path: `/insights/${a.slug}` }]} />
      <article className="container-x py-12">
        <SectionHeading as="h1" eyebrow={a.targetQuery} title={a.title}>{a.summary}</SectionHeading>
        <p className="mt-4 text-sm text-muted">{author.name}, {author.role} · Updated {a.updatedAt}</p>
        <div className="mt-10"><Mdx source={a.body} /></div>
        <aside className="mt-12 rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm font-medium">Related services</p>
          <ul className="mt-2 space-y-1 text-sm">{related.map((s) => <li key={s.slug}><Link className="text-accent underline" href={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul>
        </aside>
      </article>
      <FAQ items={a.faq} />
      <CTABand />
      <JsonLd data={articleJsonLd({ title: a.title, description: a.seo.description, path: `/insights/${a.slug}`, publishedAt: a.publishedAt, updatedAt: a.updatedAt, authorName: author.name })} />
    </main>
  );
}
```

- [ ] **Step 3: Build and commit** — `pnpm build && git add -A && git commit -m "feat: insights pages"`

---

### Task 12: About, Contact, legal, not-found, error, sitemap, robots, OG image

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`
- Test: `tests/unit/sitemap.test.ts`

**Interfaces:**
- Produces: `sitemap()` default export listing every static route and every collection entry; `robots()` allowing all and pointing at the sitemap.

- [ ] **Step 1: Failing sitemap test**

```ts
// tests/unit/sitemap.test.ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { absoluteUrl } from "@/lib/seo";

describe("sitemap", () => {
  it("includes core pages and every content entry", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of ["/", "/services", "/industries", "/case-studies", "/insights", "/about", "/contact", "/tools/ai-roi-calculator", "/services/ai-automation", "/industries/healthcare", "/case-studies/logistics-claims-automation", "/insights/ai-readiness-checklist"]) {
      expect(urls).toContain(absoluteUrl(p));
    }
    expect(urls).not.toContain(absoluteUrl("/api/leads"));
  });
});
```

- [ ] **Step 2: Run to verify failure** — FAIL.

- [ ] **Step 3: Implement sitemap and robots**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getServices, getIndustries, getCaseStudies, getInsights } from "@/content/load";
import { absoluteUrl } from "@/lib/seo";

export const STATIC_ROUTES = ["/", "/services", "/industries", "/case-studies", "/insights", "/tools/ai-roi-calculator", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries = [
    ...STATIC_ROUTES.map((p) => ({ url: absoluteUrl(p), lastModified: now })),
    ...getServices().map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now })),
    ...getIndustries().map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: now })),
    ...getCaseStudies().map((c) => ({ url: absoluteUrl(`/case-studies/${c.slug}`), lastModified: now })),
    ...getInsights().map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: new Date(a.updatedAt) })),
  ];
  return entries;
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: absoluteUrl("/sitemap.xml") };
}
```

- [ ] **Step 4: Pages**

- `about/page.tsx`: h1 "Why this company exists", founder story (three paragraphs of placeholder-free copy written around the positioning), team list from `siteConfig.founders` with a photo slot (`<div className="aspect-[4/5] rounded-2xl bg-line" role="img" aria-label="Photo of {name}">`), `JsonLd` with `personJsonLd` for each founder, CTA "Meet the team" linking to `/contact`.
- `contact/page.tsx`: h1 "Pick a slot", `<iframe src={siteConfig.bookingUrl} title="Book a 30-minute AI audit" className="h-[720px] w-full rounded-2xl border border-line" loading="lazy" />`, and a four-field form (name, work email, company, "one process you would automate") posting to `/api/leads` with `source: "contact"`.
- `privacy/page.tsx`, `terms/page.tsx`: h1 and short real text covering data collected (email, form fields, analytics if enabled), retention, contact email.
- `not-found.tsx`: h1 "That page does not exist", links to services and case studies, `<CTABand />`.
- `error.tsx`: `"use client"`, h1 "Something went wrong", reset button, `<CTABand />`.

- [ ] **Step 5: OG image**

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { siteConfig } from "@site-config";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OgImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f7f4ee", color: "#141414", fontFamily: "serif" }}>
      <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#5c5a55" }}>{siteConfig.name}</div>
      <div style={{ fontSize: 80, lineHeight: 1, letterSpacing: -2 }}>{siteConfig.tagline}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 28, color: "#0f5c4a" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#0f5c4a" }} />{siteConfig.headlineNumber.value} {siteConfig.headlineNumber.label}
      </div>
    </div>,
    size,
  );
}
```

This root image is the fallback for every route. For per-page images (spec §8), add `opengraph-image.tsx` inside `src/app/services/[slug]/`, `industries/[slug]/`, `case-studies/[slug]/` and `insights/[slug]/` that takes `{ params }`, loads the entry with `getBySlug`, and renders the same layout with the entry's `title` in place of the tagline and its `targetQuery` (or `result.value + unit` for case studies) in place of the headline number. Export `generateStaticParams` from each exactly as the sibling `page.tsx` does.

- [ ] **Step 6: Run tests and build** — `pnpm test && pnpm build` → pass; `/sitemap.xml`, `/robots.txt`, `/opengraph-image` and one `opengraph-image` per collection entry generated.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: about, contact, legal, error pages, sitemap, robots, og image"`

---

### Task 13: ROI calculator, lead capture API and analytics hook

**Files:**
- Create: `src/lib/roi.ts`, `src/lib/leads/provider.ts`, `src/lib/analytics.ts`, `src/app/api/leads/route.ts`, `src/components/roi/ROICalculator.tsx`, `src/components/roi/LeadGate.tsx`, `src/app/tools/ai-roi-calculator/page.tsx`
- Test: `tests/unit/roi.test.ts`, `tests/unit/leads-route.test.ts`, `tests/unit/analytics.test.ts`

**Interfaces:**
- Produces:
  - `calculateRoi(input: RoiInput): RoiResult` where `RoiInput = { headcount: number; hoursPerWeek: number; hourlyCost: number; automationShare: number /* 0..1 */ }` and `RoiResult = { annualHours: number; annualHoursSaved: number; annualCostSaved: number; paybackMonths: number | null }`. Payback is against `siteConfig.pricing.pilot`; `null` when savings are zero.
  - `LeadSchema` (Zod): `{ email: string(email); name?: string; company?: string; message?: string; source: "roi" | "contact" | "subscribe"; payload?: Record<string, unknown> }`.
  - `saveLead(lead): Promise<void>` from `leads/provider.ts`; default provider appends JSON lines to `.leads/leads.jsonl` in development and logs in production; `LeadProvider` interface `{ save(lead: Lead): Promise<void> }`.
  - `POST /api/leads` → 200 `{ ok: true }` or 400 `{ ok: false, errors: { field: message } }`; 500 `{ ok: false, errors: { _: "Could not save" } }`.
  - `track(event: AnalyticsEvent, props?: Record<string, string | number>)`; `AnalyticsEvent = "page_view" | "cta_click" | "booking_opened" | "tool_used" | "lead_captured"`. No-op when `siteConfig.analytics.provider === "none"`.

- [ ] **Step 1: Failing ROI tests**

```ts
// tests/unit/roi.test.ts
import { describe, it, expect } from "vitest";
import { calculateRoi } from "@/lib/roi";
import { siteConfig } from "@site-config";

describe("calculateRoi", () => {
  it("computes savings and payback", () => {
    const r = calculateRoi({ headcount: 10, hoursPerWeek: 10, hourlyCost: 50, automationShare: 0.6 });
    expect(r.annualHours).toBe(10 * 10 * 48);
    expect(r.annualHoursSaved).toBe(10 * 10 * 48 * 0.6);
    expect(r.annualCostSaved).toBe(10 * 10 * 48 * 0.6 * 50);
    expect(r.paybackMonths).toBeCloseTo((siteConfig.pricing.pilot / r.annualCostSaved) * 12, 5);
  });
  it("returns zero and null payback for zero headcount", () => {
    const r = calculateRoi({ headcount: 0, hoursPerWeek: 10, hourlyCost: 50, automationShare: 0.6 });
    expect(r.annualCostSaved).toBe(0);
    expect(r.paybackMonths).toBeNull();
    expect(Number.isFinite(r.annualHoursSaved)).toBe(true);
  });
  it("clamps automationShare to 0..1 and negatives to 0", () => {
    const r = calculateRoi({ headcount: -5, hoursPerWeek: 10, hourlyCost: 50, automationShare: 4 });
    expect(r.annualCostSaved).toBe(0);
    const r2 = calculateRoi({ headcount: 1, hoursPerWeek: 1, hourlyCost: 1, automationShare: 4 });
    expect(r2.annualHoursSaved).toBe(48);
  });
});
```

- [ ] **Step 2: Run to verify failure** — FAIL.

- [ ] **Step 3: Implement `roi.ts`**

```ts
// src/lib/roi.ts
import { siteConfig } from "@site-config";
export type RoiInput = { headcount: number; hoursPerWeek: number; hourlyCost: number; automationShare: number };
export type RoiResult = { annualHours: number; annualHoursSaved: number; annualCostSaved: number; paybackMonths: number | null };
const WEEKS = 48;
const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
export function calculateRoi(i: RoiInput): RoiResult {
  const headcount = nonNeg(i.headcount), hours = nonNeg(i.hoursPerWeek), cost = nonNeg(i.hourlyCost);
  const share = Math.min(1, nonNeg(i.automationShare));
  const annualHours = headcount * hours * WEEKS;
  const annualHoursSaved = annualHours * share;
  const annualCostSaved = annualHoursSaved * cost;
  const paybackMonths = annualCostSaved > 0 ? (siteConfig.pricing.pilot / annualCostSaved) * 12 : null;
  return { annualHours, annualHoursSaved, annualCostSaved, paybackMonths };
}
```

- [ ] **Step 4: Failing lead route tests**

```ts
// tests/unit/leads-route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/leads/provider", () => ({ saveLead: vi.fn(async () => undefined) }));
import { POST } from "@/app/api/leads/route";
import { saveLead } from "@/lib/leads/provider";

const req = (body: unknown) => new Request("http://localhost/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) });

describe("POST /api/leads", () => {
  beforeEach(() => vi.mocked(saveLead).mockClear());
  it("saves a valid lead", async () => {
    const res = await POST(req({ email: "a@b.co", source: "roi", payload: { headcount: 3 } }));
    expect(res.status).toBe(200);
    expect(saveLead).toHaveBeenCalledOnce();
  });
  it("rejects a bad email with field errors", async () => {
    const res = await POST(req({ email: "nope", source: "roi" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors.email).toBeDefined();
    expect(saveLead).not.toHaveBeenCalled();
  });
  it("rejects an empty or non-JSON body with 400, no stack", async () => {
    const res = await POST(req("not json"));
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).not.toMatch(/at .*\.ts/);
  });
  it("returns 500 without leaking provider errors", async () => {
    vi.mocked(saveLead).mockRejectedValueOnce(new Error("hubspot token invalid"));
    const res = await POST(req({ email: "a@b.co", source: "contact" }));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("hubspot");
  });
});
```

- [ ] **Step 5: Implement provider and route**

```ts
// src/lib/leads/provider.ts
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

export const LeadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  source: z.enum(["roi", "contact", "subscribe"]),
  payload: z.record(z.string(), z.unknown()).optional(),
});
export type Lead = z.infer<typeof LeadSchema>;
export interface LeadProvider { save(lead: Lead & { receivedAt: string }): Promise<void> }

const fileProvider: LeadProvider = {
  async save(lead) {
    const dir = path.join(process.cwd(), ".leads");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n");
  },
};
const logProvider: LeadProvider = { async save(lead) { console.log("[lead]", JSON.stringify(lead)); } };

export const provider: LeadProvider = process.env.NODE_ENV === "production" ? logProvider : fileProvider;
export async function saveLead(lead: Lead): Promise<void> {
  await provider.save({ ...lead, receivedAt: new Date().toISOString() });
}
```

Add `.leads/` to `.gitignore`.

```ts
// src/app/api/leads/route.ts
import { NextResponse } from "next/server";
import { LeadSchema, saveLead } from "@/lib/leads/provider";

export async function POST(req: Request) {
  let json: unknown;
  try { json = await req.json(); } catch { return NextResponse.json({ ok: false, errors: { _: "Body must be JSON" } }, { status: 400 }); }
  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".") || "_"] = i.message;
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }
  try { await saveLead(parsed.data); } catch (e) {
    console.error("lead save failed", e);
    return NextResponse.json({ ok: false, errors: { _: "Could not save" } }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Failing analytics test and implementation**

```ts
// tests/unit/analytics.test.ts
import { describe, it, expect, vi } from "vitest";
import { track, _setProviderForTests } from "@/lib/analytics";
describe("track", () => {
  it("is a no-op by default and does not throw", () => { expect(() => track("cta_click", { path: "/" })).not.toThrow(); });
  it("forwards to an injected provider", () => {
    const spy = vi.fn(); _setProviderForTests({ send: spy });
    track("lead_captured", { source: "roi" });
    expect(spy).toHaveBeenCalledWith("lead_captured", { source: "roi" });
  });
});
```

```ts
// src/lib/analytics.ts
import { siteConfig } from "@site-config";
export type AnalyticsEvent = "page_view" | "cta_click" | "booking_opened" | "tool_used" | "lead_captured";
type Props = Record<string, string | number>;
interface Provider { send(event: AnalyticsEvent, props?: Props): void }
const noop: Provider = { send() {} };
const plausible: Provider = { send(e, p) { (globalThis as { plausible?: (e: string, o?: { props?: Props }) => void }).plausible?.(e, { props: p }); } };
const ga4: Provider = { send(e, p) { (globalThis as { gtag?: (...a: unknown[]) => void }).gtag?.("event", e, p); } };
let provider: Provider = siteConfig.analytics.provider === "plausible" ? plausible : siteConfig.analytics.provider === "ga4" ? ga4 : noop;
export function track(event: AnalyticsEvent, props?: Props) { try { provider.send(event, props); } catch { /* never break the page */ } }
export function _setProviderForTests(p: Provider) { provider = p; }
```

- [ ] **Step 7: Calculator UI and page**

```tsx
// src/components/roi/ROICalculator.tsx
"use client";
import { useState } from "react";
import { calculateRoi } from "@/lib/roi";
import { formatMoney } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { LeadGate } from "./LeadGate";

const fields = [
  { key: "headcount", label: "People in the process", min: 0, step: 1, def: 10 },
  { key: "hoursPerWeek", label: "Hours each spends on it per week", min: 0, step: 1, def: 8 },
  { key: "hourlyCost", label: "Loaded hourly cost ($)", min: 0, step: 5, def: 45 },
  { key: "automationShare", label: "Share you expect to automate (%)", min: 0, step: 5, def: 60 },
] as const;

export function ROICalculator() {
  const [v, setV] = useState<Record<(typeof fields)[number]["key"], number>>({ headcount: 10, hoursPerWeek: 8, hourlyCost: 45, automationShare: 60 });
  const [unlocked, setUnlocked] = useState(false);
  const r = calculateRoi({ ...v, automationShare: v.automationShare / 100 });
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form className="space-y-5" onChange={() => track("tool_used", { tool: "roi" })}>
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm">{f.label}</span>
            <input type="number" min={f.min} step={f.step} value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2" />
          </label>
        ))}
      </form>
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-sm text-muted">Estimated annual saving</p>
        <p className="font-display text-[length:var(--text-step-4)] leading-none">{formatMoney(r.annualCostSaved)}</p>
        <p className="mt-2 text-sm text-muted">{Math.round(r.annualHoursSaved).toLocaleString()} hours a year</p>
        {unlocked ? (
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Hours in the process today</dt><dd>{r.annualHours.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt>Pilot payback</dt><dd>{r.paybackMonths === null ? "No payback at these inputs" : `${r.paybackMonths.toFixed(1)} months`}</dd></div>
          </dl>
        ) : (
          <LeadGate payload={{ ...v, ...r }} onUnlocked={() => setUnlocked(true)} />
        )}
      </div>
    </div>
  );
}
```

```tsx
// src/components/roi/LeadGate.tsx
"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
export function LeadGate({ payload, onUnlocked }: { payload: Record<string, unknown>; onUnlocked: () => void }) {
  const [email, setEmail] = useState(""); const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, source: "roi", payload }) });
    setBusy(false);
    if (res.ok) { track("lead_captured", { source: "roi" }); onUnlocked(); }
    else { const b = await res.json().catch(() => ({ errors: { _: "Try again" } })); setErr(b.errors?.email ?? b.errors?._ ?? "Try again"); }
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-2">
      <label className="block text-sm">Work email for the payback breakdown
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" />
      </label>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <button disabled={busy} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink disabled:opacity-60">{busy ? "Sending…" : "Show payback"}</button>
    </form>
  );
}
```

```tsx
// src/app/tools/ai-roi-calculator/page.tsx
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { ROICalculator } from "@/components/roi/ROICalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI ROI calculator for operations teams", description: "Estimate the annual hours and cost an agentic workflow would save on one process, and the payback on a fixed-price pilot.", path: "/tools/ai-roi-calculator" });
const faq = [
  { q: "How is the saving calculated?", a: "People × hours per week × 48 weeks × the share you expect to automate × loaded hourly cost." },
  { q: "Is 60% automation realistic?", a: "For document-heavy, rules-with-exceptions work, 50 to 80% is typical in our pilots. Fully unstructured judgement work is lower." },
  { q: "What does the payback compare against?", a: "The 'from' price of a pilot shown on our services pages." },
];
export default function RoiPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Tools", path: "/tools/ai-roi-calculator" }, { name: "AI ROI calculator", path: "/tools/ai-roi-calculator" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Free tool" title="What would automating one process save you?">Change the four inputs. The summary is free; the payback breakdown asks for a work email.</SectionHeading>
        <div className="mt-12"><ROICalculator /></div>
      </section>
      <FAQ items={faq} />
      <CTABand />
    </main>
  );
}
```

- [ ] **Step 8: Run tests and build** — `pnpm test && pnpm build` → all pass; `/api/leads` listed as dynamic (ƒ), everything else static.

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat: ROI calculator, lead capture and analytics hook"`

---

### Task 14: 3D scene frame, gating hook, posters and the four scenes

**Files:**
- Create: `src/components/scenes/useSceneAllowed.ts`, `src/components/scenes/SceneFrame.tsx`, `src/components/scenes/AgenticFieldScene.tsx`, `src/components/scenes/RagPipelineScene.tsx`, `src/components/scenes/AutomationLoopScene.tsx`, `src/components/scenes/EnterpriseStackScene.tsx`, `src/components/scenes/registry.ts`, `src/components/scenes/SceneSlot.tsx`
- Create: `public/posters/{agentic-field,rag-pipeline,automation-loop,enterprise-stack}.svg`
- Modify: `src/app/page.tsx` (hero visual), `src/app/services/[slug]/page.tsx` (scene by service), `src/content/schemas.ts` (optional `scene` field on Service)
- Test: `tests/unit/scene-allowed.test.ts`, `tests/unit/scene-slot.test.tsx`

**Interfaces:**
- Produces:
  - `useSceneAllowed(): boolean` — false when `prefers-reduced-motion: reduce`, no WebGL context, `navigator.deviceMemory < 4`, `navigator.connection.saveData`, or `effectiveType` is 2g/3g; true otherwise. Evaluated client-side; initial render returns false (so SSR output is the poster).
  - `<SceneSlot id={SceneId} className? />` — server-safe component: renders the poster `<img>` immediately, and a lazy client island that mounts the scene only when allowed and within one viewport.
  - `SceneId = "agentic-field" | "rag-pipeline" | "automation-loop" | "enterprise-stack"`.
  - Service frontmatter gains `scene?: SceneId`. Mapping at launch: ai-automation → automation-loop, llm-rag-integration → rag-pipeline, custom-ai-agents → automation-loop, enterprise-ai-solutions → enterprise-stack.

- [ ] **Step 1: Failing gating test**

```ts
// tests/unit/scene-allowed.test.ts
import { describe, it, expect } from "vitest";
import { evaluateSceneAllowed } from "@/components/scenes/useSceneAllowed";
const base = { reducedMotion: false, webgl: true, deviceMemory: 8, saveData: false, effectiveType: "4g" };
describe("evaluateSceneAllowed", () => {
  it("allows on a capable device", () => expect(evaluateSceneAllowed(base)).toBe(true));
  it("blocks on reduced motion", () => expect(evaluateSceneAllowed({ ...base, reducedMotion: true })).toBe(false));
  it("blocks without webgl", () => expect(evaluateSceneAllowed({ ...base, webgl: false })).toBe(false));
  it("blocks on low memory", () => expect(evaluateSceneAllowed({ ...base, deviceMemory: 2 })).toBe(false));
  it("blocks on save-data or slow network", () => {
    expect(evaluateSceneAllowed({ ...base, saveData: true })).toBe(false);
    expect(evaluateSceneAllowed({ ...base, effectiveType: "3g" })).toBe(false);
  });
  it("treats unknown memory as allowed", () => expect(evaluateSceneAllowed({ ...base, deviceMemory: undefined })).toBe(true));
});
```

- [ ] **Step 2: Run to verify failure** — FAIL.

- [ ] **Step 3: Implement gating**

```ts
// src/components/scenes/useSceneAllowed.ts
"use client";
import { useEffect, useState } from "react";
export type SceneEnv = { reducedMotion: boolean; webgl: boolean; deviceMemory?: number; saveData: boolean; effectiveType?: string };
export function evaluateSceneAllowed(env: SceneEnv): boolean {
  if (env.reducedMotion || !env.webgl || env.saveData) return false;
  if (env.deviceMemory !== undefined && env.deviceMemory < 4) return false;
  if (env.effectiveType && /(^|-)2g$|^3g$/.test(env.effectiveType)) return false;
  return true;
}
function readEnv(): SceneEnv {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  let webgl = false;
  try { const c = document.createElement("canvas"); webgl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { webgl = false; }
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl, deviceMemory: nav.deviceMemory, saveData: !!nav.connection?.saveData, effectiveType: nav.connection?.effectiveType,
  };
}
export function useSceneAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => { setAllowed(evaluateSceneAllowed(readEnv())); }, []);
  return allowed;
}
```

- [ ] **Step 4: Failing SceneSlot test**

```tsx
// tests/unit/scene-slot.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SceneSlot } from "@/components/scenes/SceneSlot";
describe("SceneSlot", () => {
  it("renders the poster image on first render and no canvas", () => {
    const { container } = render(<SceneSlot id="agentic-field" />);
    expect(container.querySelector('img[src="/posters/agentic-field.svg"]')).not.toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
```

- [ ] **Step 5: Implement SceneFrame, SceneSlot, registry**

```tsx
// src/components/scenes/registry.ts
export const SCENE_IDS = ["agentic-field", "rag-pipeline", "automation-loop", "enterprise-stack"] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export const sceneMeta: Record<SceneId, { alt: string }> = {
  "agentic-field": { alt: "Abstract network of agents, tools and data exchanging signals" },
  "rag-pipeline": { alt: "Documents fragmenting into chunks that settle into an embedding lattice and are retrieved by a query" },
  "automation-loop": { alt: "A ring of stages, plan, act, observe, correct, with an item moving through them" },
  "enterprise-stack": { alt: "Layered planes for data, models, orchestration and applications with connectors between them" },
};
```

```tsx
// src/components/scenes/SceneSlot.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useSceneAllowed } from "./useSceneAllowed";
import { sceneMeta, type SceneId } from "./registry";
import { cn } from "@/lib/utils";

const loaders = {
  "agentic-field": dynamic(() => import("./AgenticFieldScene"), { ssr: false }),
  "rag-pipeline": dynamic(() => import("./RagPipelineScene"), { ssr: false }),
  "automation-loop": dynamic(() => import("./AutomationLoopScene"), { ssr: false }),
  "enterprise-stack": dynamic(() => import("./EnterpriseStackScene"), { ssr: false }),
} as const;

export function SceneSlot({ id, className }: { id: SceneId; className?: string }) {
  const allowed = useSceneAllowed();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "100% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const Scene = loaders[id];
  return (
    <div ref={ref} className={cn("relative h-full w-full overflow-hidden rounded-3xl", className)}>
      <img src={`/posters/${id}.svg`} alt={sceneMeta[id].alt} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", ready && "opacity-0")} />
      {allowed && near && <div className="absolute inset-0" aria-hidden><Scene onReady={() => setReady(true)} /></div>}
    </div>
  );
}
```

```tsx
// src/components/scenes/SceneFrame.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
export function SceneFrame({ children, onReady, camera = { position: [0, 0, 6], fov: 45 } }: { children: React.ReactNode; onReady?: () => void; camera?: { position: [number, number, number]; fov: number } }) {
  const [lost, setLost] = useState(false);
  useEffect(() => { onReady?.(); }, [onReady]);
  if (lost) return null; // SceneSlot's poster is underneath and becomes visible again
  return (
    <Canvas dpr={[1, 1.5]} camera={camera} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => { gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setLost(true); }); }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      {children}
    </Canvas>
  );
}
```

Note: when `lost` becomes true, `SceneSlot` must also reset `ready` so the poster reappears. Add an `onLost` prop to `SceneFrame` and call `setReady(false)` in `SceneSlot`; thread it through each scene's props: `{ onReady?: () => void; onLost?: () => void }`.

- [ ] **Step 6: Implement the four scenes (procedural geometry only)**

```tsx
// src/components/scenes/AgenticFieldScene.tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SceneFrame } from "./SceneFrame";

const COUNT = 46;
function Field() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const nodes = useMemo(() => {
    const rnd = mulberry32(7);
    return Array.from({ length: COUNT }, () => new THREE.Vector3((rnd() - 0.5) * 5, (rnd() - 0.5) * 5, (rnd() - 0.5) * 3));
  }, []);
  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) if (nodes[i].distanceTo(nodes[j]) < 1.6) pairs.push([i, j]);
    const pos = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], k) => { nodes[a].toArray(pos, k * 6); nodes[b].toArray(pos, k * 6 + 3); });
    return pos;
  }, [nodes]);
  const pulse = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (group.current) { group.current.rotation.y = clock.elapsedTime * 0.08 + pointer.x * 0.3; group.current.rotation.x = pointer.y * -0.2; }
    if (pulse.current) { const t = (clock.elapsedTime * 0.25) % 1; const i = Math.floor(t * (edges.length / 6)); const a = new THREE.Vector3().fromArray(edges, i * 6), b = new THREE.Vector3().fromArray(edges, i * 6 + 3); pulse.current.position.lerpVectors(a, b, (t * (edges.length / 6)) % 1); }
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[i % 7 === 0 ? 0.09 : 0.05, 12, 12]} /><meshStandardMaterial color={i % 7 === 0 ? "#0f5c4a" : "#8a8378"} /></mesh>
      ))}
      <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry><lineBasicMaterial color="#8a8378" transparent opacity={0.35} /></lineSegments>
      <mesh ref={pulse}><sphereGeometry args={[0.07, 10, 10]} /><meshBasicMaterial color="#6fd3b4" /></mesh>
    </group>
  );
}
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export default function AgenticFieldScene(props: { onReady?: () => void; onLost?: () => void }) {
  return <SceneFrame {...props}><Field /></SceneFrame>;
}
```

- `RagPipelineScene`: 60 small boxes (chunks) start clustered as a "document" slab on the left, animate (lerp on `useFrame` with scroll progress read from `window.scrollY / window.innerHeight` clamped 0..1) into a 6×10 lattice on the right; a thin cylinder (query ray) sweeps and the five nearest lattice cells highlight with the accent colour.
- `AutomationLoopScene`: a torus ring with four flat "stage" plates at 90° intervals labelled by colour; a small sphere orbits the ring; a sixth of the way through each stage it pauses briefly (ease) to read as "work being done".
- `EnterpriseStackScene`: four translucent planes stacked on y (data, models, orchestration, apps) with 12 vertical thin cylinders connecting random pairs; slow tilt follows the pointer.

Each default-exports `(props: { onReady?: () => void; onLost?: () => void }) => <SceneFrame {...props}>…</SceneFrame>`.

- [ ] **Step 7: Posters**

Hand-draw four SVGs (1200×1500 viewBox, warm off-white background `#f7f4ee`, muted `#8a8378` lines, accent `#0f5c4a` highlights) that depict each scene statically: scattered nodes with edges; a slab fragmenting into a grid; a ring with four plates; four stacked planes with connectors. Keep each under 12 KB.

- [ ] **Step 8: Wire into pages**

- `src/content/schemas.ts`: add `scene: z.enum(["agentic-field","rag-pipeline","automation-loop","enterprise-stack"]).optional()` to `ServiceSchema`; add `scene:` values to the four service MDX files listed in Interfaces.
- `src/app/page.tsx`: `<Hero visual={<SceneSlot id="agentic-field" />} />`.
- `src/app/services/[slug]/page.tsx`: after the heading grid, `{s.scene && <div className="my-12 aspect-[16/9]"><SceneSlot id={s.scene} /></div>}`.

- [ ] **Step 9: Bundle check**

Run: `pnpm build` and inspect the "First Load JS" column: `/` and `/services/[slug]` must stay under 100 KB because scenes are `ssr: false` dynamic imports; then `ls -la .next/static/chunks | sort -k5 -n | tail` and confirm each scene chunk gzips under 150 KB: `gzip -c .next/static/chunks/<scene-chunk>.js | wc -c`.

- [ ] **Step 10: Run tests, commit** — `pnpm test && git add -A && git commit -m "feat: 3D scenes with posters and capability gating"`

---

### Task 15: Playwright route suite and reduced-motion check

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/routes.spec.ts`, `tests/e2e/reduced-motion.spec.ts`

- [ ] **Step 1: Config**

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  webServer: { command: "pnpm build && pnpm start -p 3100", port: 3100, reuseExistingServer: !process.env.CI, timeout: 180_000 },
  use: { baseURL: "http://localhost:3100" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
});
```

Run `pnpm exec playwright install chromium` once.

- [ ] **Step 2: Route suite**

```ts
// tests/e2e/routes.spec.ts
import { test, expect } from "@playwright/test";
import sitemap from "../../src/app/sitemap";
import { siteConfig } from "../../site.config";

const paths = sitemap().map((e) => e.url.replace(siteConfig.domain, ""));

for (const path of paths) {
  test(`route ${path} meets the page contract`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path === "/" ? "/?$" : path.replace(/\//g, "\\/") + "$"}`));
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length, "has json-ld").toBeGreaterThan(0);
    for (const s of ld) expect(() => JSON.parse(s)).not.toThrow();
    if (!["/privacy", "/terms"].includes(path)) await expect(page.locator('[data-cta="primary"]').first()).toBeVisible();
    expect(errors, "no console errors").toEqual([]);
  });
}
```

- [ ] **Step 3: Reduced-motion suite**

```ts
// tests/e2e/reduced-motion.spec.ts
import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
for (const path of ["/", "/services/llm-rag-integration"]) {
  test(`${path} shows posters and mounts no canvas under reduced motion`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(1500);
    await expect(page.locator('img[src^="/posters/"]').first()).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });
}
test("/ mounts a canvas when motion is allowed", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await ctx.newPage(); await page.goto("/");
  await expect(page.locator("canvas").first()).toBeAttached({ timeout: 10_000 });
});
```

- [ ] **Step 4: Run** — `pnpm test:e2e` → all pass. Fix any route failing the contract (most likely a missing `data-cta`, a second h1 inside MDX, or an over-length title).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "test: playwright page contract and reduced-motion suites"`

---

### Task 16: Lighthouse CI, bundle budgets and accessibility pass

**Files:**
- Create: `lighthouserc.json`
- Modify: `package.json` (scripts), `.github/workflows/ci.yml` (optional; include if the repo will be pushed)

- [ ] **Step 1: Lighthouse config**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start -p 3100",
      "startServerReadyPattern": "Ready",
      "url": [
        "http://localhost:3100/", "http://localhost:3100/services/ai-automation", "http://localhost:3100/industries/healthcare",
        "http://localhost:3100/case-studies/logistics-claims-automation", "http://localhost:3100/insights/ai-readiness-checklist",
        "http://localhost:3100/tools/ai-roi-calculator", "http://localhost:3100/about", "http://localhost:3100/contact"
      ],
      "numberOfRuns": 2,
      "settings": { "preset": "mobile" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

- [ ] **Step 2: Run** — `pnpm build && pnpm lhci` → all assertions pass. Typical fixes if not: add `priority` to the hero poster image, ensure the contact iframe is `loading="lazy"`, add `sizes` to logos, confirm fonts use `display: swap`, raise contrast of `--color-muted` if accessibility flags it.

- [ ] **Step 3: Bundle budget script**

Add to `package.json`: `"budget": "node scripts/budget.mjs"` with:

```js
// scripts/budget.mjs
import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib";
const manifest = JSON.parse(fs.readFileSync(".next/build-manifest.json", "utf8"));
const gz = (f) => zlib.gzipSync(fs.readFileSync(path.join(".next", f))).length;
const pageBudget = 100 * 1024, sceneBudget = 150 * 1024; let failed = false;
for (const [route, files] of Object.entries(manifest.pages)) {
  const total = files.filter((f) => f.endsWith(".js")).reduce((n, f) => n + gz(f), 0);
  if (total > pageBudget) { console.error(`✗ ${route} first-load ${Math.round(total / 1024)} KB > 100 KB`); failed = true; } else console.log(`✓ ${route} ${Math.round(total / 1024)} KB`);
}
for (const f of fs.readdirSync(".next/static/chunks")) if (/Scene/.test(f) && gz(`static/chunks/${f}`) > sceneBudget) { console.error(`✗ scene chunk ${f} over 150 KB`); failed = true; }
process.exit(failed ? 1 : 0);
```

Run: `pnpm build && pnpm budget` → all ✓.

- [ ] **Step 4: Accessibility pass** — with the dev server running, tab through `/` and `/tools/ai-roi-calculator`: every interactive element shows a focus ring (add `focus-visible:outline-2 focus-visible:outline-accent` to the CTA and Nav link classes if not), the `details` FAQ opens with Enter, the LeadGate error is announced (`role="alert"` present), and all images have alt text.

- [ ] **Step 5: CI workflow (if pushing to GitHub)**

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
      - run: pnpm budget
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - run: pnpm lhci
```

- [ ] **Step 6: Commit** — `git add -A && git commit -m "ci: lighthouse budgets, bundle budget script and workflow"`

---

## Verification (end to end)

1. `pnpm test` — all unit tests green (config, schemas, loader, validator, real content, seo, components, diagrams, hero, sitemap, roi, leads route, analytics, scene gating, scene slot).
2. `pnpm build` — content validation prints "Content OK"; every route except `/api/leads` is static; First Load JS under 100 KB for non-3D pages.
3. `pnpm budget` — all routes and scene chunks within budget.
4. `pnpm test:e2e` — every sitemap route meets the page contract; reduced motion shows posters only; normal motion mounts a canvas on `/`.
5. `pnpm lhci` — 95/95/95/90 on all eight sampled routes, mobile.
6. Manual: open `/`, confirm the hero 3D field renders after first paint and reacts to the pointer; open `/services/llm-rag-integration`, scroll and watch the RAG lattice form; enable "Reduce motion" in OS settings, reload, confirm posters only. Submit the ROI gate with a real-looking email and confirm a line appears in `.leads/leads.jsonl`.
7. Change `siteConfig.name` and rebuild: nav, footer, OG image, JSON-LD and titles all update with no other edits.

## Out of scope (separate specs)

Content engine (pillar pages, 10–15 articles per service, readiness scorecard, yearly data report), the live RAG chat demo, CMS, geo landing pages, multi-language.
