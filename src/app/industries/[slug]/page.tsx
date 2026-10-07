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
