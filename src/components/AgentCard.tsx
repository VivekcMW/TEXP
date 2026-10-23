import Link from "next/link";
import type { Agent, CaseStudy } from "@/content/schemas";
import { Glyph } from "./Glyph";

export function AgentCard({ agent: a, caseStudy: c, industryName }: { agent: Agent; caseStudy?: CaseStudy; industryName: string }) {
  const gates = a.tools.filter((t) => t.approval !== "none").length;
  return (
    <article className="card group relative flex flex-col rounded-3xl p-6 transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow-[var(--shadow-panel)]">
      <div className="flex items-start justify-between gap-4">
        <Glyph id={a.industry} />
        <span className="rounded-full bg-tint px-2.5 py-1 text-xs font-medium text-muted">{industryName}</span>
      </div>
      <h3 className="mt-5 font-display text-xl leading-snug">
        <Link href={`/agents/${a.slug}`} className="after:absolute after:inset-0">{a.title}</Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{a.summary}</p>
      {c?.before && c.after && (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          <div className="bg-tint px-4 py-3"><p className="text-xs text-muted">Current challenge</p><p className="mt-1 text-sm text-muted">{c.before}</p></div>
          <div className="bg-glow/50 px-4 py-3"><p className="text-xs text-accent">Proposed approach</p><p className="mt-1 text-sm text-accent">{c.after}</p></div>
        </div>
      )}
      <p className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">{a.steps.length} steps, {gates} human {gates === 1 ? "gate" : "gates"}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-accent">
          See the agent
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="transition-transform group-hover:translate-x-0.5"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </p>
    </article>
  );
}
