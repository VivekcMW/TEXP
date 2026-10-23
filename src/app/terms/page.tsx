import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
export const metadata = buildMetadata({ title: "Terms of use", description: "Terms for this website preview, its qualitative assessment and workflow examples. No commercial enquiry delivery is configured.", path: "/terms" });
export default function TermsPage() {
  return (
    <main>
      <section className="container-x page-intro">
        <SectionHeading as="h1" title="Terms of use" />
      </section>
      <section className="container-x detail-content">
        <div className="prose-x mx-auto space-y-6 text-muted">
          <p><strong className="text-ink">The preview.</strong> This website demonstrates proposed AI workflow services. It does not constitute a commercial offer. Company identity, contact details and engagement terms must be verified before public launch.</p>
          <p><strong className="text-ink">Workflow assessment.</strong> This tool provides qualitative discussion prompts from your answers. It is not a readiness certification, financial forecast or quote. Scope, pricing and schedules are confirmed in a written proposal after reviewing your requirements.</p>
          <p><strong className="text-ink">Workflow examples.</strong> Workflow examples describe proposed approaches, not verified customer results. They do not promise savings, processing times, delivery dates or other outcomes.</p>
          <p><strong className="text-ink">No warranty.</strong> We keep the site accurate but make no guarantee that it is complete or error-free, and we are not liable for decisions made on it alone.</p>
          <p><strong className="text-ink">Enquiries.</strong> Booking and commercial enquiry delivery are not configured in this preview. Do not submit personal or confidential information for local testing.</p>
        </div>
      </section>
    </main>
  );
}
