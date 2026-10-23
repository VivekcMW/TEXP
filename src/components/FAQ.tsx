import { JsonLd } from "./JsonLd";
import { faqJsonLd } from "@/lib/seo";
export function FAQ({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <section className="container-x pb-8">
      <h2 className="font-display text-[length:var(--text-step-2)] tracking-tight">Questions buyers ask</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="cursor-pointer py-2 font-medium marker:text-accent">{f.q}</summary>
            <p className="prose-x mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}
