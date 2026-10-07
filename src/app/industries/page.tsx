import { SectionHeading } from "@/components/SectionHeading";
import { IndustryCard } from "@/components/IndustryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { getIndustries } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI consulting by industry", description: "Agentic workflow consulting for logistics, retail, healthcare and financial services, each with its own case study and compliance notes.", path: "/industries" });

export default function IndustriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Industries", path: "/industries" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Industries" title="AI consulting by industry">We have built in each of these. The pages below name the processes where the cost hides and the compliance rules that shape the work.</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">{getIndustries().map((i) => <IndustryCard key={i.slug} industry={i} />)}</div>
      </section>
      <CTABand />
    </main>
  );
}
