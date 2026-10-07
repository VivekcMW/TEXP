import { describe, it, expect } from "vitest";
import { buildMetadata, absoluteUrl, faqJsonLd, breadcrumbJsonLd, organizationJsonLd, serviceJsonLd } from "@/lib/seo";
import { siteConfig } from "@site-config";

describe("seo", () => {
  it("absoluteUrl joins domain and path", () => {
    expect(absoluteUrl("/services/ai-automation")).toBe(`${siteConfig.domain}/services/ai-automation`);
  });
  it("buildMetadata sets canonical and og url", () => {
    const m = buildMetadata({ title: "AI Automation Consulting", description: "x".repeat(60), path: "/services/ai-automation" });
    expect(m.alternates?.canonical).toBe("/services/ai-automation");
    expect((m.openGraph as { url?: string }).url).toBe(absoluteUrl("/services/ai-automation"));
    expect(m.title).toBe("AI Automation Consulting");
  });
  it("buildMetadata throws on over-length title", () => {
    expect(() => buildMetadata({ title: "x".repeat(61), description: "y".repeat(60), path: "/" })).toThrow(/60/);
  });
  it("faqJsonLd maps questions", () => {
    const ld = faqJsonLd([{ q: "Q?", a: "A." }]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("A.");
  });
  it("breadcrumbJsonLd numbers positions from 1", () => {
    const ld = breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]);
    expect(ld.itemListElement[1].position).toBe(2);
    expect(ld.itemListElement[1].item).toBe(absoluteUrl("/services"));
  });
  it("organizationJsonLd uses config", () => {
    expect(organizationJsonLd().name).toBe(siteConfig.name);
  });
  it("serviceJsonLd names provider", () => {
    const ld = serviceJsonLd({ slug: "ai-automation", title: "AI Automation", summary: "s".repeat(40) });
    expect(ld.provider.name).toBe(siteConfig.name);
    expect(ld.url).toBe(absoluteUrl("/services/ai-automation"));
  });
});
