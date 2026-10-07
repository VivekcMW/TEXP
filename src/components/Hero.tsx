import Link from "next/link";
import { siteConfig } from "@site-config";
export function Hero({ visual }: { visual?: React.ReactNode }) {
  return (
    <section className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">Agentic AI consulting</p>
        <h1 className="font-display text-[length:var(--text-step-5)] leading-[0.98] tracking-tight">{siteConfig.tagline}</h1>
        <p className="prose-x mt-6 text-lg text-muted">{siteConfig.positioning} Fixed-price pilots, measured against your baseline, in eight weeks.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={siteConfig.bookingUrl} data-cta="primary" className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Book a 30-min AI audit</a>
          <Link href="/case-studies" className="rounded-full border border-line px-6 py-3 font-medium">See the case studies</Link>
        </div>
      </div>
      <div className="relative aspect-square md:aspect-[4/5]">{visual}</div>
    </section>
  );
}
