import { siteConfig } from "@site-config";
export type RoiInput = { headcount: number; hoursPerWeek: number; hourlyCost: number; automationShare: number };
export type RoiResult = { annualHours: number; annualHoursSaved: number; annualCostSaved: number; paybackMonths: number | null };
const WEEKS = 48;
const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
export function calculateRoi(i: RoiInput): RoiResult {
  const headcount = nonNeg(i.headcount), hours = nonNeg(i.hoursPerWeek), cost = nonNeg(i.hourlyCost);
  const share = Math.min(1, nonNeg(i.automationShare));
  const annualHours = headcount * hours * WEEKS;
  const annualHoursSaved = annualHours * share;
  const annualCostSaved = annualHoursSaved * cost;
  const paybackMonths = annualCostSaved > 0 ? (siteConfig.pricing.pilot / annualCostSaved) * 12 : null;
  return { annualHours, annualHoursSaved, annualCostSaved, paybackMonths };
}
