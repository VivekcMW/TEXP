import Link from "next/link";
import type { CaseStudy } from "@/content/schemas";
import { IllustrativeBadge } from "./IllustrativeBadge";

export function CaseStudyCard({ caseStudy: c }: { caseStudy: CaseStudy }) {
  return (
    <article className="card flex flex-col overflow-hidden rounded-3xl p-6">
      <p className="text-xs text-muted">{c.client}</p>
      <h3 className="mt-3 text-lg font-medium leading-snug"><Link href={`/case-studies/${c.slug}`} className="hover:text-accent">{c.title}</Link></h3>
      <p className="mt-4 text-sm text-muted">{c.result.summary}</p>
      {c.before && c.after && <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
        <div><dt className="text-xs text-muted">Current challenge</dt><dd className="mt-1">{c.before}</dd></div>
        <div><dt className="text-xs text-muted">Proposed approach</dt><dd className="mt-1 text-accent">{c.after}</dd></div>
      </dl>}
      {c.illustrative && <div className="mt-auto pt-5"><IllustrativeBadge /></div>}
    </article>
  );
}
