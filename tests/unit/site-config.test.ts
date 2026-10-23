import { describe, it, expect } from "vitest";
import { siteConfig } from "@site-config";

describe("siteConfig", () => {
  it("has five target queries", () => {
    expect(siteConfig.targetQueries).toHaveLength(5);
  });
  it("has a domain without trailing slash", () => {
    expect(siteConfig.domain.endsWith("/")).toBe(false);
  });
  it("publishes only the confirmed business details", () => {
    expect(siteConfig.preview).toBe(false);
    expect(siteConfig.name).toBe("TechnocientAI");
    expect(siteConfig.legalName).toBe("Technocient AI Pvt Ltd");
    expect(siteConfig.contactEmail).toBe("hello@technocient.ai");
    expect(siteConfig.domain).toBe("https://technocient.ai");
    expect(siteConfig.bookingUrl).toBe("");
    expect(siteConfig.social.linkedin).toBe("");
  });
});
