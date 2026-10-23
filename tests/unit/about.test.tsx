import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AboutPage, { metadata } from "@/app/about/page";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@site-config";

afterEach(cleanup);

describe("About and shared footer cleanup", () => {
  it("preserves the company story without publishing the team or breadcrumbs", () => {
    const { container } = render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Why this company exists");
    expect(screen.getByText(/Useful AI starts/)).toBeVisible();
    expect(screen.getAllByRole("link", { name: "Discuss your workflow" })).toHaveLength(1);
    expect(screen.queryByRole("heading", { name: "The team" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Meet the team" })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
    for (const founder of siteConfig.founders) expect(screen.queryByText(founder.name)).not.toBeInTheDocument();
    expect(metadata.description).not.toMatch(/meet the team/i);
  });

  it("removes the badge and market statement while preserving contact and navigation", () => {
    render(<Footer />);
    expect(screen.queryByText(/GDPR-aligned|SOC 2 on the roadmap|Working across|Markets:/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "LinkedIn" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Website preview/)).not.toBeInTheDocument();
    expect(screen.getByText(/Technocient AI Pvt Ltd/)).toBeVisible();
    expect(within(screen.getByRole("navigation", { name: "Company" })).getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.queryByRole("link", { name: "Discuss your workflow" })).not.toBeInTheDocument();
  });
});
