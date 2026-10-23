import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { CTABand } from "@/components/CTABand";
import { getServices } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI workflow design, delivery and support", description: "Explore AI workflow discovery, agent development and enterprise integration. Start with the process, then agree the right delivery approach.", path: "/services" });

const groups = [
  { title: "Assess and design", description: "Choose a useful starting point. Understand the process, evidence gaps and decisions a pilot should inform.", slugs: ["ai-strategy-readiness"] },
  { title: "Build and integrate", description: "Connect a bounded workflow to approved information and tools, with evaluation and human review designed in.", slugs: ["ai-automation", "custom-ai-agents", "llm-rag-integration"] },
  { title: "Scale and support", description: "Plan shared foundations, operational ownership and the capabilities your team needs for a wider rollout.", slugs: ["enterprise-ai-solutions"] },
];

export default function ServicesPage() {
  const services = getServices();
  return <main>
    <header className="container-x page-intro">
      <SectionHeading as="h1" eyebrow="Services" title="Start with the work. Build what fits.">From choosing a process to operating an evaluated workflow. Find the support that matches where your team is today.</SectionHeading>
    </header>
    <section className="container-x detail-content" aria-label="Ways to work together">
      <div className="grid gap-6 lg:grid-cols-3">
        {groups.map((group, index) => <article key={group.title} className="detail-panel flex flex-col">
          <p className="text-sm font-medium text-accent">0{index + 1}</p>
          <h2 className="mt-5 font-display text-2xl">{group.title}</h2>
          <p className="mt-3 text-sm text-muted">{group.description}</p>
          <ul className="mt-8 space-y-4 border-t border-line pt-6">
            {group.slugs.map((slug) => {
              const service = services.find((item) => item.slug === slug);
              if (!service) throw new Error(`Missing service in engagement group: ${slug}`);
              return <li key={slug}><Link className="text-sm font-medium text-accent underline decoration-line underline-offset-4 hover:decoration-accent" href={`/services/${slug}`}>{service.title}</Link></li>;
            })}
          </ul>
        </article>)}
      </div>
      <aside className="mt-10 flex flex-col gap-4 border-y border-line py-6 md:flex-row md:items-center md:justify-between">
        <div><h2 className="font-display text-lg">Building your internal capability?</h2><p className="mt-2 text-sm text-muted">Explore delivery roles, onboarding needs and knowledge transfer. Any staffing support is subject to confirmed availability.</p></div>
        <Link href="/services/ai-talent-staffing" className="shrink-0 text-sm font-medium text-accent underline underline-offset-4">Explore team support</Link>
      </aside>
    </section>
    <CTABand />
  </main>;
}
