import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ProcessSteps } from "@/components/ProcessSteps";

const cs = {
  slug: "logistics-claims-automation", title: "Claims preparation with evidence", client: "Logistics workflow example",
  industry: "logistics", service: "ai-automation", situation: "s".repeat(40), built: "b".repeat(40),
  result: { summary: "Designed to support evidence gathering and adjuster review.", date: "2026-06" },
  illustrative: true, diagram: "automation-flow" as const,
  seo: { title: "t".repeat(10), description: "d".repeat(50) }, body: "",
};

describe("components", () => {
  it("CTABand uses the shared contact destination", () => {
    render(<CTABand />);
    const a = screen.getByRole("link", { name: /discuss your workflow/i });
    expect(a).toHaveAttribute("href", "/contact");
    expect(a).toHaveAttribute("data-cta", "primary");
  });
  it("FAQ renders questions and FAQPage json-ld", () => {
    const { container } = render(<FAQ items={[{ q: "How long?", a: "The schedule depends on your requirements." }]} />);
    expect(screen.getByText("How long?")).toBeInTheDocument();
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('"FAQPage"');
  });
  it("CaseStudyCard shows the result without an illustrative badge", () => {
    render(<CaseStudyCard caseStudy={cs} />);
    expect(screen.queryByText("Illustrative example")).not.toBeInTheDocument();
    expect(screen.getByText(cs.result.summary)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /claims preparation/i })).toHaveAttribute("href", "/case-studies/logistics-claims-automation");
  });
  it("ProcessSteps explains scoped stages without prices or fixed schedules", () => {
    render(<ProcessSteps />);
    expect(screen.getByText("Discovery")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("Scale")).toBeInTheDocument();
    expect(screen.queryByText(/from \$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Scope, pricing and delivery schedules depend/)).toBeInTheDocument();
  });
});
