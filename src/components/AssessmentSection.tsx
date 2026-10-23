import { LazyWorkflowAssessment } from "./LazyPanels";

export function AssessmentSection() {
  return (
    <section className="container-x pb-24" aria-label="Explore your workflow">
      <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-glow blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-32 -bottom-40 h-96 w-96 rounded-full bg-glow-2 blur-3xl" aria-hidden />
        <LazyWorkflowAssessment />
      </div>
    </section>
  );
}
