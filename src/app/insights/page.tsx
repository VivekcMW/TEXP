import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { getInsights } from "@/content/load";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "AI insights for operations and finance leaders", description: "Straight answers to the questions buyers of AI consulting ask: pilot costs, RAG versus fine-tuning, readiness, build versus buy.", path: "/insights" });

export default function InsightsPage() {
  return (
    <main>
      <Breadcrumbs items={[{ name: "Insights", path: "/insights" }]} />
      <section className="container-x py-12">
        <SectionHeading as="h1" eyebrow="Insights" title="Answers to the questions a VP types at 11pm">Written from delivery, with a point of view. No vendor pitch.</SectionHeading>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {getInsights().map((a) => (
            <li key={a.slug} className="py-6">
              <p className="text-xs text-muted">{a.updatedAt} · {a.targetQuery}</p>
              <h2 className="mt-1 font-display text-[length:var(--text-step-1)]"><Link href={`/insights/${a.slug}`} className="hover:underline">{a.title}</Link></h2>
              <p className="prose-x mt-2 text-muted">{a.summary}</p>
            </li>
          ))}
        </ul>
        <form action="/api/leads" method="post" className="mt-12 flex max-w-md flex-col gap-2 rounded-2xl border border-line bg-surface p-6">
          <label htmlFor="subscribe-email" className="text-sm font-medium">Get new articles by email</label>
          <input id="subscribe-email" name="email" type="email" required placeholder="you@company.com" className="rounded-xl border border-line bg-bg px-3 py-2" />
          <input type="hidden" name="source" value="subscribe" />
          <button className="mt-2 w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink">Subscribe</button>
        </form>
      </section>
      <CTABand />
    </main>
  );
}
