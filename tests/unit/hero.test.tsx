import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import { Hero } from "@/components/Hero";
import { siteConfig } from "@site-config";

it("Hero renders h1 with tagline and primary CTA", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(siteConfig.tagline);
  expect(screen.getByRole("link", { name: /book a 30-min ai audit/i })).toHaveAttribute("href", siteConfig.bookingUrl);
});
