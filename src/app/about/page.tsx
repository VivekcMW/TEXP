import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { CTABand } from "@/components/CTABand";
import { buildMetadata, personJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: `About ${siteConfig.name} — who we are and why`, description: "Operators who build agentic AI systems. The founder story, the team, and why the company exists: to turn AI pilots into measured operating cost reductions.", path: "/about" });

export default function AboutPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="About" title="Why this company exists">{siteConfig.positioning}</SectionHeading>
        <div className="prose-x mt-10 space-y-5 text-[length:var(--text-step-0)]">
          <p>We started this company after watching the same pattern repeat inside large organisations: an AI pilot built around a model rather than a process, a demo that impressed the board, and nothing in production a year later. The waste was not in the technology. It was in the scoping, the access and the measurement.</p>
          <p>So we built a consultancy around one promise: pick a process that costs real money, automate it with agents that show their evidence, run it beside the existing process, and publish the number. If the number is not there, we say so.</p>
          <p>We are operators first. Everyone who leads delivery here has run a team that owned a process, which is why our agents ship with runbooks, escalation rules and a person at the verify step until the metrics earn autonomy.</p>
        </div>
        <h2 className="mt-16 font-display text-[length:var(--text-step-2)]">The team</h2>
        <ul className="mt-6 grid gap-8 md:grid-cols-3">
          {siteConfig.founders.map((f) => (
            <li key={f.id}>
              <div className="aspect-[4/5] rounded-2xl bg-line" role="img" aria-label={`Photo of ${f.name}`} />
              <p className="mt-4 font-medium">{f.name}</p>
              <p className="text-sm text-muted">{f.role}</p>
              <p className="mt-2 text-sm text-muted">{f.bio}</p>
              <a href={f.linkedin} rel="noopener" className="mt-2 inline-block text-sm text-accent underline">LinkedIn</a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted">Markets: {siteConfig.markets.join(", ")}. {siteConfig.showSecurityPosture && siteConfig.securityPosture}.</p>
        <Link href="/contact" data-cta="primary" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Meet the team</Link>
      </section>
      <CTABand />
      <JsonLd data={siteConfig.founders.map((f) => personJsonLd(f))} />
    </main>
  );
}
