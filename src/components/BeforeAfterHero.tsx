"use client";
import { useEffect, useRef, useState } from "react";
import { runs } from "./runs";

// Both paths use the same animation pace, not measured processing times.
const LOOP_MS = 16000;
const HOLD_MS = 2500;

// Analytics loads on first interaction so the hero's first-load script stays small.
const track = (props: Record<string, string>) => import("@/lib/analytics").then((m) => m.track("tool_used", props));

export function BeforeAfterHero() {
  const [runId, setRunId] = useState(runs[0].id);
  const [t, setT] = useState(0);              // 0..1 through the manual timeline
  const [still, setStill] = useState(false);
  const [side, setSide] = useState<"today" | "agent">("agent");
  const [cycle, setCycle] = useState(0);
  const raf = useRef<number>(0);
  const run = runs.find((r) => r.id === runId) ?? runs[0];

  useEffect(() => {
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setStill(true); setT(1); return; }
    let start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed > LOOP_MS + HOLD_MS) { start = now; setT(0); }
      else setT(Math.min(1, elapsed / LOOP_MS));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [runId, cycle]);

  const pick = (id: string) => { if (id !== runId) { setRunId(id); setT(0); track({ tool: "before-after", run: id }); } };
  const replay = () => { setCycle((c) => c + 1); setT(0); track({ tool: "before-after", run: runId, action: "replay" }); };

  const todaySteps = run.today.map((s, index) => ({ ...s, start: index / run.today.length, end: (index + 1) / run.today.length }));
  const agentProgress = t;
  const agentDone = agentProgress >= 1;
  const agentActive = Math.min(run.agent.length - 1, Math.floor(agentProgress * run.agent.length));

  const panel = (which: "today" | "agent") => (which === "today" ? (
    <div className="flex h-full flex-col p-5 md:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted">Today</p>
          <p className="mt-1 text-sm text-ink">{run.unit}, by hand</p>
        </div>
      </header>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-muted transition-[width] duration-150" style={{ width: `${t * 100}%` }} /></div>
      <ol className="mt-4 flex-1 space-y-1">
        {todaySteps.map((s) => {
          const state = t >= s.end ? "done" : t >= s.start && !still ? "active" : "todo";
          return (
            <li key={s.label} className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${state === "active" ? "bg-bg" : ""}`}>
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${state === "done" ? "bg-muted" : state === "active" ? (s.waiting ? "bg-muted animate-pulse" : "bg-ink") : "border border-line"}`} />
              <span className={`flex-1 ${state === "todo" ? "text-muted/70" : state === "done" ? "text-muted" : "text-ink"}`}>{s.label}</span>
              {s.waiting && <span className="text-xs text-muted">Handoff</span>}
            </li>
          );
        })}
      </ol>
    </div>
  ) : (
    <div className="flex h-full flex-col bg-glow/40 p-5 md:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-accent">With an agent</p>
          <p className="mt-1 text-sm text-ink">{run.unit}, {agentDone || still ? "done" : "running"}</p>
        </div>
      </header>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent transition-[width] duration-150" style={{ width: `${agentProgress * 100}%` }} /></div>
      <ol className="mt-4 flex-1 space-y-1">
        {run.agent.map((s, n) => {
          const state = still || agentDone || n < agentActive ? "done" : n === agentActive ? "active" : "todo";
          return (
            <li key={s.label} className={`flex items-start gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${state === "active" ? "bg-surface" : ""}`}>
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                {state === "done" && <svg width="16" height="16" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" className="fill-accent" /><path d="M5.5 9.5l2.3 2.3 4.7-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {state === "active" && <svg width="16" height="16" viewBox="0 0 18 18" className="spin text-accent"><circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" /><path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                {state === "todo" && <span className="block h-3.5 w-3.5 rounded-full border border-line" />}
              </span>
              <span className="flex-1">
                <span className={`block ${state === "todo" ? "text-muted/70" : "text-ink"}`}>{s.label}</span>
                <span className="block font-mono text-[11px] text-muted">{s.tool}{state !== "todo" ? ` · ${s.detail}` : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div><p className="text-xs text-muted">Workflow example</p><p className="text-sm text-accent">Outcomes require evaluation</p></div>
        <div><p className="text-xs text-muted">Human checks</p><p className="text-sm text-ink">{run.checks}</p></div>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col text-left">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/80 px-4 py-3">
        <div role="tablist" aria-label="Choose a process" className="flex gap-1 overflow-x-auto">
          {runs.map((r) => (
            <button key={r.id} role="tab" id={`tab-${r.id}`} aria-selected={r.id === runId} aria-controls="compare-panel" onClick={() => pick(r.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${r.id === runId ? "bg-ink text-white" : "text-muted hover:bg-tint hover:text-ink"}`}>
              {r.tab}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full bg-tint p-0.5 md:hidden" role="group" aria-label="Show">
            {(["today", "agent"] as const).map((s) => (
              <button key={s} onClick={() => setSide(s)} aria-pressed={side === s} className={`rounded-full px-3 py-1 text-xs font-medium ${side === s ? "bg-surface text-ink shadow-[var(--shadow-card)]" : "text-muted"}`}>{s === "today" ? "Today" : "With an agent"}</button>
            ))}
          </div>
          {!still && (
            <button onClick={replay} aria-label="Replay" className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-tint hover:text-ink">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v5h5" /></svg>
            </button>
          )}
        </div>
      </div>
      <div id="compare-panel" role="tabpanel" aria-labelledby={`tab-${run.id}`} className="grid md:grid-cols-2 md:divide-x md:divide-line/80">
        <div className={side === "today" ? "" : "hidden md:block"}>{panel("today")}</div>
        <div className={side === "agent" ? "" : "hidden md:block"}>{panel("agent")}</div>
      </div>
    </div>
  );
}
