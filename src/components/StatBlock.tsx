export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-[length:var(--text-step-4)] leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}
