export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="md:border-r md:border-line md:pr-16">
      <p className="font-display text-[length:var(--text-step-4)] leading-none tracking-tight text-accent">{value}</p>
      <p className="mt-2 max-w-[22ch] text-sm text-muted">{label}</p>
    </div>
  );
}
