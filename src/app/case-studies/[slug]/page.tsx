import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkflowCover } from "@/components/case-studies/WorkflowCover";
import { toCaseStudyPreview } from "@/components/case-studies/library";
import styles from "@/components/case-studies/case-studies.module.css";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { Mdx } from "@/components/Mdx";
import { getCaseStudies, getBySlug, getIndustries, getServices } from "@/content/load";
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
  const preview = toCaseStudyPreview(c, getIndustries(), getServices());
  return (
    <main>
      <header className="container-x page-intro">
        <SectionHeading as="h1" eyebrow={c.illustrative ? "Illustrative workflow example" : "Workflow example"} title={c.title}>{preview.editorial.deck}</SectionHeading>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {industry && <p>Industry: <Link className="text-accent underline" href={`/industries/${industry.slug}`}>{industry.title}</Link></p>}
            {service && <p>Service: <Link className="text-accent underline" href={`/services/${service.slug}`}>{service.title}</Link></p>}
        </div>
      </header>
      <section className="container-x detail-content">
        <div className="detail-grid">
        <article>
        <h2 className="font-display section-title">Situation</h2>
        <p className="prose-x mt-3">{c.situation}</p>
        <h2 className="mt-10 font-display text-[length:var(--text-step-2)]">Proposed approach</h2>
        <p className="prose-x mt-3">{c.built}</p>
        <Mdx source={c.body} />
        </article>
        <aside>
          <div className={styles.detailCover}><WorkflowCover study={preview} /></div>
          <div className="detail-panel">
            <h2 className="font-display text-lg">Intended benefit</h2>
            <p className="mt-3 text-sm text-muted">{c.result.summary}</p>
            <p className="mt-4 text-sm text-muted">This is an illustrative design, not a verified customer result.</p>
          </div>
        </aside>
        </div>
        <Link href="/case-studies" className="mt-10 inline-block text-sm font-medium text-accent underline underline-offset-4">Explore all workflow examples</Link>
      </section>
      <CTABand />
      <JsonLd data={articleJsonLd({ title: c.title, description: c.seo.description, path: `/case-studies/${c.slug}`, publishedAt: `${c.result.date}-01`, updatedAt: `${c.result.date}-01`, authorName: siteConfig.name })} />
    </main>
  );
}
