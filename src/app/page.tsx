import { Hero } from "@/components/Hero";
import { SceneSlot } from "@/components/scenes/SceneSlot";
import { ProofBar } from "@/components/ProofBar";
import { SectionHeading } from "@/components/SectionHeading";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { getCaseStudies, getServices } from "@/content/load";
import { buildMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: `${siteConfig.name} — ${siteConfig.tagline}`.slice(0, 60), description: siteConfig.positioning, path: "/" });

export default function Home() {
  const caseStudies = getCaseStudies();
  const services = getServices();
  return (
    <main>
      <Hero visual={<SceneSlot id="agentic-field" priority />} />
      <ProofBar />
      <section className="container-x my-20">
        <SectionHeading eyebrow="Proof" title="Three processes, three measured results">We publish the number, the unit and the date. Illustrative studies are labelled.</SectionHeading>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{caseStudies.map((c) => <CaseStudyCard key={c.slug} caseStudy={c} />)}</div>
      </section>
      <section className="container-x my-20">
        <SectionHeading eyebrow="Services" title="One costly process at a time" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">{services.map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      </section>
      <ProcessSteps />
      <CTABand />
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
    </main>
  );
}
