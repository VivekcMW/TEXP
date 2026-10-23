import { SectionHeading } from "@/components/SectionHeading";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { WorkflowAssessment } from "@/components/WorkflowAssessment";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI workflow assessment for your team", description: "Explore process clarity, data access and human review needs with a qualitative discussion guide. No cost, savings or delivery forecasts.", path: "/tools/ai-roi-calculator" });
const faq = [
  { q: "Does this estimate savings or a delivery date?", a: "No. It highlights questions to discuss before a pilot. Costs, timing and potential benefits depend on your process, systems and review requirements." },
  { q: "Does the guide confirm that we are ready?", a: "No. Your answers are a starting point for discovery, not an independent validation or readiness certification." },
  { q: "What happens to my answers?", a: "They remain in this page and are not submitted. You can discuss them with your team or bring them to a workflow conversation." },
];
export default function RoiPage() {
  return (
    <main>
      <header className="container-x page-intro">
        <SectionHeading as="h1" eyebrow="Discussion guide" title="Explore your workflow before you commit">Consider the process, information access and human decisions first. This assessment offers qualitative next steps, not prices, savings or delivery promises.</SectionHeading>
      </header>
      <section className="container-x detail-content" aria-label="Workflow discussion guide"><div className="card rounded-3xl"><WorkflowAssessment /></div></section>
      <FAQ items={faq} />
      <CTABand />
    </main>
  );
}
