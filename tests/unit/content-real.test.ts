import { describe, it, expect } from "vitest";
import { getServices, getIndustries, getCaseStudies, getInsights } from "@/content/load";
import { validateContent } from "@/content/validate";

describe("real content", () => {
  it("has the launch counts", () => {
    expect(getServices().map((s) => s.slug)).toEqual([
      "ai-automation", "ai-strategy-readiness", "ai-talent-staffing", "custom-ai-agents", "enterprise-ai-solutions", "llm-rag-integration",
    ]);
    expect(getIndustries()).toHaveLength(4);
    expect(getCaseStudies()).toHaveLength(3);
    expect(getInsights()).toHaveLength(3);
  });
  it("validates cross references", () => {
    expect(validateContent()).toEqual({ ok: true });
  });
  it("marks all launch case studies illustrative", () => {
    expect(getCaseStudies().every((c) => c.illustrative)).toBe(true);
  });
});
