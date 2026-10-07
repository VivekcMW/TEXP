"use client";
import { useState } from "react";
import { calculateRoi } from "@/lib/roi";
import { formatMoney } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { LeadGate } from "./LeadGate";

const fields = [
  { key: "headcount", label: "People in the process", min: 0, step: 1 },
  { key: "hoursPerWeek", label: "Hours each spends on it per week", min: 0, step: 1 },
  { key: "hourlyCost", label: "Loaded hourly cost ($)", min: 0, step: 5 },
  { key: "automationShare", label: "Share you expect to automate (%)", min: 0, step: 5 },
] as const;
type Key = (typeof fields)[number]["key"];

export function ROICalculator() {
  const [v, setV] = useState<Record<Key, number>>({ headcount: 10, hoursPerWeek: 8, hourlyCost: 45, automationShare: 60 });
  const [unlocked, setUnlocked] = useState(false);
  const r = calculateRoi({ ...v, automationShare: v.automationShare / 100 });
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <form className="space-y-5" onChange={() => track("tool_used", { tool: "roi" })} onSubmit={(e) => e.preventDefault()}>
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm">{f.label}</span>
            <input type="number" min={f.min} step={f.step} value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2" />
          </label>
        ))}
      </form>
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-sm text-muted">Estimated annual saving</p>
        <p className="font-display text-[length:var(--text-step-4)] leading-none">{formatMoney(r.annualCostSaved)}</p>
        <p className="mt-2 text-sm text-muted">{Math.round(r.annualHoursSaved).toLocaleString()} hours a year</p>
        {unlocked ? (
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Hours in the process today</dt><dd>{r.annualHours.toLocaleString()}</dd></div>
            <div className="flex justify-between"><dt>Pilot payback</dt><dd>{r.paybackMonths === null ? "No payback at these inputs" : `${r.paybackMonths.toFixed(1)} months`}</dd></div>
          </dl>
        ) : (
          <LeadGate payload={{ ...v, ...r }} onUnlocked={() => setUnlocked(true)} />
        )}
      </div>
    </div>
  );
}
