export const siteConfig = {
  name: "TechnocientAI",
  preview: true,
  legalName: "",
  domain: "http://localhost:3000",
  tagline: "AI workflows built around your team",
  positioning:
    "We help enterprises explore and build AI workflows around their processes, systems and approval rules.",
  engagementNote: "Scope, pricing and delivery schedules are agreed after reviewing your requirements.",
  bookingUrl: "",
  contactEmail: "",
  social: { linkedin: "" },
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
  analytics: { provider: "none" as "none" | "plausible" | "ga4", id: "" },
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
