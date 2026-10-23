"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
export function LeadGate({ payload, onUnlocked }: { payload: Record<string, unknown>; onUnlocked: () => void }) {
  const [email, setEmail] = useState(""); const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ email, source: "roi", payload }) });
      if (res.ok) { track("lead_captured", { source: "roi" }); onUnlocked(); }
      else { const b = await res.json().catch(() => ({ errors: { _: "Try again" } })); setErr(b.errors?.email ?? b.errors?._ ?? "Try again"); }
    } catch { setErr("Could not reach the server. Try again."); }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-2">
      <label className="block text-sm">Work email for the payback breakdown
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2" />
      </label>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <button disabled={busy} className="btn btn-primary btn-sm disabled:opacity-60">{busy ? "Sending…" : "Show payback"}</button>
    </form>
  );
}
