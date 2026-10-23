"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { assessWorkflow, assessmentQuestions, type AssessmentAnswers } from "@/lib/workflow-assessment";
import { track } from "@/lib/analytics";

export function WorkflowAssessment() {
  const id = useId();
  const [answers, setAnswers] = useState<AssessmentAnswers>({ process: "", access: "", review: "" });
  const [result, setResult] = useState<ReturnType<typeof assessWorkflow> | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative grid gap-10 p-6 md:grid-cols-2 md:p-12">
      <form className="space-y-6" onSubmit={(event) => {
        event.preventDefault();
        if (assessmentQuestions.some(({ key }) => !answers[key])) {
          setError("Please answer each question before viewing your discussion guide.");
          return;
        }
        setError("");
        setResult(assessWorkflow(answers));
        track("tool_used", { tool: "workflow-assessment" });
        resultRef.current?.focus();
      }}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Workflow assessment</p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-[length:var(--text-step-2)] leading-tight">Where should you start?</h2>
          <p className="mt-3 text-sm text-muted">Describe the process, its information sources and its review needs. Get a qualitative guide to what to discuss next.</p>
        </div>
        {assessmentQuestions.map(({ key, question, options }) => <fieldset key={key}>
          <legend className="mb-2 text-sm font-medium">{question}</legend>
          <div className="grid gap-2">
            {options.map((option) => <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-line px-3 py-2.5 text-sm has-[:checked]:border-accent has-[:checked]:bg-tint">
              <input className="mt-1 accent-[var(--color-accent)]" type="radio" name={`${id}-${key}`} required
                value={option.value} checked={answers[key] === option.value}
                onChange={() => { setAnswers((current) => ({ ...current, [key]: option.value })); setResult(null); setError(""); }} />
              <span>{option.label}</span>
            </label>)}
          </div>
        </fieldset>)}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn btn-primary btn-sm">View discussion guide</button>
      </form>
      <div ref={resultRef} tabIndex={-1} role="region" aria-label="Assessment guidance" className="self-start rounded-2xl bg-tint p-6 md:sticky md:top-24">
        <p className="text-xs font-medium text-accent">{result ? "Your next conversation" : "No generic forecasts"}</p>
        <div aria-live="polite" aria-atomic="true">
          <h3 className="mt-3 font-display text-2xl leading-tight">{result?.title ?? "Start with the work. Not a savings figure."}</h3>
          {result ? <ul className="mt-5 space-y-4">{result.guidance.map((item) => <li key={item.question} className="text-sm text-muted">{item.text}</li>)}</ul>
            : <p className="mt-4 text-sm text-muted">Complete the questions to identify useful next steps. This tool does not calculate costs, savings, delivery dates or payback.</p>}
        </div>
        <p className="mt-6 border-t border-line pt-4 text-xs text-muted">This is a discussion guide, not a readiness certification or a promise of results. Pricing, timing and potential benefits depend on discovery and evaluation.</p>
        <Link href="/contact" className="btn btn-primary btn-sm mt-6">Discuss your workflow</Link>
        <p className="mt-3 text-xs text-muted">Your answers stay in this page; no email is required.</p>
      </div>
    </div>
  );
}
