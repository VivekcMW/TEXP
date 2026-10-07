import Link from "next/link";
import type { Service } from "@/content/schemas";
export function ServiceCard({ service: s }: { service: Service }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{s.targetQuery}</p>
      <h3 className="mt-3 font-display text-xl"><Link href={`/services/${s.slug}`} className="hover:underline">{s.title}</Link></h3>
      <p className="mt-2 text-sm text-muted">{s.summary}</p>
      <p className="mt-4 text-xs text-muted">{s.timelineWeeks} weeks</p>
    </article>
  );
}
