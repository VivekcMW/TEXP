import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";

export const metadata = buildMetadata({ title: "Privacy information", description: `How ${siteConfig.name} handles enquiries, assessment answers and website requests.`, path: "/privacy" });
export default function PrivacyPage() {
  const company = siteConfig.legalName || siteConfig.name;
  const email = siteConfig.contactEmail;
  return <main>
    <header className="container-x page-intro"><SectionHeading as="h1" title="Privacy information" /></header>
    <section className="container-x detail-content">
      <div className="prose-x mx-auto space-y-6 text-muted">
        <p><strong className="text-ink">Who we are.</strong> This website is operated by {company}.{email && <> For any privacy question or request, email <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">{email}</a>.</>}</p>
        <p><strong className="text-ink">Enquiries.</strong> When you email us, we receive your email address and anything you include in your message. We use it only to respond to your enquiry and any follow-up conversation you ask for. Do not send confidential records, patient information or credentials.</p>
        <p><strong className="text-ink">Workflow assessment.</strong> Your answers remain in the page and are not submitted or saved by the site. Reloading the page clears them. The assessment does not request an email address.</p>
        <p><strong className="text-ink">Analytics and cookies.</strong> We do not use analytics, advertising trackers or marketing cookies. Our hosting provider keeps standard technical request logs to operate and secure the site. Interactive scenes use scripted examples, not customer records.</p>
        <p><strong className="text-ink">Retention and your rights.</strong> We keep enquiry correspondence only as long as needed to respond and maintain our business records, unless the law requires longer. You can ask us to access, correct or delete the information you have sent us{email ? " by emailing the address above" : ""}.</p>
        <p><strong className="text-ink">Changes.</strong> We will update this page if the way we handle information changes, for example if we add an online enquiry form.</p>
      </div>
    </section>
  </main>;
}
