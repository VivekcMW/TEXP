import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { BeforeAfterHero } from "@/components/BeforeAfterHero";
import { runs } from "@/components/runs";
import { LoopExplorer } from "@/components/LoopExplorer";
import { stages } from "@/components/loop-stages";
import { StackStrip } from "@/components/StackStrip";

afterEach(cleanup);

describe("BeforeAfterHero", () => {
  it("offers one tab per process and switches both sides on click", () => {
    render(<BeforeAfterHero />);
    expect(screen.getAllByRole("tab")).toHaveLength(runs.length);
    expect(screen.getByText(runs[0].today[0].label)).toBeInTheDocument();
    expect(screen.getByText(runs[0].agent[0].label)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: runs[2].tab }));
    expect(screen.getByRole("tab", { name: runs[2].tab })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(runs[2].today[0].label)).toBeInTheDocument();
    expect(screen.getByText(runs[2].agent[0].label)).toBeInTheDocument();
  });
  it("uses qualitative descriptions instead of cycle-time claims", () => {
    render(<BeforeAfterHero />);
    expect(screen.getByText("Outcomes require evaluation")).toBeInTheDocument();
    expect(screen.queryByText("Cycle time")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replay/i })).toBeInTheDocument();
  });
});

describe("workflow examples", () => {
  it("keeps one comparison per case study", () => {
    expect(runs.every((r) => r.caseStudy)).toBe(true);
  });
});

describe("LoopExplorer", () => {
  it("shows the selected stage's description", () => {
    render(<LoopExplorer />);
    expect(screen.getByText(stages[0].what)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Verify" }));
    expect(screen.getByRole("tab", { name: "Verify" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(stages[3].what)).toBeInTheDocument();
    expect(screen.getByText(stages[3].evidence)).toBeInTheDocument();
  });
});

describe("StackStrip", () => {
  it("explains scoped integration and review without a competing brand animation", () => {
    render(<StackStrip />);
    expect(screen.getByRole("heading", { name: "Connect approved sources" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Define permitted actions" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Keep review visible" })).toBeVisible();
    expect(screen.queryByText("Anthropic")).not.toBeInTheDocument();
  });
});
