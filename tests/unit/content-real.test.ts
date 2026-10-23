import { describe, it, expect } from "vitest";
import { getServices, getIndustries, getCaseStudies, getInsights, getAgents } from "@/content/load";
import { validateContent } from "@/content/validate";

describe("real content", () => {
  it("has the launch counts", () => {
    expect(getServices().map((s) => s.slug)).toEqual([
      "ai-automation", "ai-strategy-readiness", "ai-talent-staffing", "custom-ai-agents", "enterprise-ai-solutions", "llm-rag-integration",
    ]);
    expect(getIndustries()).toHaveLength(7);
    expect(getCaseStudies()).toHaveLength(7);
    expect(getInsights()).toHaveLength(3);
    expect(getAgents()).toHaveLength(7);
  });
  it("validates cross references", () => {
    expect(validateContent()).toEqual({ ok: true });
  });
  it("gives every agent at least one human gate and a verify step", () => {
    for (const a of getAgents()) {
      expect(a.gates.length, a.slug).toBeGreaterThan(0);
      expect(a.tools.some((t) => t.approval !== "none"), `${a.slug} has an approval`).toBe(true);
    }
  });
  it("marks all launch case studies illustrative", () => {
    expect(getCaseStudies().every((c) => c.illustrative)).toBe(true);
  });
  it("uses qualitative outcomes and schedules without fixed costs or performance figures", () => {
    const numericClaim = /[$£€]\s*\d|\b\d[\d,.]*\s*(?:%|percent\b)|\b(?:\d+(?:[–-]\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|twelve|sixteen|twenty|thirty|forty|ninety)[ -](?:working[ -])?(?:days?|hrs?|hours?|weeks?|months?|minutes?|mins?|seconds?)\b/i;
    for (const entry of [...getServices(), ...getIndustries(), ...getCaseStudies(), ...getInsights(), ...getAgents()]) {
      expect(JSON.stringify(entry), entry.slug).not.toMatch(numericClaim);
    }
    for (const service of getServices()) {
      expect(service.timeline.length).toBeGreaterThan(20);
      expect(service).not.toHaveProperty("timelineWeeks");
    }
    for (const study of getCaseStudies()) {
      expect(study.result.summary.length).toBeGreaterThan(20);
      expect(study.result).not.toHaveProperty("value");
      expect(study).not.toHaveProperty("quote");
    }
  });
});
