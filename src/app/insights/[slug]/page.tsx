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
  const author = siteConfig.founders.find((f) => f.id === a.author) ?? siteConfig.founders[0];
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
