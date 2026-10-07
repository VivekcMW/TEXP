import { describe, it, expect } from "vitest";
import { evaluateSceneAllowed } from "@/components/scenes/useSceneAllowed";
const base = { reducedMotion: false, webgl: true, deviceMemory: 8, saveData: false, effectiveType: "4g" };
describe("evaluateSceneAllowed", () => {
  it("allows on a capable device", () => expect(evaluateSceneAllowed(base)).toBe(true));
  it("blocks on reduced motion", () => expect(evaluateSceneAllowed({ ...base, reducedMotion: true })).toBe(false));
  it("blocks without webgl", () => expect(evaluateSceneAllowed({ ...base, webgl: false })).toBe(false));
  it("blocks on low memory", () => expect(evaluateSceneAllowed({ ...base, deviceMemory: 2 })).toBe(false));
  it("blocks on save-data or slow network", () => {
    expect(evaluateSceneAllowed({ ...base, saveData: true })).toBe(false);
    expect(evaluateSceneAllowed({ ...base, effectiveType: "3g" })).toBe(false);
  });
  it("treats unknown memory as allowed", () => expect(evaluateSceneAllowed({ ...base, deviceMemory: undefined })).toBe(true));
});
