import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: "Terms of use", description: `Terms for using the ${siteConfig.name} website, its qualitative assessment and workflow examples.`, path: "/terms" });
export default function TermsPage() {
  const company = siteConfig.legalName || siteConfig.name;
  const email = siteConfig.contactEmail;
  return (
    <main>
      <section className="container-x page-intro">
        <SectionHeading as="h1" title="Terms of use" />
      </section>
      <section className="container-x detail-content">
        <div className="prose-x mx-auto space-y-6 text-muted">
          <p><strong className="text-ink">About this website.</strong> This website is operated by {company}. It describes our AI workflow services for information only and is not a commercial offer.</p>
          <p><strong className="text-ink">Workflow assessment.</strong> This tool provides qualitative discussion prompts from your answers. It is not a readiness certification, financial forecast or quote. Scope, pricing and schedules are confirmed in a written proposal after reviewing your requirements.</p>
          <p><strong className="text-ink">Workflow examples.</strong> Workflow examples describe proposed approaches, not verified customer results. They do not promise savings, processing times, delivery dates or other outcomes.</p>
          <p><strong className="text-ink">No warranty.</strong> We keep the site accurate but make no guarantee that it is complete or error-free, and we are not liable for decisions made on it alone.</p>
          <p><strong className="text-ink">Enquiries.</strong> Any engagement is governed by a separate written agreement.{email && <> Questions about these terms can be sent to <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">{email}</a>.</>}</p>
        </div>
      </section>
    </main>
  );
}
