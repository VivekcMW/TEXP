import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { ROICalculator } from "@/components/roi/ROICalculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI ROI calculator for operations teams", description: "Estimate the annual hours and cost an agentic workflow would save on one process, and the payback on a fixed-price pilot.", path: "/tools/ai-roi-calculator" });
const faq = [
  { q: "How is the saving calculated?", a: "People × hours per week × 48 weeks × the share you expect to automate × loaded hourly cost." },
  { q: "Is 60% automation realistic?", a: "For document-heavy, rules-with-exceptions work, 50 to 80% is typical in our pilots. Fully unstructured judgement work is lower." },
  { q: "What does the payback compare against?", a: "The 'from' price of a pilot shown on our services pages." },
];
export default function RoiPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Tools", path: "/tools/ai-roi-calculator" }, { name: "AI ROI calculator", path: "/tools/ai-roi-calculator" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Free tool" title="What would automating one process save you?">Change the four inputs. The summary is free; the payback breakdown asks for a work email.</SectionHeading>
        <div className="mt-12"><ROICalculator /></div>
      </section>
      <FAQ items={faq} />
      <CTABand />
    </main>
  );
}
