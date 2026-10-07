import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@site-config";
import { BookingEmbed } from "@/components/BookingEmbed";

export const metadata = buildMetadata({ title: "Book a 30-minute AI audit", description: "Pick a slot. You describe one process; we tell you what it would cost to automate and what it would save. No deck, no pitch.", path: "/contact" });

export default function ContactPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Contact" title="Pick a slot">Thirty minutes. You describe one process; we tell you what it would cost to automate and what it would save.</SectionHeading>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <BookingEmbed url={siteConfig.bookingUrl} email={siteConfig.contactEmail} />
          </div>
          <form action="/api/leads" method="post" className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <p className="font-medium">Prefer to write first?</p>
            <label className="text-sm">Name<input name="name" required className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
            <label className="text-sm">Work email<input name="email" type="email" required className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
            <label className="text-sm">Company<input name="company" className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
            <label className="text-sm">One process you would automate<textarea name="message" rows={4} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" /></label>
            <input type="hidden" name="source" value="contact" />
            <button className="w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink">Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}
