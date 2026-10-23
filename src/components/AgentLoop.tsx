import { LazyLoopExplorer as LoopExplorer } from "./LazyPanels";
export { stages } from "./loop-stages";

const guardrails = [
  { name: "Human approval gates", body: "Money, patients and customers never move without a named approver until the numbers say otherwise.", path: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /><path d="M17 3l3 3-3 3" /></> },
  { name: "Citations on every answer", body: "Each output points at the documents and records it used, so a reviewer checks sources rather than guessing.", path: <><path d="M6 4h9l4 4v12H6z" /><path d="M15 4v4h4" /><path d="M9 13h6M9 17h4" /></> },
  { name: "Full audit log", body: "Plans, tool calls, results and decisions are stored in your environment and exportable for compliance.", path: <><path d="M4 5h16v14H4z" /><path d="M8 10h8M8 14h5" /></> },
  { name: "Reversible actions", body: "Writes to your systems go through a staging step that can be rolled back for a set window.", path: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v5h5" /></> },
];

export function AgentLoop() {
  return (
    <section className="band" aria-labelledby="loop-title">
      <div className="container-x py-24">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />Inside an agent</p>
          <h2 id="loop-title" className="font-display text-[length:var(--text-step-3)] leading-[1.08] tracking-tight text-balance">Four moves, repeated until the work is done</h2>
          <p className="mt-4 text-muted">Pick a stage to see what the agent does there and what evidence it leaves behind.</p>
        </div>
        <LoopExplorer />
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guardrails.map((g) => (
            <li key={g.name} className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent shadow-[var(--shadow-card)]" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{g.path}</svg>
              </span>
              <div>
                <p className="font-medium">{g.name}</p>
                <p className="mt-1 text-sm text-muted">{g.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
