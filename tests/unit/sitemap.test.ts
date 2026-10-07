import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { absoluteUrl } from "@/lib/seo";

describe("sitemap", () => {
  it("includes core pages and every content entry", () => {
    const urls = sitemap().map((e) => e.url);
    for (const p of ["/", "/services", "/industries", "/case-studies", "/insights", "/about", "/contact", "/tools/ai-roi-calculator", "/services/ai-automation", "/industries/healthcare", "/case-studies/logistics-claims-automation", "/insights/ai-readiness-checklist"]) {
      expect(urls).toContain(absoluteUrl(p));
    }
    expect(urls).not.toContain(absoluteUrl("/api/leads"));
  });
});
