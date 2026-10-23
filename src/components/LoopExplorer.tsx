"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { stages } from "./loop-stages";

const positions = ["left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"];

export function LoopExplorer() {
  const [active, setActive] = useState<(typeof stages)[number]["id"]>("plan");
  const stage = stages.find((s) => s.id === active) ?? stages[0];
  const pick = (id: typeof active) => { setActive(id); track("tool_used", { tool: "agent-loop", stage: id }); };
  return (
    <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(260px,360px)_1fr]">
          <div className="relative mx-auto aspect-square w-full max-w-[360px]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--color-line)" strokeWidth="2" />
              <circle cx="100" cy="100" r="86" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" className="loop-dash" />
              <circle cx="100" cy="100" r="56" fill="var(--color-surface)" stroke="var(--color-line)" />
              <text x="100" y="94" textAnchor="middle" fontSize="8.5" fill="var(--color-muted)">one unit of work</text>
              <text x="100" y="108" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--color-ink)">a claim, a ticket,</text>
              <text x="100" y="120" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--color-ink)">an invoice</text>
            </svg>
            <div role="tablist" aria-label="Agent loop stages" className="absolute inset-[7%]">
              {stages.map((s, n) => (
                <button key={s.id} role="tab" id={`stage-${s.id}`} aria-selected={s.id === active} aria-controls="stage-panel" onClick={() => pick(s.id)}
                  className={`absolute ${positions[n]} rounded-full border px-4 py-2 text-sm font-medium shadow-[var(--shadow-card)] transition-colors ${s.id === active ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink hover:border-accent"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-${stage.id}`} className="card rounded-3xl p-8">
            <p className="text-sm font-medium text-accent">{stage.name}</p>
            <p className="mt-2 text-lg leading-relaxed text-ink">{stage.what}</p>
            <div className="mt-6 rounded-2xl bg-tint p-4">
              <p className="text-xs font-medium text-muted">Evidence it keeps</p>
              <p className="mt-1 text-sm text-ink">{stage.evidence}</p>
            </div>
          </div>
        </div>
  );
}
