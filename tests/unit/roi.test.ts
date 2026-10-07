import { describe, it, expect } from "vitest";
import { calculateRoi } from "@/lib/roi";
import { siteConfig } from "@site-config";

describe("calculateRoi", () => {
  it("computes savings and payback", () => {
    const r = calculateRoi({ headcount: 10, hoursPerWeek: 10, hourlyCost: 50, automationShare: 0.6 });
    expect(r.annualHours).toBe(10 * 10 * 48);
    expect(r.annualHoursSaved).toBe(10 * 10 * 48 * 0.6);
    expect(r.annualCostSaved).toBe(10 * 10 * 48 * 0.6 * 50);
    expect(r.paybackMonths).toBeCloseTo((siteConfig.pricing.pilot / r.annualCostSaved) * 12, 5);
  });
  it("returns zero and null payback for zero headcount", () => {
    const r = calculateRoi({ headcount: 0, hoursPerWeek: 10, hourlyCost: 50, automationShare: 0.6 });
    expect(r.annualCostSaved).toBe(0);
    expect(r.paybackMonths).toBeNull();
    expect(Number.isFinite(r.annualHoursSaved)).toBe(true);
  });
  it("clamps automationShare to 0..1 and negatives to 0", () => {
    const r = calculateRoi({ headcount: -5, hoursPerWeek: 10, hourlyCost: 50, automationShare: 4 });
    expect(r.annualCostSaved).toBe(0);
    const r2 = calculateRoi({ headcount: 1, hoursPerWeek: 1, hourlyCost: 1, automationShare: 4 });
    expect(r2.annualHoursSaved).toBe(48);
  });
});
