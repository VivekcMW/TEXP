import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";
export const metadata = buildMetadata({ title: "Privacy policy", description: "What this site collects, why, how long it is kept, and how to ask for it to be deleted. Plain language, no tracking you did not ask for.", path: "/privacy" });
export default function PrivacyPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" title="Privacy policy" />
        <div className="prose-x mt-8 space-y-4 text-muted">
          <p><strong className="text-ink">What we collect.</strong> If you submit a form, we store the fields you typed: email, name, company, your message and, for the ROI calculator, the inputs you entered. If analytics are enabled, we record page views and a small number of events such as a booking click, without cookies that identify you.</p>
          <p><strong className="text-ink">Why.</strong> To reply to you, to send you the article updates you asked for, and to understand which pages are useful.</p>
          <p><strong className="text-ink">How long.</strong> Form submissions are kept for 24 months unless you ask us to delete them sooner. Analytics are aggregated and hold no personal data.</p>
          <p><strong className="text-ink">Who sees it.</strong> Our team and the booking and email providers we use to run the site. We do not sell or share your data with anyone else.</p>
          <p><strong className="text-ink">Your rights.</strong> Email <a href={`mailto:${siteConfig.contactEmail}`} className="text-accent underline">{siteConfig.contactEmail}</a> to see, correct or delete what we hold about you. We reply within 30 days.</p>
          <p><strong className="text-ink">Controller.</strong> {siteConfig.legalName}. Last updated 7 October 2026.</p>
        </div>
      </section>
    </main>
  );
}
