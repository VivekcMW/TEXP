/** Simple line glyphs keyed by content slug. Unknown slugs get a neutral node mark. */
const paths: Record<string, React.ReactNode> = {
  "ai-automation": <><path d="M4 12a8 8 0 0 1 14-5.3" /><path d="M20 12a8 8 0 0 1-14 5.3" /><path d="M18 3v4h-4" /><path d="M6 21v-4h4" /></>,
  "ai-strategy-readiness": <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>,
  "ai-talent-staffing": <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14a6 6 0 0 1 3.5 6" /></>,
  "custom-ai-agents": <><rect x="5" y="7" width="14" height="11" rx="3" /><path d="M12 3v4" /><circle cx="9.5" cy="12.5" r="1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="12.5" r="1" fill="currentColor" stroke="none" /></>,
  "enterprise-ai-solutions": <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17l9 5 9-5" /></>,
  "llm-rag-integration": <><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v5h5" /><path d="M8 13h8" /><path d="M8 17h5" /></>,
  healthcare: <><path d="M12 4v16" /><path d="M4 12h16" /></>,
  logistics: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  retail: <><path d="M4 8h16l-1.5 11h-13z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  manufacturing: <><path d="M3 20V9l5 3V9l5 3V9l5 3v8H3z" /><path d="M7 20v-3h3v3" /><path d="M17 5V3" /></>,
  "energy-utilities": <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></>,
  telecommunications: <><path d="M12 20v-7" /><circle cx="12" cy="11" r="2" /><path d="M8 7a6 6 0 0 1 8 0" /><path d="M5 4a10 10 0 0 1 14 0" /></>,
  "public-sector": <><path d="M3 10l9-6 9 6" /><path d="M5 10v8" /><path d="M10 10v8" /><path d="M14 10v8" /><path d="M19 10v8" /><path d="M3 21h18" /></>,
};
const fallback = <><circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="1.5" /><circle cx="19" cy="6" r="1.5" /><circle cx="12" cy="20" r="1.5" /><path d="M6.3 7l3.4 3M17.7 7l-3.4 3M12 15v3.5" /></>;

export function Glyph({ id, className }: { id: string; className?: string }) {
  return (
    <span className={className ?? "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-glow text-accent"} aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[id] ?? fallback}</svg>
    </span>
  );
}
