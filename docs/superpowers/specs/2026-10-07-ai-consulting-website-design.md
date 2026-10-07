# AI Consulting Website — Design Spec

Date: 2026-10-07
Owner: Vivekanand Choudhari
Source: "AI Consulting Website Blueprint" (Oct 7, 2026)
Status: approved for planning

## 1. Purpose and outcome

Build the marketing and lead-generation website for a new AI consulting company. The site is the company's best salesperson, not a brochure. It must:

1. Prove the company has done the work (case studies with numbers, units and dates).
2. Make the buyer feel their own problem (industry and service pages written around pains and outcomes).
3. Give Google hundreds of specific queries to rank for (query-targeted pages, topic clusters, schema markup).

Success at launch:

- Every route pre-rendered as static HTML; no page depends on client-side rendering to show its content.
- Lighthouse mobile scores of 95 or higher for Performance, Accessibility and SEO on every route.
- Exactly one H1, a canonical tag, valid JSON-LD and one primary call to action on every page.
- A visitor can reach a low-risk next step (book a call, use a tool) within two clicks from any page.
- The design reads as premium and editorial, with original 3D and 2D renderings of the systems the company builds.

## 2. Positioning (decided)

- Wedge: outcome-based. "Cut operating cost with agentic AI workflows."
- Positioning sentence: "We help mid-to-large enterprises cut operating cost using agentic AI workflows."
- Buyers: CFOs, COOs, heads of operations.
- Target queries to own (initial five):
  1. "AI automation consulting"
  2. "agentic workflow consulting"
  3. "LLM integration services"
  4. "AI strategy for enterprises"
  5. "AI consulting for logistics"
- Markets: US, UK, Middle East, India. English only at launch. Geo landing pages are a later phase.
- Company name: placeholder, held in one config file. Changing it is a one-line edit.

## 3. Scope

### In scope (this spec)

- The website: pages, design system, content model, SEO plumbing, booking, ROI calculator.
- 3D and 2D visual system representing AI, automation, RAG and agentic systems.
- Three sample case studies, visibly labelled as illustrative.
- Three starter Insights articles so the section is not empty.
- Tests and quality gates.

### Out of scope (later projects, designed for)

- Content engine: pillar pages, 10 to 15 supporting articles per service, readiness scorecard, yearly data report. The content model in this spec is built so these are added as files with no restructuring.
- Live demo: a RAG chat agent over sample documents. A separate small app embedded later. A slot for it is reserved on the home page and the LLM/RAG service page.
- Headless CMS, multi-language, geo landing pages, client portal.

## 4. Stack

- Next.js (App Router), React, TypeScript strict.
- Tailwind CSS for the design system tokens and utilities.
- MDX content collections with Zod-validated frontmatter.
- React Three Fiber and drei for 3D scenes, loaded as lazy client islands.
- Framer Motion for 2D motion, respecting `prefers-reduced-motion`.
- Vitest for unit tests, Playwright for route smoke tests, Lighthouse CI for budgets.
- Deploy target: Vercel. Nothing in the codebase depends on it.
- Package manager: pnpm.

## 5. Site structure

All routes are statically generated at build time.

| Route | Job | Target query | Key content | CTA |
|---|---|---|---|---|
| `/` | One sharp promise, proof in the first screen | brand + "agentic AI consulting" | Positioning headline, one headline number, client logo bar, hero 3D scene, three case-study cards, services grid, process steps, CTA band | Book a 30-min AI audit |
| `/services` | Index of services | "AI consulting services" | Service cards | Book a call |
| `/services/[slug]` | Rank per service, explain the engagement | per service (below) | Problem, approach, deliverables, timeline, linked case study, FAQ, 2D system diagram | Book a call |
| `/industries` | Index of industries | "AI consulting by industry" | Industry cards | Book a call |
| `/industries/[slug]` | Rank per vertical, make the reader see their world | "AI consulting for [industry]" | Industry pains, linked case study, compliance notes, FAQ | Book a call |
| `/case-studies` | The most important section | "AI case studies" | Case-study cards with headline numbers | Book a call |
| `/case-studies/[slug]` | Prove the work | "[industry] AI case study" | Situation, what was built, measurable result, client quote, 2D architecture diagram | Book a call |
| `/insights` | The SEO engine | buyer questions | Article list | Subscribe |
| `/insights/[slug]` | Answer one buyer question | per article | Article body, author, FAQ, related services | Subscribe / Book a call |
| `/tools/ai-roi-calculator` | Lead magnet and backlink earner | "AI ROI calculator" | Interactive calculator, email gate for detailed breakdown | Download / Book a call |
| `/about` | Buyers of consulting buy people | company name, founder name | Founder story, team, why the company exists | Meet the team |
| `/contact` | Zero-friction conversion | — | Embedded calendar, short form | Pick a slot |
| `/privacy`, `/terms` | Legal | — | Static text | — |

Services at launch (six), slug → title → target query:

- `ai-automation` → AI Automation & Agentic Workflows → "AI automation consulting"
- `llm-rag-integration` → LLM & RAG Integration → "LLM integration services"
- `ai-strategy-readiness` → AI Strategy & Readiness → "AI strategy for enterprises"
- `custom-ai-agents` → Custom AI Agents → "build vs buy an AI agent"
- `enterprise-ai-solutions` → Enterprise AI Solutions → "enterprise AI solutions"
- `ai-talent-staffing` → AI Talent & Staffing → "AI engineers staffing"

Industries at launch (four): `logistics`, `retail`, `healthcare`, `financial-services`.

Case studies at launch (three, illustrative): one per the first three industries, each tied to a service.

Insights at launch (three): "How much does an AI pilot cost", "RAG vs fine-tuning for enterprise documents", "AI readiness checklist".

Engagement model shown on home and every service page: Discovery sprint → Pilot → Scale, each with a "from $X" price held in config.

## 6. Content model

Content lives under `content/` as MDX files. Each collection has a Zod schema; a build fails if a required field is missing or malformed.

```
content/
  services/*.mdx
  industries/*.mdx
  case-studies/*.mdx
  insights/*.mdx
```

Frontmatter schemas (summary):

- **Service**: `title`, `slug`, `summary`, `targetQuery`, `problem`, `approach[]`, `deliverables[]`, `timelineWeeks`, `caseStudy` (slug), `faq[] {q, a}`, `diagram` (id of a 2D system diagram), `seo {title, description}`.
- **Industry**: `title`, `slug`, `summary`, `targetQuery`, `pains[]`, `compliance[]`, `caseStudy` (slug), `services[]` (slugs), `faq[]`, `seo`.
- **CaseStudy**: `title`, `slug`, `client` (name or "Confidential [industry] company"), `industry` (slug), `service` (slug), `situation`, `built`, `result {metric, value, unit, period, date}`, `quote {text, name, role}`, `illustrative: boolean`, `diagram`, `seo`.
- **Insight**: `title`, `slug`, `summary`, `publishedAt`, `updatedAt`, `author` (person id), `targetQuery`, `relatedServices[]`, `faq[]`, `seo`.

A `src/content/` loader reads, validates and exposes typed collections. Cross-references (service → case study, industry → case study) are validated at build time; a dangling slug fails the build.

Site-wide config in `site.config.ts`: company name, domain, positioning sentence, headline number, booking URL, contact email, social links, pricing "from" values, target queries, founders (for Person schema), analytics provider key.

Illustrative content: any case study with `illustrative: true` renders a visible "Illustrative example" badge on cards and the detail page, and is excluded from the Organization schema's claims.

## 7. Design system

Direction: editorial restraint plus specificity. The visuals carry the "we build AI" feeling; the typography and whitespace carry seniority.

- **Colour**: warm off-white page, near-black ink, one accent colour reserved for the primary CTA and links, a muted secondary for diagrams. No gradients as backgrounds. Dark mode follows the system setting with the same tokens remapped.
- **Type**: a serif display face for headlines and a clean sans for body and UI, both loaded with `next/font` and subset. Fluid type scale with six steps.
- **Layout**: 12-column grid, wide outer margins, 8-point spacing scale, max content width around 1200px, prose width around 68 characters.
- **Imagery**: real photography slots with a neutral placeholder and a required alt text. No stock robots, no purple gradients.
- **Components**: Nav, Footer, Hero, ProofBar, SectionHeading, ServiceCard, IndustryCard, CaseStudyCard, StatBlock, Quote, ProcessSteps, FAQ (with FAQPage schema), CTABand (booking embed), ROICalculator, IllustrativeBadge, Breadcrumbs, Prose (MDX styles).
- The frontend-design skill is used during implementation so the result does not read as a template.

## 8. 3D and 2D visual system

The visuals are original renderings of the systems the company builds. They are abstract and schematic, never mascots or robots. Every visual has a static fallback so no page's content or layout depends on WebGL or JavaScript.

### 3D scenes (React Three Fiber)

- **Hero "agentic workflow" scene** (home): a field of nodes and edges representing agents, tools and data, with a slow orbit and subtle pulses along edges. Reacts gently to pointer position. Serves as the one large 3D moment on the site.
- **RAG pipeline object** (LLM/RAG service page): documents fragmenting into chunks, chunks settling into an embedding lattice, a query ray retrieving the nearest chunks into a response. Scroll-driven.
- **Automation loop object** (AI automation service page and custom agents page): a closed loop of plan → act → observe → correct, rendered as a rotating ring of stages with an item moving through them.
- **Enterprise systems object** (enterprise solutions page): layered planes for data, models, orchestration and apps with connectors between them.

Rules:

- Each scene is a client island, loaded with `next/dynamic` and `ssr: false`, only when within one viewport of the fold. The home hero loads after first paint.
- A single shared Three.js bundle; scenes are split per route.
- Performance budget: no scene over 150 KB gzipped, including geometry. No external model files at launch; geometry is procedural.
- Every scene has a static poster (SVG or optimised image) rendered server-side and shown until the scene is ready, and permanently when `prefers-reduced-motion` is set, WebGL is unavailable, or the device reports low memory or a slow connection.
- Pointer and scroll interactions are optional enhancements; nothing is hidden behind them.
- Target frame budget: 60 fps on a mid-range laptop, 30 fps on a mid-range phone, with device pixel ratio capped at 1.5.

### 2D diagrams and illustrations (SVG + Framer Motion)

A library of schematic diagrams, each a React component rendering inline SVG with design-system tokens, animated on scroll into view and static under reduced motion:

- `RagPipelineDiagram`: ingest → chunk → embed → store → retrieve → generate.
- `AgentLoopDiagram`: goal → plan → tool calls → observe → verify → done, with a human-in-the-loop gate.
- `AutomationFlowDiagram`: trigger → steps → decision → handoff, used for case-study "what was built".
- `EnterpriseStackDiagram`: data layer, model layer, orchestration, applications, governance.
- `EngagementModelDiagram`: discovery sprint → pilot → scale, with durations and "from $X".
- `BeforeAfterDiagram`: a manual process beside its automated version, used in case studies.

Services and case studies reference diagrams by id in frontmatter; a registry maps ids to components. Each diagram has a text description for screen readers and an accompanying caption.

Open Graph images are generated per page with `next/og` using the same visual language, so shared links look like the site.

## 9. SEO and conversion plumbing

- Metadata per page through the Next.js Metadata API; titles under 60 characters, descriptions under 155, derived from frontmatter `seo` with sensible defaults.
- One H1 per page enforced by the page templates; a Playwright test asserts it.
- JSON-LD per page type: `Organization` and `WebSite` on home; `Service` on service pages; `Article` on insights and case studies; `FAQPage` wherever an FAQ renders; `Person` for founders on About; `BreadcrumbList` on every non-home page.
- `sitemap.xml` and `robots.txt` generated from the content collections. Canonical URL on every page. `hreflang` deliberately omitted until multi-country pages exist.
- Clean URLs exactly as in the blueprint: `/services/ai-automation`, `/industries/healthcare`, `/case-studies/[client]`, `/insights/[topic]`.
- Internal linking: every service links to its case study and related insights; every industry links to its case study and relevant services; every insight links to related services. Rendered from frontmatter so links cannot go stale.
- CTABand with the embedded booking calendar on every page; the booking URL comes from config. Contact page shows the full calendar plus a four-field form.
- ROI calculator: inputs are headcount in the process, hours per week on the task, loaded hourly cost, expected automation share. Output shows annual hours and cost saved and a payback estimate against the "from $X" pilot price. The summary is free; the detailed breakdown requires an email, posted to an API route that writes to a provider adapter (default: console log plus a JSON file in development; a documented interface for a CRM later).
- Analytics: one `track(event, props)` hook with `page_view`, `cta_click`, `booking_opened`, `tool_used`, `lead_captured`. Provider is swappable; default is a no-op in development.
- Trust signals: client logo bar (placeholder logos, clearly generic), team photo slots, a security posture line ("GDPR-aligned; SOC 2 roadmap") held in config so it is only shown when true.

## 10. Error handling

- Content validation errors fail `next build` with the file path and field named.
- Dangling cross-references fail the build.
- 3D scenes catch WebGL context loss and fall back to the poster.
- The lead-capture API route validates with Zod, returns 400 with field errors, never leaks provider errors to the client, and logs server-side.
- A branded `not-found` page and a global error boundary with the CTA band.

## 11. Testing and quality gates

- **Vitest**: content schemas (valid and invalid fixtures), cross-reference validator, ROI calculator maths, JSON-LD builders, metadata builders.
- **Playwright**: for every route in the generated sitemap: HTTP 200, exactly one H1, a canonical tag, at least one JSON-LD block that parses, a visible primary CTA, no console errors. Reduced-motion run confirms posters render in place of scenes.
- **Lighthouse CI**: mobile, every route, 95 floor on Performance, Accessibility, SEO; Best Practices 90.
- **Build**: `pnpm build` with zero TypeScript errors; `pnpm lint` clean.
- **Bundle budget**: first-load JS for a non-3D page under 100 KB gzipped; 3D route islands under 150 KB each.

## 12. Repository layout

```
TechExperiment/
  docs/superpowers/specs/      this spec
  docs/superpowers/plans/      implementation plan
  content/                     MDX collections
  public/                      static assets, posters, logos
  src/
    app/                       routes, layouts, metadata, sitemap, robots, og
    components/                UI components
    components/diagrams/       2D SVG diagram library
    components/scenes/         3D React Three Fiber scenes and posters
    content/                   loaders and Zod schemas
    lib/                       seo (json-ld), analytics, roi maths, utils
    styles/                    tokens and globals
  site.config.ts
  tests/                       vitest and playwright
```

## 13. Phasing

1. Foundation: project scaffold, tokens, config, content loaders and schemas, layout, Nav, Footer, CTABand, metadata, sitemap, robots, tests harness.
2. Pages: home, services, industries, case studies, insights, about, contact, legal, with all content written and 2D diagrams.
3. Visuals: 3D scenes with posters and fallbacks; OG images.
4. Conversion: ROI calculator, lead capture, analytics hook, booking embed.
5. Quality: Playwright suite, Lighthouse CI, bundle budgets, accessibility pass.

The content engine and the live RAG demo follow as separate specs.
