import { describe, it, expect } from "vitest";
import { siteConfig } from "@site-config";

describe("siteConfig", () => {
  it("has five target queries", () => {
    expect(siteConfig.targetQueries).toHaveLength(5);
  });
  it("has a domain without trailing slash", () => {
    expect(siteConfig.domain.endsWith("/")).toBe(false);
  });
  it("does not publish fabricated preview contact details", () => {
    expect(siteConfig.preview).toBe(true);
    expect(siteConfig.bookingUrl).toBe("");
    expect(siteConfig.contactEmail).toBe("");
    expect(siteConfig.legalName).toBe("");
    expect(siteConfig.social.linkedin).toBe("");
  });
});
