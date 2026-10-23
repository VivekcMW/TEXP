import type { Industry } from "@/content/schemas";

export type IndustrySceneId = "logistics" | "healthcare" | "retail" | "manufacturing" | "energy-utilities" | "telecommunications" | "public-sector";
export type WorkflowSpot = { title: string; detail: string; position: [number, number, number] };
export type IndustrySceneDefinition = {
  id: IndustrySceneId;
  label: string;
  color: string;
  environment: string;
  alt: string;
  boundary: string;
  spots: [WorkflowSpot, WorkflowSpot, WorkflowSpot];
};

export const industryScenes: IndustrySceneDefinition[] = [
  {
    id: "logistics", label: "Logistics", color: "#b17a37", environment: "The connected logistics hub",
    alt: "An isometric logistics hub with warehouse shelves, a parcel conveyor and a delivery truck.",
    boundary: "Your team reviews exceptions and controls customer-facing actions.",
    spots: [
      { title: "Claims preparation", detail: "Bring shipment records and claim documents together for an adjuster to review.", position: [-2.6, .15, -.8] },
      { title: "Document handling", detail: "Extract and reconcile paperwork against permitted shipment sources.", position: [0, .15, .1] },
      { title: "Shipment exceptions", detail: "Prepare a status update or exception handoff using your routing and approval rules.", position: [2.8, .15, 1] },
    ],
  },
  {
    id: "healthcare", label: "Healthcare", color: "#4c8d9d", environment: "Care, with the paperwork connected",
    alt: "An isometric clinic with a reception desk, examination bed and medical imaging room.",
    boundary: "Clinicians remain responsible for care and coverage decisions. Patient data needs approved access.",
    spots: [
      { title: "Patient communication", detail: "Prepare answers from approved information and route clinical questions to the care team.", position: [-2.7, .15, .5] },
      { title: "Prior authorisation", detail: "Assemble evidence and a draft request for a named clinician to review and sign.", position: [0, .15, .1] },
      { title: "Documentation", detail: "Help organise clinical documents with traceable sources and appropriate access controls.", position: [2.7, .15, -.7] },
    ],
  },
  {
    id: "retail", label: "Retail", color: "#b57c70", environment: "From the shop floor to the support queue",
    alt: "An isometric retail store with a striped awning, product displays, shopping bags and a returns counter.",
    boundary: "Refunds follow your policy and approval limits. Payment data stays outside the model path.",
    spots: [
      { title: "Product questions", detail: "Bring catalogue details and available stock information into a source-backed answer.", position: [-2.7, .15, -.5] },
      { title: "Merchandising", detail: "Reconcile supplier files and surface discrepancies for the merchandising team.", position: [0, .15, -.5] },
      { title: "Returns support", detail: "Prepare a policy-backed response and route refund decisions through your approval rules.", position: [2.7, .15, 1] },
    ],
  },
  {
    id: "manufacturing", label: "Manufacturing", color: "#6c83a1", environment: "A clearer picture of the plant floor",
    alt: "An isometric factory with a robotic assembly cell, moving conveyor and industrial machine.",
    boundary: "The scene is illustrative: agents support work orders, not machine control or safety-critical actions.",
    spots: [
      { title: "Maintenance triage", detail: "Gather permitted asset history and work-order evidence for a maintenance planner.", position: [-2.8, .15, -.6] },
      { title: "Quality investigations", detail: "Link production records and relevant documents to a proposed investigation trail.", position: [0, .15, .6] },
      { title: "Shift handovers", detail: "Prepare an evidence-linked handover so the next shift can review unresolved work.", position: [2.7, .15, -.3] },
    ],
  },
  {
    id: "energy-utilities", label: "Energy & utilities", color: "#77905a", environment: "The work around essential infrastructure",
    alt: "An isometric energy site with a turning wind turbine, solar panels and a utility substation.",
    boundary: "Agents work in tickets, dispatch and reporting. Operational technology remains separate.",
    spots: [
      { title: "Outage handling", detail: "Match incoming fault reports to known incidents and prepare an evidence-linked handoff.", position: [-2.8, .15, -.5] },
      { title: "Regulatory reporting", detail: "Assemble draft reporting material with source records for a named person to review.", position: [0, .15, .7] },
      { title: "Field dispatch", detail: "Prepare crew and asset context, with safety-related decisions remaining with authorised staff.", position: [2.8, .15, -.4] },
    ],
  },
  {
    id: "telecommunications", label: "Telecoms", color: "#8b7ca5", environment: "A connected network, a connected service team",
    alt: "An isometric telecom network centre with antenna towers, server racks and a customer service desk.",
    boundary: "Credits and network changes require your configured permissions and human approval gates.",
    spots: [
      { title: "Change tickets", detail: "Organise the context for a network change request so an authorised person can review it.", position: [-2.8, .15, -.6] },
      { title: "Order fallout", detail: "Reconcile permitted provisioning and billing records and flag discrepancies.", position: [0, .15, -.5] },
      { title: "Billing disputes", detail: "Draft a response using plan terms and usage evidence, with credits subject to your rules.", position: [2.7, .15, 1] },
    ],
  },
  {
    id: "public-sector", label: "Public sector", color: "#9c8760", environment: "Public services, with a clear record",
    alt: "An isometric civic campus with a columned public building, records office and application desk.",
    boundary: "Officers decide rights, entitlements and applications. Agents gather, draft and record.",
    spots: [
      { title: "Permit checks", detail: "Check application completeness against published requirements for an officer to review.", position: [-2.5, .15, -.6] },
      { title: "Records requests", detail: "Gather relevant records from approved sources while preserving access and retention rules.", position: [0, .15, 1] },
      { title: "Casework routing", detail: "Prepare a routing recommendation with supporting evidence and an accountable human decision.", position: [2.8, .15, .1] },
    ],
  },
];

export type IndustryExperience = Pick<Industry, "slug" | "title" | "summary"> & { scene: IndustrySceneDefinition };

export function toIndustryExperience(industry: Industry): IndustryExperience {
  const scene = industryScenes.find((item) => item.id === industry.slug);
  if (!scene) throw new Error(`Industry "${industry.slug}" needs its own 3D environment.`);
  return { slug: industry.slug, title: industry.title, summary: industry.summary, scene };
}
