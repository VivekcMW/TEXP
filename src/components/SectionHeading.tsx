import { cn } from "@/lib/utils";
export function SectionHeading({ eyebrow, title, as: As = "h2", children, className }: { eyebrow?: string; title: string; as?: "h1" | "h2"; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {eyebrow}
        </p>
      )}
      <As className={cn("font-display tracking-tight text-balance", As === "h1" ? "text-[length:var(--text-step-4)] leading-[1.02]" : "text-[length:var(--text-step-3)] leading-[1.08]")}>{title}</As>
      {children && <div className="prose-x mt-4 text-muted">{children}</div>}
    </div>
  );
}
