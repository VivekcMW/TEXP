export const siteConfig = {
  name: "Northstar AI", // placeholder company name
  legalName: "Northstar AI Consulting Ltd", // placeholder
  domain: "https://example.com", // placeholder; no trailing slash
  tagline: "Cut operating cost with agentic AI workflows",
  positioning:
    "We help mid-to-large enterprises cut operating cost using agentic AI workflows.",
  headlineNumber: { value: "31%", label: "average operating cost reduction in pilots" },
  bookingUrl: "https://cal.com/example/ai-audit-30",
  contactEmail: "hello@example.com",
  social: { linkedin: "https://www.linkedin.com/company/example" },
  pricing: { discoverySprint: 15000, pilot: 60000, scale: 150000, currency: "USD" },
  targetQueries: [
    "AI automation consulting",
    "agentic workflow consulting",
    "LLM integration services",
    "AI strategy for enterprises",
    "AI consulting for logistics",
  ],
  founders: [
    {
      id: "founder-1",
      name: "Founder Name",
      role: "Founder & CEO",
      bio: "20 years building operations software; previously led AI at a logistics platform.",
      linkedin: "https://www.linkedin.com/in/example",
    },
  ],
  securityPosture: "GDPR-aligned; SOC 2 on the roadmap",
  showSecurityPosture: true,
  analytics: { provider: "none" as "none" | "plausible" | "ga4", id: "" },
  markets: ["US", "UK", "Middle East", "India"],
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
