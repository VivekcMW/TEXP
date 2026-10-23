import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { toIndustryExperience } from "@/components/industries/experiences";
import { CTABand } from "@/components/CTABand";
import { getIndustries } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI consulting by industry", description: "Explore sector-specific AI workflows, operational challenges and requirements, with examples and human review points.", path: "/industries" });

export default function IndustriesPage() {
  const industries = getIndustries().map(toIndustryExperience);
  industries.sort((a, b) => Number(b.slug === "logistics") - Number(a.slug === "logistics"));
  return (
    <main>
      <IndustryHero industries={industries} />
      <nav className="container-x section-space" aria-label="All industry guides">
        <SectionHeading eyebrow="Find your sector" title="Different work. Different requirements.">Explore the processes, systems and human decisions that shape an approach for your industry.</SectionHeading>
        <div className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {industries.map((i) => <Link key={i.slug} href={`/industries/${i.slug}`} className="group border-b border-line pb-6">
            <h3 className="font-display text-lg group-hover:text-accent">{i.title} <span aria-hidden="true">&#8599;</span></h3>
            <p className="mt-2 text-sm text-muted">{i.summary}</p>
          </Link>)}
        </div>
      </nav>
      <CTABand />
    </main>
  );
}
