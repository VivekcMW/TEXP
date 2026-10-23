import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkflowAssessment } from "@/components/WorkflowAssessment";
import { assessWorkflow, assessmentQuestions, type AssessmentAnswer } from "@/lib/workflow-assessment";
import { track } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("qualitative workflow assessment", () => {
  it("requires complete answers rather than defaulting to a promising result", () => {
    expect(() => assessWorkflow({ process: "", access: "", review: "" })).toThrow(/Answer each/);
  });
  it("prioritises unresolved foundations over unknowns", () => {
    expect(assessWorkflow({ process: "clear", access: "needs-work", review: "unsure" }).title).toBe("Prepare the foundations first.");
    expect(assessWorkflow({ process: "clear", access: "clear", review: "unsure" }).title).toBe("Start by clarifying the unknowns.");
    expect(assessWorkflow({ process: "clear", access: "clear", review: "clear" }).title).toBe("Explore a carefully scoped pilot.");
  });
  it("offers guidance for every complete combination without numeric forecasts", () => {
    const options: AssessmentAnswer[] = ["clear", "needs-work", "unsure"];
    for (const process of options) for (const access of options) for (const review of options) {
      const result = assessWorkflow({ process, access, review });
      expect(result.guidance).toHaveLength(3);
      expect(result.guidance.every((g) => g.text.length > 20)).toBe(true);
      expect(JSON.stringify(result)).not.toMatch(/[0-9$%]/);
    }
  });
  it("starts blank, shows guidance on submit and clears stale results when answers change", () => {
    const { container } = render(<WorkflowAssessment />);
    expect(screen.getAllByRole("radio").every((radio) => !radio.hasAttribute("checked"))).toBe(true);
    expect(container.querySelector('input[type="number"], input[type="range"]')).toBeNull();
    expect(screen.getByRole("region", { name: "Assessment guidance" })).toHaveTextContent("Not a savings figure.");
    for (const question of assessmentQuestions) {
      fireEvent.click(within(screen.getByRole("group", { name: question.question })).getByRole("radio", { name: question.options[0].label }));
    }
    fireEvent.click(screen.getByRole("button", { name: "View discussion guide" }));
    expect(screen.getByText("Explore a carefully scoped pilot.")).toBeVisible();
    fireEvent.click(screen.getByRole("radio", { name: "Data or access gaps remain" }));
    expect(screen.queryByText("Explore a carefully scoped pilot.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View discussion guide" }));
    expect(screen.getByText("Prepare the foundations first.")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(track).toHaveBeenCalledTimes(2);
    for (const args of vi.mocked(track).mock.calls) {
      expect(args).toEqual(["tool_used", { tool: "workflow-assessment" }]);
    }
  });
});
