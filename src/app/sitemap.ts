import type { MetadataRoute } from "next";
import { getServices, getIndustries, getCaseStudies, getInsights } from "@/content/load";
import { absoluteUrl } from "@/lib/seo";

export const STATIC_ROUTES = ["/", "/services", "/industries", "/case-studies", "/insights", "/tools/ai-roi-calculator", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC_ROUTES.map((p) => ({ url: absoluteUrl(p), lastModified: now })),
    ...getServices().map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now })),
    ...getIndustries().map((i) => ({ url: absoluteUrl(`/industries/${i.slug}`), lastModified: now })),
    ...getCaseStudies().map((c) => ({ url: absoluteUrl(`/case-studies/${c.slug}`), lastModified: now })),
    ...getInsights().map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: new Date(a.updatedAt) })),
  ];
}
