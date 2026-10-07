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
