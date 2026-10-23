export type ManualStep = { label: string; waiting?: boolean };
export type AgentStep = { label: string; tool: string; detail: string };
export type ProcessRun = {
  id: string;
  tab: string;
  unit: string;
  today: ManualStep[];
  agent: AgentStep[];
  checks: string;
  caseStudy?: string;
};

export const runs: ProcessRun[] = [
  {
    id: "claims", tab: "Claims", unit: "one damage claim", caseStudy: "logistics-claims-automation",
    today: [
      { label: "Email waits in the shared inbox", waiting: true },
      { label: "Handler reads the thread and photos" },
      { label: "Finds the shipment in the TMS" },
      { label: "Checks policy and cover" },
      { label: "Waits for carrier scan data", waiting: true },
      { label: "Drafts the decision in a spreadsheet" },
      { label: "Sits in the finance sign-off queue", waiting: true },
      { label: "Replies to the customer" },
    ],
    agent: [
      { label: "Reads the claim pack", tool: "documents.read", detail: "Thread and attachments" },
      { label: "Checks policy and cover", tool: "policy.lookup", detail: "Cover and agreed limits" },
      { label: "Pulls shipment and scan data", tool: "tms.query", detail: "Available delivery evidence" },
      { label: "Drafts the settlement with evidence", tool: "claims.draft", detail: "Proposed amount and reasons" },
      { label: "Adjuster verifies and approves", tool: "human.review", detail: "Simulated human approval" },
      { label: "Files and notifies the customer", tool: "claims.file", detail: "Subject to approval rules" },
    ],
    checks: "Adjuster review",
  },
  {
    id: "prior-auth", tab: "Prior auth", unit: "one prior authorisation", caseStudy: "healthcare-prior-auth-agents",
    today: [
      { label: "Referral lands in the work queue", waiting: true },
      { label: "Nurse reads the notes and imaging" },
      { label: "Looks up the payer's criteria" },
      { label: "Drafts the request letter" },
      { label: "Waits for the physician's signature", waiting: true },
      { label: "Submits through the payer portal" },
      { label: "Waits for the confirmation", waiting: true },
    ],
    agent: [
      { label: "Reads the referral and notes", tool: "ehr.read", detail: "Notes and imaging" },
      { label: "Matches the payer's criteria", tool: "payer.rules", detail: "Criteria and evidence gaps" },
      { label: "Drafts the request with citations", tool: "auth.draft", detail: "Codes and justification" },
      { label: "Clinician signs off", tool: "human.review", detail: "Simulated human approval" },
      { label: "Submits to the payer portal", tool: "portal.submit", detail: "Only after clinician approval" },
    ],
    checks: "Clinician signature",
  },
  {
    id: "returns", tab: "Returns", unit: "one returns ticket", caseStudy: "retail-returns-assistant",
    today: [
      { label: "Ticket waits in the queue", waiting: true },
      { label: "Agent reads the message and photo" },
      { label: "Looks up the order" },
      { label: "Checks the returns policy" },
      { label: "Asks a supervisor about the edge case", waiting: true },
      { label: "Issues the label and replies" },
    ],
    agent: [
      { label: "Reads the customer's message", tool: "tickets.read", detail: "Order and photo" },
      { label: "Looks up the order and policy", tool: "orders.lookup", detail: "Return-window eligibility" },
      { label: "Decides and writes the answer", tool: "answer.draft", detail: "Cites the returns policy" },
      { label: "Escalates only if unsure", tool: "confidence.check", detail: "Agreed confidence and refund limits" },
      { label: "Issues the label and replies", tool: "returns.issue", detail: "Only within agreed rules" },
    ],
    checks: "Exceptions to your team",
  },
];
