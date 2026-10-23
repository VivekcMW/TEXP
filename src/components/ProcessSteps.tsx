const steps = [
  { name: "Discovery", focus: "Understand the work", body: "Map the process, confirm access and approval needs, and agree what a useful pilot should test." },
  { name: "Pilot", focus: "Evaluate in context", body: "Build a bounded workflow, evaluate it alongside the current process and review the evidence with your team." },
  { name: "Scale", focus: "Expand when justified", body: "Consider a wider rollout only when evaluation supports it, with monitoring, ownership and review practices in place." },
];
export function ProcessSteps() {
  return (
    <section>
      <div className="container-x section-space">
        <div className="max-w-3xl">
          <h2 className="font-display text-[length:var(--text-step-3)] leading-[1.08] tracking-tight">How an engagement runs</h2>
          <p className="mt-4 text-muted">Scope, pricing and delivery schedules depend on your requirements. Each stage has agreed deliverables and a review before proceeding.</p>
        </div>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          <span className="absolute top-5 right-0 left-0 hidden h-px bg-line md:block" aria-hidden />
          {steps.map((s, i) => (
            <li key={s.name} className="relative flex gap-5 md:block">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-lg text-accent shadow-[var(--shadow-card)]">{i + 1}</span>
              <div className="md:mt-6">
                <p className="text-sm text-muted">{s.focus}</p>
                <h3 className="mt-1 font-display text-xl">{s.name}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-accent">
          <Link href="/services" className="underline underline-offset-4">Explore our services</Link>
          <Link href="/tools/ai-roi-calculator" className="underline underline-offset-4">Use the workflow discussion guide</Link>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
