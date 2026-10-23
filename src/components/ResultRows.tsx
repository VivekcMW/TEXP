import Link from "next/link";
import type { CaseStudy } from "@/content/schemas";
import { Glyph } from "./Glyph";

export function ResultRows({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return (
    <ol className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
      {caseStudies.map((c) => (
        <li key={c.slug} className="group relative grid gap-6 p-6 transition-colors hover:bg-tint/60 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:gap-8 md:p-8">
          <div className="flex gap-4">
            <Glyph id={c.industry} />
            <div className="min-w-0">
              <p className="text-xs text-muted">{c.client}</p>
              <h3 className="mt-1 text-lg font-medium leading-snug">
                <Link href={`/case-studies/${c.slug}`} className="after:absolute after:inset-0">{c.title}</Link>
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted">{c.result.summary}</p>
          <div className="flex items-center gap-3">
            <span className="text-accent" aria-hidden>&rarr;</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
