import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import CaseStudiesPage from "@/app/case-studies/page";
import { caseStudyEditorials, filterCaseStudies, toCaseStudyPreview } from "@/components/case-studies/library";
import { getCaseStudies, getIndustries, getServices } from "@/content/load";

afterEach(cleanup);
const studies = getCaseStudies().map((study) => toCaseStudyPreview(study, getIndustries(), getServices()));
const results = () => screen.getByLabelText("Case study results");

describe("editorial case study library", () => {
  it("covers every case with a specific workflow and preserves source-backed metadata", () => {
    expect(caseStudyEditorials.map((item) => item.slug).sort()).toEqual(getCaseStudies().map((study) => study.slug).sort());
    expect(new Set(caseStudyEditorials.map((item) => item.theme)).size).toBe(7);
    for (const study of studies) {
      expect(study.editorial.sources).toHaveLength(3);
      expect(study.illustrative).toBe(true);
      expect(study.industryName).not.toBe("");
      expect(study.serviceName).not.toBe("");
    }
    expect(() => toCaseStudyPreview({ ...getCaseStudies()[0], slug: "unmapped-study" }, getIndustries(), getServices())).toThrow(/needs editorial/);
  });

  it("renders an editorial hero, featured story and every link without a canvas", () => {
    const { container } = render(CaseStudiesPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The work. The thinking behind it.");
    expect(screen.getByRole("link", { name: "Read the workflow" })).toHaveAttribute("href", "/case-studies/logistics-claims-automation");
    expect(within(results()).getAllByRole("article")).toHaveLength(6);
    for (const study of studies) {
      if (study.slug === "logistics-claims-automation") continue;
      expect(within(results()).getByRole("link", { name: study.title })).toHaveAttribute("href", `/case-studies/${study.slug}`);
    }
    expect(screen.getByText(/Illustrative designs, not verified customer results/)).toBeVisible();
    expect(within(results()).getAllByText("Illustrative example")).toHaveLength(6);
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("filters by industry and includes the featured workflow when relevant", () => {
    render(CaseStudiesPage());
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Logistics" }));
    expect(within(results()).getAllByRole("article")).toHaveLength(1);
    expect(within(results()).getByRole("article")).toHaveAttribute("data-case-study", "logistics-claims-automation");
    expect(screen.getByRole("status")).toHaveTextContent("1 example");
    fireEvent.click(screen.getByRole("button", { name: "Healthcare" }));
    expect(within(results()).getByRole("article")).toHaveAttribute("data-case-study", "healthcare-prior-auth-agents");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("button", { name: "All industries" })).toHaveAttribute("aria-pressed", "true");
    expect(within(results()).getAllByRole("article")).toHaveLength(6);
  });

  it("keeps the native industry selector and filter buttons in sync", () => {
    render(CaseStudiesPage());
    fireEvent.change(screen.getByRole("combobox", { name: "Industry" }), { target: { value: "public-sector" } });
    expect(screen.getByRole("button", { name: "Public sector" })).toHaveAttribute("aria-pressed", "true");
    expect(within(results()).getByRole("article")).toHaveAttribute("data-case-study", "public-sector-permit-checks");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("combobox", { name: "Industry" })).toHaveValue("all");
  });

  it("filters deterministically without duplicating the featured example or inventing results", () => {
    expect(filterCaseStudies(studies, "all", "logistics-claims-automation")).toHaveLength(6);
    expect(filterCaseStudies(studies, "healthcare", "logistics-claims-automation")).toHaveLength(1);
    expect(filterCaseStudies(studies, "logistics", "logistics-claims-automation")).toHaveLength(1);
    expect(filterCaseStudies(studies, "unknown")).toHaveLength(0);
    expect(JSON.stringify(caseStudyEditorials)).not.toMatch(/[$£€]\s*\d|\d+\s*%|\d+\s*(?:days?|weeks?)/i);
  });
});
