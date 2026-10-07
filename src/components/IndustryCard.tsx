import Link from "next/link";
import type { Industry } from "@/content/schemas";
export function IndustryCard({ industry: i }: { industry: Industry }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{i.targetQuery}</p>
      <h3 className="mt-3 font-display text-xl"><Link href={`/industries/${i.slug}`} className="hover:underline">{i.title}</Link></h3>
      <p className="mt-2 text-sm text-muted">{i.summary}</p>
    </article>
  );
}
