import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "@/components/Nav";
import { siteConfig } from "@site-config";

describe("Nav", () => {
  it("renders the company name and primary links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute("href", "/");
    for (const label of ["Services", "Industries", "Case studies", "Insights", "About"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute("href", "/contact");
  });
});
