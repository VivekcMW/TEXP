import { describe, it, expect } from "vitest";
import { siteConfig } from "@site-config";

describe("siteConfig", () => {
  it("has five target queries", () => {
    expect(siteConfig.targetQueries).toHaveLength(5);
  });
  it("has a domain without trailing slash", () => {
    expect(siteConfig.domain.endsWith("/")).toBe(false);
  });
  it("has a booking url", () => {
    expect(siteConfig.bookingUrl).toMatch(/^https:\/\//);
  });
});
