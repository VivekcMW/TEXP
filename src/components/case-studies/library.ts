import type { CaseStudy, Industry, Service } from "@/content/schemas";

type Editorial = {
  slug: string;
  label: string;
  theme: "sand" | "blue" | "rose" | "slate" | "sage" | "lavender" | "clay";
  deck: string;
  sources: [string, string, string];
  draft: string;
  reviewer: string;
};

export const caseStudyEditorials: Editorial[] = [
  {
    slug: "logistics-claims-automation", label: "Logistics", theme: "sand",
    deck: "Connecting shipment records and claim documents, with the adjuster in control.",
    sources: ["Claim emails", "Shipment records", "Policy documents"],
    draft: "Evidence-linked claim", reviewer: "Adjuster review",
  },
  {
    slug: "healthcare-prior-auth-agents", label: "Healthcare", theme: "blue",
    deck: "Bringing the evidence together before a clinician reviews and signs.",
    sources: ["Clinical notes", "Payer criteria", "Encounter records"],
    draft: "Cited request", reviewer: "Clinician sign-off",
  },
  {
    slug: "retail-returns-assistant", label: "Retail", theme: "rose",
    deck: "A policy-backed response, with exceptions routed to the people who can decide.",
    sources: ["Order details", "Returns policy", "Customer request"],
    draft: "Policy-backed reply", reviewer: "Exception review",
  },
  {
    slug: "manufacturing-maintenance-triage", label: "Manufacturing", theme: "slate",
    deck: "Asset history and work-order context, prepared for the maintenance planner.",
    sources: ["Work orders", "Asset history", "Alarm records"],
    draft: "Triage proposal", reviewer: "Planner review",
  },
  {
    slug: "energy-outage-dispatch", label: "Energy & utilities", theme: "sage",
    deck: "Connecting incident context while keeping dispatch and safety decisions with your team.",
    sources: ["Fault reports", "Incident records", "Crew information"],
    draft: "Dispatch proposal", reviewer: "Dispatcher review",
  },
  {
    slug: "telecom-billing-disputes", label: "Telecoms", theme: "lavender",
    deck: "A cited explanation of the bill, with credits subject to agreed approval rules.",
    sources: ["Billing records", "Plan terms", "Usage evidence"],
    draft: "Cited explanation", reviewer: "Credit approval",
  },
  {
    slug: "public-sector-permit-checks", label: "Public sector", theme: "clay",
    deck: "Checking completeness and organising evidence. The officer still makes the decision.",
    sources: ["Application forms", "Requirements", "Attachments"],
    draft: "Completeness review", reviewer: "Officer decision",
  },
];

export type CaseStudyPreview = Pick<CaseStudy, "slug" | "title" | "industry" | "before" | "after" | "illustrative" | "result"> & {
  industryName: string;
  serviceName: string;
  editorial: Editorial;
};

export function toCaseStudyPreview(study: CaseStudy, industries: Industry[], services: Service[]): CaseStudyPreview {
  const editorial = caseStudyEditorials.find((item) => item.slug === study.slug);
  const industry = industries.find((item) => item.slug === study.industry);
  const service = services.find((item) => item.slug === study.service);
  if (!editorial || !industry || !service) throw new Error(`Case study "${study.slug}" needs editorial, industry and service metadata.`);
  return {
    slug: study.slug, title: study.title, industry: study.industry, before: study.before, after: study.after,
    illustrative: study.illustrative, result: study.result, industryName: industry.title, serviceName: service.title, editorial,
  };
}

export function filterCaseStudies(studies: CaseStudyPreview[], industry: string, featuredSlug?: string) {
  return studies.filter((study) => industry === "all" ? study.slug !== featuredSlug : industry === study.industry);
}
