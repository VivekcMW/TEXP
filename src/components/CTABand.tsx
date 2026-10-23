import Link from "next/link";
export function CTABand({ title = "Start with a process you know.", body = "Bring the work, the systems involved and the decisions that need your team. Together, we can explore a useful starting point." }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="container-x section-space">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-accent-ink md:p-12">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-accent-2/40 blur-3xl" aria-hidden />
        <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_auto]">
          <div>
            <h2 id="cta-title" className="font-display text-[length:var(--text-step-3)] leading-[1.08] tracking-tight text-balance">{title}</h2>
            <p className="prose-x mt-4 text-white/80">{body}</p>
          </div>
          <Link href="/contact" data-cta="primary" className="btn btn-inverse md:justify-self-end">Discuss your workflow</Link>
        </div>
      </div>
    </section>
  );
}
