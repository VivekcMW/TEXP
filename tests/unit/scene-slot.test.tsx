import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SceneSlot } from "@/components/scenes/SceneSlot";
describe("SceneSlot", () => {
  it("renders the poster image on first render and no canvas", () => {
    const { container } = render(<SceneSlot id="agentic-field" />);
    expect(container.querySelector('img[src="/posters/agentic-field.svg"]')).not.toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
  });
});
