import { siteConfig } from "@site-config";
export function CTABand({ title = "See where agentic workflows would cut your operating cost", body = "A 30-minute audit: you describe one process, we tell you what it would cost to automate and what it would save." }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="container-x my-24">
      <div className="rounded-3xl border border-line bg-surface p-8 md:p-14">
        <h2 id="cta-title" className="font-display text-[length:var(--text-step-3)] leading-[1.08] tracking-tight">{title}</h2>
        <p className="prose-x mt-4 text-muted">{body}</p>
        <a href={siteConfig.bookingUrl} data-cta="primary" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Book a 30-min AI audit</a>
      </div>
    </section>
  );
}
