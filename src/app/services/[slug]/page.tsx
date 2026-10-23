import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { DiagramById } from "@/components/diagrams";
import { FAQ } from "@/components/FAQ";
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
      <header className="container-x page-intro">
        <SectionHeading as="h1" eyebrow="Services" title={s.title}>{s.summary}</SectionHeading>
        <Link href="/contact" className="btn btn-primary mt-6" data-cta="primary">Discuss your workflow</Link>
      </header>
      <section className="container-x detail-content">
        <div className="detail-grid">
          <div>
            <Mdx source={s.body} />
            <h2 className="mt-10 font-display section-title">The challenge</h2>
            <p className="prose-x mt-3 text-muted">{s.problem}</p>
            <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Our approach</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">{s.approach.map((a) => <li key={a}>{a}</li>)}</ol>
          </div>
          <aside className="detail-panel bg-tint">
            <h2 className="font-display section-title">What you could take forward</h2>
            <p className="mt-3 text-sm text-muted">Representative outputs, confirmed in the agreed scope.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
            <p className="mt-6 text-sm text-muted">{s.timeline} Pricing and milestones are confirmed in a written proposal.</p>
          </aside>
        </div>
        <div className="mx-auto mt-10 max-w-3xl"><DiagramById id={s.diagram} /></div>
        {cs && <div className="mt-10"><h2 className="mb-6 font-display section-title">Explore a related workflow</h2><CaseStudyCard caseStudy={cs} /></div>}
      </section>
      <FAQ items={s.faq} />
      <CTABand />
      <JsonLd data={serviceJsonLd(s)} />
    </main>
  );
}
