import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { getServices } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI consulting services for operations leaders", description: "Six services, each built around one costly process: automation, LLM and RAG integration, strategy, custom agents, enterprise solutions and staffing.", path: "/services" });

export default function ServicesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Services" title="Pick the process. We bring the agents.">Every engagement starts with one measurable process and ends with a number you can take to the board.</SectionHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{getServices().map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      </section>
      <CTABand />
    </main>
  );
}
