This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Interactive operations office

The homepage hero contains a local, scripted Three.js office demo, not a connection
to customer systems. Its workflow data and playback rules live in
[`src/components/office/workflows.ts`](./src/components/office/workflows.ts).
Claims and prior-authorisation animations include a clearly labelled simulated
human approval. Eligible returns complete within the illustrated policy.
Exceptions end at a human handoff, never an execution. These are animation
states only, not an approval implementation for production agents.

- Agents walk through the aisles, collect task cards at the collaboration hub,
  return to their desks and type. The furnished office includes a lounge,
  coffee station, reference shelves, plants, glass walls and a planning board.
- Workflows play automatically and replay after a five-second hold. Click a desk
  or character to inspect its role; the keyboard-accessible scene labels and
  "Meet the team" selector provide the same information. View controls rotate
  the office. Pause and replay remain available without a numbered step strip.
- The scene loads after interaction or a short delay, with an SVG poster on first
  paint. Reduced motion, unsupported WebGL and constrained devices keep the
  poster and all HTML controls. Reduced motion uses manual scenes.
  On a constrained connection, visitors can explicitly choose "Load 3D office"
  instead of waiting for an automatic download.
- An indeterminate branded opening screen covers scene loading, followed by a
  staged office entrance. It does not claim artificial percentage progress or
  delay a ready scene. It is absent in reduced-motion and unsupported browsers.
- Playback pauses offscreen and in hidden tabs. The office renders on demand
  while paused. Loading animation, walking and workflow timers pause offscreen
  or in hidden tabs; required human decisions remain labelled as simulated.
- No uploaded assets, customer data, third-party model calls or real approvals
  are involved. All timing is illustrative, not a processing-time claim.
- The office leads the hero at full width, with the headline, supporting copy
  and CTAs centered underneath. The office, loading screen and role details share
  the hero background, without a separate card border, surface or outer shadow.
  The previous before/after comparison is no longer displayed on the homepage.
- The office starts directly with its workflow controls, without a title/logo
  header. The trust-logo band is omitted; illustrative workflow examples remain.

Focused checks: `pnpm test tests/unit/office.test.tsx tests/unit/hero.test.tsx`.
After `pnpm build`, run `pnpm exec playwright test tests/e2e/office.spec.ts`.

## Interactive Agents showroom

The Agents landing page uses one lazy-loaded Three.js workbench for seven
specialists. Its furniture shares the homepage's procedural geometry helpers,
but its scene, playback and selection are independent. Selecting an agent changes
the animated task station, static preview, example, tools, human gates and related case study. Existing agent
detail URLs are unchanged.

- The page introduction leads the centered artwork at every breakpoint, with the selected specialist's
  title and description centered underneath instead of in a side column.
- Presentation copy and visual variants live in
  [`src/components/agents/showcase.ts`](./src/components/agents/showcase.ts).
  Workflows, permissions and evidence come from the existing agent content.
- Examples are scripted, not connected to any system. Intermediate human review
  is explicitly simulated. Demonstrations ending at review remain a handoff,
  not an approval or an executed action. Related case studies use qualitative
  descriptions and retain their illustrative labels.
- Each specialist has a distinct task station: claims inspection scanner, returns
  conveyor, billing dashboard, clinical checklist, maintenance gear, dispatch
  network or permit model. These task animations pause during human review and
  when playback is paused. Switching specialists resets the workflow and camera
  without creating another WebGL canvas or overriding a deliberate pause.
- The transparent scene has a matching SVG first-paint preview for every agent, indeterminate loading,
  camera controls, pause/replay and manual reduced-motion playback. Constrained
  connections can opt into 3D. Loading failures and context loss display an
  explicit notice while retaining all HTML content and controls.
- Reduced-motion, low-bandwidth and WebGL-failure previews change with the selected
  specialist too; they do not reuse an unchanging generic illustration.
  Regenerate these lightweight assets with `pnpm exec tsx scripts/generate-agent-previews.tsx`
  after editing the preview geometry. Keeping SVG geometry in assets avoids
  adding it to the initial JavaScript bundle.
- Animation and playback pause offscreen and in hidden tabs. Desktop selection
  uses labelled buttons; mobile uses a native select. Tool permissions remain
  available in an accessible disclosure.
- Playback controls are centered beneath the selector without a visible activity
  caption, demonstration badge or animation disclaimer. Workflow status remains
  available to screen readers, including manual progress and human handoffs.

Focused checks: `pnpm test tests/unit/agents.test.tsx tests/unit/office.test.tsx`.
Browser checks: `pnpm exec playwright test tests/e2e/agents.spec.ts`.

## Industry environments

The Industries overview and every dedicated industry route use a full-width,
transparent Three.js hero with centered copy. Each sector has its own geometry:
warehouse and delivery, clinic, retail store, assembly cell, utility site,
telecom network centre and civic campus. Selecting a sector changes the world,
workflow hotspots, copy and landing-page link; only one canvas is mounted.

The same workflow-area buttons work without WebGL and provide keyboard access
to the scene's clickable markers. Animations are illustrative, not actual
clinical, industrial or infrastructure control. Pause and camera controls remain
available in the 3D view. Playback stops offscreen or in hidden tabs.

Every sector has a distinct SVG preview. Reduced motion stays static; constrained
devices can opt into 3D. Renderer failures, timeouts and context loss restore the
preview with a visible notice. The renderer loads lazily and shares the existing
Three runtime. Industry content must have an explicit entry in
`src/components/industries/experiences.ts`; missing mappings fail rather than
silently receiving a generic scene.

Checks: `pnpm test tests/unit/industries.test.tsx tests/unit/agents.test.tsx`
and `pnpm exec playwright test tests/e2e/industries.spec.ts`.

## Editorial Case Studies library

The Case Studies overview uses an editorial header, a featured logistics story,
flat workflow sketches and a filterable collection. There is no Three.js scene,
canvas or WebGL initialisation on this page. The sketches connect approved
sources, a proposed draft and the relevant human checkpoint; they are not
screenshots of a live product or evidence of measured results.

Industry filters use native mobile selection and announced result counts. The
featured workflow is omitted from the unfiltered grid, but appears when its
industry is selected. The compact collection no longer needs text search.
All example links and
illustrative disclosures are server-rendered and remain readable without
JavaScript. Existing detail routes are preserved, and their layouts reuse the
editorial sketches. The public collection is labelled "Workflow examples".
Editorial cover metadata lives in
`src/components/case-studies/library.ts`; the authoritative case content remains
in `content/case-studies`.

Checks: `pnpm test tests/unit/case-studies.test.tsx` and
`pnpm exec playwright test tests/e2e/case-studies.spec.ts`.

## About and page navigation

The About introduction is centered, including its heading, positioning statement
and story. The team cards, team-specific CTA and person metadata are not
published. Founder records remain only to validate archived article authors.

Breadcrumb navigation and its structured data have been removed from all public
routes; the primary navigation, footer and contextual links remain. The footer
and About page do not display market coverage or a security-roadmap badge.
Service/agent structured data likewise omits the removed market coverage.

The mobile menu closes immediately on link selection, including the current page,
and when focus leaves, Escape is pressed, an outside pointer is used or the layout
switches to desktop. It restores the prior scroll state and returns focus to its
toggle on Escape. The contact action appears once at each breakpoint.
Navigation regressions are covered by `tests/unit/nav.test.tsx` and
`tests/e2e/navigation.spec.ts`, including browser history and nested routes.

## Retired Insights section

Insights is no longer published: its index, article pages and article social
image routes have been removed, along with header, mobile-menu, footer and
sitemap references. Previous Insights URLs return the standard not-found page.
The MDX sources in `content/insights` remain unpublished for reference and
continue to receive content validation; they are not linked or publicly routed.

## Public claims and workflow assessment

Public pages do not publish preset prices, savings percentages, payback estimates
or fixed delivery/processing times. Service schedules are scoped descriptions;
case studies describe illustrative approaches and intended benefits, not measured
customer results. Their content model uses a qualitative `result.summary` rather
than numeric performance fields. Social previews, FAQs and structured data use
the same content. Publication dates and legal privacy periods are not marketing
claims and remain intact.

The homepage links to a qualitative workflow assessment at the existing
`/tools/ai-roi-calculator` URL. The old URL is retained so bookmarks and links
continue to work; navigation calls it "Workflow assessment". There are no cost,
headcount or automation-rate defaults, no numeric results and no email gate.
Answers stay in page state. Analytics, when configured, records tool use only,
not answers. Guidance identifies process, access and review questions; it is not
a readiness certification or a financial recommendation.

Content regression tests check for numeric cost and duration claims. Browser
checks in `tests/e2e/claims.spec.ts` scan public routes, metadata and structured
data, and exercise the assessment on desktop and mobile.

## Consolidated site design

- Home has five main sections: office and proposition, workflow examples,
  systems and controls, the engagement journey, and one closing invitation.
  The full service catalogue, second workflow simulator, animated brand strip
  and embedded assessment no longer repeat on Home.
- Services are grouped into assess/design, build/integrate and scale/support.
  Staffing remains a secondary, availability-dependent guide. All service,
  industry, agent and example detail URLs are preserved.
- Shared `section-space`, `page-intro`, `detail-grid` and `detail-panel` styles
  define spacing and layout. Dense body content stays left aligned; standard
  introductions and all 3D page introductions are centered.
- Industry introductions precede their full-width art. Repeated industry MDX
  sections are consolidated into operational challenges, requirements and an
  illustrative approach. Requirements are not compliance certifications.
- Service pages keep one explanatory diagram, not an additional decorative 3D
  scene. Agent tools/permissions are accessible native disclosures.
- All primary enquiry actions lead to `/contact`. Navigation indicates the
  active page family, and the mobile menu is used below 1024px. The footer has
  no extra sales banner, and About retains one contact action.

Checks: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`,
`pnpm budget`; browser coverage includes `tests/e2e/design-audit.spec.ts`,
the responsive route suite, and the office/agent/industry interaction suites.

## Preview and enquiry configuration

This remains a **preview**, not a launch-ready commercial site. `site.config.ts`
keeps `preview: true`, a loopback metadata origin, and empty legal, email,
calendar and LinkedIn fields. Pages are marked `noindex, nofollow`; unconfigured
external contact links and calendars are not rendered. Supply verified business
details and a production origin before considering public launch.

Enquiry capture is disabled by default. `/api/leads` returns 503 without saving
or logging personal information, and the form explains why it is disabled.
There is no production console-log provider masquerading as delivery.

For **local development testing only**, set `ENABLE_LOCAL_LEAD_CAPTURE=true`
in the gitignored `.env.local` file to keep the form enabled across dev-server
restarts, or pass it when starting the dev server. Test submissions are appended to
`.leads/leads.jsonl`, and the UI explicitly says that no email is sent. Use
synthetic data and remove the test records when finished. Production always
rejects capture, even if that flag is set.

Before enabling real enquiries, implement and verify an approved durable
delivery provider, then update the availability gate, confirmation copy and
Privacy information to describe the actual controller, processors and
retention practices. Never put credentials in the browser or site configuration.
Do not change the preview flag alone and assume that delivery is configured.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
