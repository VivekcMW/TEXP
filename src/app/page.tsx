import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ResultRows } from "@/components/ResultRows";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CTABand } from "@/components/CTABand";
import { StackStrip } from "@/components/StackStrip";
import { JsonLd } from "@/components/JsonLd";
import { getCaseStudies } from "@/content/load";
import { buildMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: `${siteConfig.name} — ${siteConfig.tagline}`.slice(0, 60), description: siteConfig.positioning, path: "/" });

export default function Home() {
  const caseStudies = [...getCaseStudies()].sort((a, b) => (a.result.date < b.result.date ? 1 : -1)).slice(0, 3);
  return (
    <main>
      <Hero />
      <section className="container-x section-space">
        <SectionHeading eyebrow="Workflow examples" title="Recognisable work. A different approach.">From incoming requests to evidence ready for review. Explore workflows and the decisions that stay with your team.</SectionHeading>
        <div className="mt-12"><ResultRows caseStudies={caseStudies} /></div>
      </section>
      <StackStrip />
      <ProcessSteps />
      <CTABand />
      <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
    </main>
  );
}
