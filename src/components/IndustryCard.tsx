import Link from "next/link";
import type { Industry } from "@/content/schemas";
import { Glyph } from "./Glyph";
export function IndustryCard({ industry: i }: { industry: Industry }) {
  return (
    <article className="card group relative flex flex-col rounded-2xl p-6 transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow-[var(--shadow-panel)]">
      <Glyph id={i.slug} />
      <h3 className="mt-5 font-display text-xl leading-snug">
        <Link href={`/industries/${i.slug}`} className="after:absolute after:inset-0">{i.title}</Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{i.summary}</p>
      <p className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
        <span className="first-letter:uppercase">{i.targetQuery}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="transition-transform group-hover:translate-x-0.5"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </p>
    </article>
  );
}
