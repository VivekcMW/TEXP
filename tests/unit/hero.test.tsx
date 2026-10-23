import { render, screen } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import { Hero } from "@/components/Hero";

vi.mock("@/components/scenes/useSceneAllowed", () => ({ useSceneAllowed: () => false }));

it("Hero introduces the operations office and retains the audit CTA", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your work moves forward. Your team stays in control.");
  expect(screen.getByRole("link", { name: /discuss your workflow/i })).toHaveAttribute("href", "/contact");
  expect(screen.getByRole("link", { name: /explore the agents/i })).toHaveAttribute("href", "/agents");
  expect(screen.getByRole("region", { name: "Interactive AI operations office" })).toBeInTheDocument();
  const office = screen.getByRole("region", { name: "Interactive AI operations office" });
  expect(office.compareDocumentPosition(screen.getByRole("heading", { level: 1 })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
