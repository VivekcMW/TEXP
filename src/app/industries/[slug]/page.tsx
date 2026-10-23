import { notFound } from "next/navigation";
import Link from "next/link";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { toIndustryExperience } from "@/components/industries/experiences";
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
      <IndustryHero key={i.slug} industries={[toIndustryExperience(i)]} />
      <section id="industry-workflows" className="container-x scroll-mt-24 section-space">
        <div className="detail-grid">
          <div>
            <h2 className="font-display section-title">Operational challenges</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">{i.pains.map((p) => <li key={p}>{p}</li>)}</ul>
            <Mdx source={i.body} />
          </div>
          <aside className="detail-panel bg-tint">
            <h2 className="font-display section-title">Requirements to address</h2>
            <p className="mt-3 text-sm text-muted">Confirm these design requirements with your operational, legal and compliance owners. They are not a certification or assurance of compliance.</p>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm">{i.compliance.map((c) => <li key={c}>{c}</li>)}</ul>
            <h3 className="mt-8 font-display text-lg">Relevant services</h3>
            <ul className="mt-3 space-y-2">{services.map((s) => <li key={s.slug}><Link className="text-accent underline" href={`/services/${s.slug}`}>{s.title}</Link></li>)}</ul>
          </aside>
        </div>
        {cs && <div className="mt-12"><h2 className="mb-6 font-display section-title">A workflow to explore</h2><CaseStudyCard caseStudy={cs} /></div>}
      </section>
      <FAQ items={i.faq} />
      <CTABand />
    </main>
  );
}
