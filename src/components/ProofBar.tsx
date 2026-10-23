import { siteConfig } from "@site-config";
export function ProofBar() {
  return (
    <section aria-label="Proof" className="band">
      <div className="container-x grid items-center gap-10 py-12 md:grid-cols-[auto_1fr] md:gap-16">
        <p className="text-sm text-muted">{siteConfig.engagementNote}</p>
        <div>
          <p className="text-sm text-muted">Trusted by operations leaders at</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <li key={n}><img src={`/logos/logo-${n}.svg`} alt={`Client ${n} logo placeholder`} width={112} height={28} loading="lazy" className="h-6 w-auto opacity-70" /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
