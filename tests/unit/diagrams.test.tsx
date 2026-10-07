import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { diagrams, DiagramById } from "@/components/diagrams";
import { DIAGRAM_IDS } from "@/content/schemas";

describe("diagrams", () => {
  it("has a component for every diagram id", () => {
    for (const id of DIAGRAM_IDS) expect(diagrams[id]).toBeDefined();
  });
  it("renders an svg with an accessible description", () => {
    const { container } = render(<DiagramById id="rag-pipeline" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("img", { name: /retrieval-augmented generation/i })).toBeInTheDocument();
  });
});
