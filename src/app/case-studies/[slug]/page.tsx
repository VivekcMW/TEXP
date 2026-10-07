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
          <div className="text-sm text-muted md:col-span-2">
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
