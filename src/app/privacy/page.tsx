import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Privacy information for this preview", description: "How this preview handles local test submissions and assessment answers. No live enquiry delivery, booking or analytics service is enabled.", path: "/privacy" });
export default function PrivacyPage() {
  return <main>
    <header className="container-x page-intro"><SectionHeading as="h1" title="Privacy information" /></header>
    <section className="container-x detail-content">
      <div className="prose-x mx-auto space-y-6 text-muted">
        <p><strong className="text-ink">Website preview.</strong> This site is not accepting commercial enquiries. Live enquiry delivery and booking are disabled until real contact details and an appropriate delivery service are configured. The contact form can be enabled for local development testing only, as described below.</p>
        <p><strong className="text-ink">Workflow assessment.</strong> Your answers remain in the page and are not submitted or saved by the site. Reloading the page clears them. The assessment does not request an email address.</p>
        <p><strong className="text-ink">Analytics and browsing.</strong> No analytics provider is enabled in this preview. The development or hosting server may keep technical request logs; its operator controls those logs. Interactive scenes use scripted examples, not customer records.</p>
        <p><strong className="text-ink">Local development testing.</strong> A developer can explicitly enable local enquiry storage outside production. That mode is labelled in the form and writes test submissions to the development machine, not to an email service. Use synthetic information and delete test records after checking the flow.</p>
        <p><strong className="text-ink">Before public launch.</strong> Verified controller and contact details, actual processors, retention practices and applicable rights information must be provided here before collection is enabled. There is no newsletter subscription or article-update service.</p>
      </div>
    </section>
  </main>;
}
