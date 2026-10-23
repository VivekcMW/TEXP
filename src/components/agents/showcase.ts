import type { Agent, CaseStudy } from "@/content/schemas";

export type WorkbenchKind = "claims" | "returns" | "billing" | "healthcare" | "maintenance" | "outage" | "permits";
export type AgentPresentation = {
  slug: string;
  label: string;
  purpose: string;
  request: string;
  output: string;
  color: string;
  kind: WorkbenchKind;
  artwork: string;
};

export const agentPresentations: AgentPresentation[] = [
  {
    slug: "claims-intake", label: "Claims", kind: "claims", color: "#40866e",
    artwork: "Claims inspection desk with stacked parcels and an evidence scanner.",
    purpose: "From a crowded inbox to a claim ready for review.",
    request: "My shipment arrived damaged. I've attached the delivery photos and order reference.",
    output: "An evidence-backed settlement draft. Filing and notification follow only when the approval rules allow.",
  },
  {
    slug: "returns-desk", label: "Returns", kind: "returns", color: "#7d9060",
    artwork: "Returns station with a parcel conveyor and a return-label printer.",
    purpose: "Less back-and-forth. A clearer next step for your customer.",
    request: "I'd like to return this order. Can you check whether it's eligible and help with the label?",
    output: "For an eligible return, a label and a policy-grounded reply. Out-of-policy requests go to a person.",
  },
  {
    slug: "billing-disputes", label: "Billing", kind: "billing", color: "#5b899d",
    artwork: "Billing desk with a statement dashboard and a credit-review chart.",
    purpose: "Find the reason behind the charge, not just another reply.",
    request: "This month's bill is higher than expected. Can you explain the extra charge?",
    output: "A cited explanation and an applied or proposed credit, depending on the agreed threshold.",
  },
  {
    slug: "prior-authorisation", label: "Authorisations", kind: "healthcare", color: "#6986a7",
    artwork: "Authorisation desk with clinical documents and a medical checklist.",
    purpose: "The paperwork moves. Clinical judgement stays with clinicians.",
    request: "This referral needs payer authorisation. Please prepare the request and supporting notes.",
    output: "A request with matched criteria and clinical citations. Every submission needs a clinician's signature.",
  },
  {
    slug: "maintenance-triage", label: "Maintenance", kind: "maintenance", color: "#9b835d",
    artwork: "Maintenance bench with an exposed gear and diagnostic tools.",
    purpose: "Turn a new work order into a plan your team can act on.",
    request: "A new equipment fault has been reported. Please check the history and prepare the triage.",
    output: "A proposed priority, technician and parts list for approval. Safety flags stay with the maintenance lead.",
  },
  {
    slug: "outage-dispatch", label: "Dispatch", kind: "outage", color: "#598d87",
    artwork: "Dispatch station with a network map and utility poles.",
    purpose: "Connect the reports. Prepare the response. Keep people in charge.",
    request: "Several customers have reported a fault in the same area. Please prepare a dispatch recommendation.",
    output: "A dispatch draft linked to the incident and asset records. A dispatcher or control room approves it.",
  },
  {
    slug: "permit-checks", label: "Permits", kind: "permits", color: "#938269",
    artwork: "Permit desk with a building model, plans and a document stamp.",
    purpose: "Complete files for your officers. Clearer answers for applicants.",
    request: "A new permit application has arrived. Please check the documents against the requirements.",
    output: "A completeness check, missing-document request and routing recommendation. An officer decides the application.",
  },
];

export type ShowcaseAgent = Pick<Agent, "slug" | "title" | "trigger" | "unit" | "steps" | "autonomy" | "tools" | "gates" | "evidence"> & {
  presentation: AgentPresentation;
  industryName: string;
  proof?: Pick<CaseStudy, "slug" | "title" | "before" | "after" | "illustrative" | "result">;
};

export const DEMO_STEP_MS = 4800;
export const isHumanReview = (step: Agent["steps"][number] | undefined) => step?.tool === "human.review";
