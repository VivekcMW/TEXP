import { siteConfig } from "@site-config";
import { StatBlock } from "./StatBlock";
export function ProofBar() {
  return (
    <section aria-label="Proof" className="container-x my-16 grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <StatBlock value={siteConfig.headlineNumber.value} label={siteConfig.headlineNumber.label} />
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-70">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <li key={n}><img src={`/logos/logo-${n}.svg`} alt={`Client ${n} logo placeholder`} width={96} height={28} loading="lazy" /></li>
        ))}
      </ul>
    </section>
  );
}
