import Link from "next/link";
import type { CaseStudy } from "@/content/schemas";
import { IllustrativeBadge } from "./IllustrativeBadge";
export function CaseStudyCard({ caseStudy: c }: { caseStudy: CaseStudy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-6">
      <p className="font-display text-[length:var(--text-step-3)] leading-none">{c.result.value}{c.result.unit}</p>
      <p className="mt-1 text-sm text-muted">{c.result.metric} {c.result.period} · {c.result.date}</p>
      <h3 className="mt-4 text-lg font-medium"><Link href={`/case-studies/${c.slug}`} className="hover:underline">{c.title}</Link></h3>
      <p className="mt-1 text-sm text-muted">{c.client}</p>
      {c.illustrative && <div className="mt-4"><IllustrativeBadge /></div>}
    </article>
  );
}
