import { siteConfig } from "@site-config";
import { formatMoney } from "@/lib/utils";
const steps = [
  { name: "Discovery sprint", weeks: "2 weeks", body: "We map one process, quantify the saving and write the pilot plan. You get a go/no-go number.", price: siteConfig.pricing.discoverySprint },
  { name: "Pilot", weeks: "6–8 weeks", body: "We build the agent, run it beside the current process and measure against the baseline.", price: siteConfig.pricing.pilot },
  { name: "Scale", weeks: "Quarterly", body: "We roll out across teams and regions, with monitoring and a retraining cadence.", price: siteConfig.pricing.scale },
];
export function ProcessSteps() {
  return (
    <section className="container-x my-20">
      <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">How an engagement runs</h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.name} className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-xs text-muted">Step {i + 1} · {s.weeks}</p>
            <h3 className="mt-2 font-display text-xl">{s.name}</h3>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
            <p className="mt-4 text-sm font-medium">from {formatMoney(s.price, siteConfig.pricing.currency)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
