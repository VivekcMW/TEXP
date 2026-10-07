import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CTABand } from "@/components/CTABand";
import { FAQ } from "@/components/FAQ";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { siteConfig } from "@site-config";

const cs = {
  slug: "logistics-claims-automation", title: "Claims handling cut", client: "Confidential logistics company",
  industry: "logistics", service: "ai-automation", situation: "s".repeat(40), built: "b".repeat(40),
  result: { metric: "claim cycle time", value: 94, unit: "%", period: "reduction", date: "2026-06" },
  quote: { text: "q".repeat(20), name: "n", role: "r" }, illustrative: true, diagram: "automation-flow" as const,
  seo: { title: "t".repeat(10), description: "d".repeat(50) }, body: "",
};

describe("components", () => {
  it("CTABand links to the booking url with primary marker", () => {
    render(<CTABand />);
    const a = screen.getByRole("link", { name: /book a 30-min ai audit/i });
    expect(a).toHaveAttribute("href", siteConfig.bookingUrl);
    expect(a).toHaveAttribute("data-cta", "primary");
  });
  it("FAQ renders questions and FAQPage json-ld", () => {
    const { container } = render(<FAQ items={[{ q: "How long?", a: "Eight weeks." }]} />);
    expect(screen.getByText("How long?")).toBeInTheDocument();
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('"FAQPage"');
  });
  it("CaseStudyCard shows illustrative badge and result", () => {
    render(<CaseStudyCard caseStudy={cs} />);
    expect(screen.getByText("Illustrative example")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /claims handling cut/i })).toHaveAttribute("href", "/case-studies/logistics-claims-automation");
  });
  it("ProcessSteps shows three stages with from-prices", () => {
    render(<ProcessSteps />);
    expect(screen.getByText("Discovery sprint")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("Scale")).toBeInTheDocument();
    expect(screen.getAllByText(/from \$/i)).toHaveLength(3);
  });
});
