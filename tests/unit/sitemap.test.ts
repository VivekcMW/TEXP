import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { absoluteUrl } from "@/lib/seo";

describe("sitemap", () => {
  it("includes public content but excludes the retired Insights section", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of ["/", "/services", "/agents", "/industries", "/case-studies", "/about", "/contact", "/tools/ai-roi-calculator", "/services/ai-automation", "/industries/healthcare", "/case-studies/logistics-claims-automation"]) {
      expect(urls).toContain(absoluteUrl(p));
    }
    expect(urls).not.toContain(absoluteUrl("/api/leads"));
    expect(urls.some((url) => url.includes("/insights"))).toBe(false);
  });
});
