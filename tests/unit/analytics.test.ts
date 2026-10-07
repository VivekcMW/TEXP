import { describe, it, expect, vi } from "vitest";
import { track, _setProviderForTests } from "@/lib/analytics";
describe("track", () => {
  it("is a no-op by default and does not throw", () => { expect(() => track("cta_click", { path: "/" })).not.toThrow(); });
  it("forwards to an injected provider", () => {
    const spy = vi.fn(); _setProviderForTests({ send: spy });
    track("lead_captured", { source: "roi" });
    expect(spy).toHaveBeenCalledWith("lead_captured", { source: "roi" });
  });
});
