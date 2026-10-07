import { describe, it, expect } from "vitest";
import { ServiceSchema, CaseStudySchema } from "@/content/schemas";

const validService = {
  title: "AI Automation & Agentic Workflows",
  summary: "Automate multi-step operational work with agents that plan, act and verify.",
  targetQuery: "AI automation consulting",
  problem: "Teams spend hours on repetitive, multi-system work.",
  approach: ["Map the process", "Build the agent", "Measure"],
  deliverables: ["Agent", "Runbook"],
  timelineWeeks: 8,
  caseStudy: "logistics-claims-automation",
  faq: [{ q: "How long?", a: "Eight weeks." }],
  diagram: "agent-loop",
  seo: { title: "AI Automation Consulting", description: "Agentic workflow consulting for enterprises that want measured cost savings." },
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
});

describe("CaseStudySchema", () => {
  it("requires result unit and date", () => {
    const r = CaseStudySchema.safeParse({
      title: "T", client: "Confidential logistics company", industry: "logistics", service: "ai-automation",
      situation: "s", built: "b", result: { metric: "cost", value: 31, period: "per year" },
      quote: { text: "q", name: "n", role: "r" }, illustrative: true, diagram: "automation-flow",
      seo: { title: "t", description: "d" },
    });
    expect(r.success).toBe(false);
  });
});
