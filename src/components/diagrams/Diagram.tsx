export function Diagram({ title, description, caption, viewBox, children }: { title: string; description: string; caption: string; viewBox: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <figure className="my-10">
      <svg viewBox={viewBox} role="img" aria-labelledby={`${id}-t ${id}-d`} className="w-full text-ink" fontFamily="var(--font-sans)" fontSize="12">
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{description}</desc>
        {children}
      </svg>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function Box({ x, y, w = 120, h = 48, label, sub, accent = false }: { x: number; y: number; w?: number; h?: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={10} fill="var(--color-surface)" stroke={accent ? "var(--color-accent)" : "var(--color-line)"} strokeWidth={accent ? 1.5 : 1} />
      <text x={w / 2} y={sub ? h / 2 - 4 : h / 2 + 4} textAnchor="middle" fill="currentColor" fontWeight={500}>{label}</text>
      {sub && <text x={w / 2} y={h / 2 + 12} textAnchor="middle" fill="var(--color-muted)" fontSize="10">{sub}</text>}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g stroke="var(--color-diagram)" fill="var(--color-diagram)">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.5} />
      <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} transform={`rotate(${angle} ${x2} ${y2})`} />
    </g>
  );
}
