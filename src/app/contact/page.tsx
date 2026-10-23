import { SectionHeading } from "@/components/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";
import { BookingEmbed } from "@/components/BookingEmbed";
import { ContactForm } from "@/components/ContactForm";
import { isLeadCaptureEnabled } from "@/lib/leads/provider";

export const metadata = buildMetadata({ title: "Discuss your AI workflow", description: "Start with the process, the systems involved and the decisions that need your team. Explore requirements before agreeing a delivery scope.", path: "/contact" });

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return <main>
    <header className="container-x page-intro">
      <SectionHeading as="h1" eyebrow="Contact" title="Let’s talk about your workflow">Start with one recurring task or difficult handoff. Describe what happens today and where your people need to stay in control.</SectionHeading>
    </header>
    <section className="container-x detail-content">
      <div className="detail-grid">
        <ContactForm enabled={isLeadCaptureEnabled()} email={siteConfig.contactEmail} initiallySaved={sent === "1"} />
        <aside className="space-y-8">
          <div>
            <h2 className="font-display text-2xl">A useful starting conversation</h2>
            <ul className="mt-5 space-y-4 text-muted">
              <li className="border-b border-line pb-4">The work your team repeats and the exceptions that make it difficult.</li>
              <li className="border-b border-line pb-4">The systems, information owners and access requirements involved.</li>
              <li>The decisions, evidence and evaluation needed before a pilot.</li>
            </ul>
          </div>
          {siteConfig.bookingUrl && <BookingEmbed url={siteConfig.bookingUrl} email={siteConfig.contactEmail} />}
        </aside>
      </div>
    </section>
  </main>;
}
