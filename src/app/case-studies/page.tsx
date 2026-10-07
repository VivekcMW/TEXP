import { SectionHeading } from "@/components/SectionHeading";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { getCaseStudies } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI case studies with numbers, units and dates", description: "Agentic workflow case studies in logistics, retail and healthcare, each with the situation, what was built and a measured result.", path: "/case-studies" });

export default function CaseStudiesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Case studies", path: "/case-studies" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Proof" title="AI case studies with numbers, units and dates">Studies marked illustrative are representative of engagements of this type; real numbers replace them as clients approve publication.</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-3">{getCaseStudies().map((c) => <CaseStudyCard key={c.slug} caseStudy={c} />)}</div>
      </section>
      <CTABand />
    </main>
  );
}
