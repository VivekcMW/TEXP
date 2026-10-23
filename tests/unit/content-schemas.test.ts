import { describe, it, expect } from "vitest";
import { ServiceSchema, CaseStudySchema } from "@/content/schemas";

const validService = {
  title: "AI Automation & Agentic Workflows",
  summary: "Automate multi-step operational work with agents that plan, act and verify.",
  targetQuery: "AI automation consulting",
  problem: "Teams spend hours on repetitive, multi-system work.",
  approach: ["Map the process", "Build the agent", "Measure"],
  deliverables: ["Agent", "Runbook"],
  timeline: "The schedule depends on agreed scope and system access.",
  caseStudy: "logistics-claims-automation",
  faq: [{ q: "How long?", a: "The schedule is agreed after reviewing requirements." }],
  diagram: "agent-loop",
  seo: { title: "AI Automation Consulting", description: "Agentic workflow consulting built around enterprise processes and approval rules." },
};

const validCaseStudy = {
  title: "Claims preparation with evidence",
  client: "Logistics workflow example",
  industry: "logistics",
  service: "ai-automation",
  situation: "A claims workflow involves gathering evidence across several operational systems.",
  built: "An agent gathers relevant evidence and prepares a recommendation for human review.",
  result: { summary: "Designed to support evidence gathering and adjuster review.", date: "2026-06" },
  illustrative: true,
  diagram: "automation-flow",
  seo: { title: "Claims workflow example", description: "An illustrative approach to preparing claims for review, with evaluation required." },
};

describe("ServiceSchema", () => {
  it("accepts a valid service", () => {
    expect(ServiceSchema.safeParse(validService).success).toBe(true);
  });
  it("rejects seo.title over 60 characters", () => {
    const r = ServiceSchema.safeParse({ ...validService, seo: { ...validService.seo, title: "x".repeat(61) } });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path.join(".")).toBe("seo.title");
  });
  it("rejects unknown diagram id", () => {
    expect(ServiceSchema.safeParse({ ...validService, diagram: "robot" }).success).toBe(false);
  });
  it("requires a scoped schedule instead of a fixed duration", () => {
    const result = ServiceSchema.safeParse({ ...validService, timeline: undefined, timelineWeeks: 8 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(["timeline"]);
  });
});

describe("CaseStudySchema", () => {
  it("accepts qualitative examples without fabricated testimonials", () => {
    expect(CaseStudySchema.safeParse(validCaseStudy).success).toBe(true);
  });
  it("rejects legacy quantitative results without a qualitative summary", () => {
    const r = CaseStudySchema.safeParse({
      ...validCaseStudy,
      result: { metric: "cost", value: 31, period: "per year", date: "2026-06" },
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(["result", "summary"]);
  });
});
