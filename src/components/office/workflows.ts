export const stations = [
  { id: "intake", name: "Intake" },
  { id: "research", name: "Research" },
  { id: "policy", name: "Policy" },
  { id: "review", name: "Human review" },
  { id: "execution", name: "Execution" },
] as const;

export type StationId = (typeof stations)[number]["id"];
export type WorkflowId = "claims" | "returns" | "prior-auth";
type Activity = { title: string; evidence: string };
export type OfficeWorkflow = {
  id: WorkflowId;
  label: string;
  request: string;
  approval: boolean;
  activities: Record<StationId, Activity>;
  exception: Activity;
  result: string;
};

export const officeWorkflows: OfficeWorkflow[] = [
  {
    id: "claims", label: "Claims",
    request: "My shipment arrived damaged.", approval: true,
    activities: {
      intake: { title: "Turning an email into a claim", evidence: "Reference, photos and attachments organised." },
      research: { title: "Finding the shipment's story", evidence: "Delivery record and carrier exception linked." },
      policy: { title: "Checking cover, with evidence", evidence: "Policy checked. Settlement proposed." },
      review: { title: "An adjuster has the final say", evidence: "Simulated human approval: the adjuster checks the evidence." },
      execution: { title: "Closing the loop with the customer", evidence: "Approved reply sent. Case and audit trail updated." },
    },
    exception: { title: "A delivery record is missing", evidence: "An adjuster must request evidence. No settlement or reply is issued." },
    result: "Claim filed. Customer informed. Every step recorded.",
  },
  {
    id: "returns", label: "Returns",
    request: "I'd like to return this order.", approval: false,
    activities: {
      intake: { title: "Understanding the return request", evidence: "Order and return reason captured." },
      research: { title: "Looking up the order", evidence: "Purchase date, delivery and item retrieved." },
      policy: { title: "An eligible return, within your rules", evidence: "Within the return window. No approval needed." },
      review: { title: "A supervisor reviews the exception", evidence: "Your team decides unclear eligibility." },
      execution: { title: "Making the return easy", evidence: "Label sent. Customer notified. Ticket updated." },
    },
    exception: { title: "This order is outside the return window", evidence: "Supervisor review required. No label or refund is issued." },
    result: "Return label sent. Ticket resolved within your policy.",
  },
  {
    id: "prior-auth", label: "Prior authorisation",
    request: "Prepare this prior authorisation.", approval: true,
    activities: {
      intake: { title: "Organising the referral", evidence: "Sample referral, notes and documents collected." },
      research: { title: "Gathering the relevant criteria", evidence: "Payer criteria linked to clinical records." },
      policy: { title: "Preparing a cited request", evidence: "Draft cites payer criteria. No clinical decision made." },
      review: { title: "The clinician signs off", evidence: "Simulated human approval: the clinician checks the citations." },
      execution: { title: "Submitting the approved request", evidence: "Submission logged. Payer decision pending." },
    },
    exception: { title: "Supporting clinical evidence is missing", evidence: "Care team review required. Nothing is submitted." },
    result: "Submission logged. Payer decision pending.",
  },
];

export const STEP_MS = 6000;
export const HOLD_MS = 5000;
export function workflowFor(id: WorkflowId): OfficeWorkflow {
  return officeWorkflows.find((workflow) => workflow.id === id)!;
}
export function workflowSteps(workflow: OfficeWorkflow, exception: boolean): StationId[] {
  return workflow.approval || exception
    ? ["intake", "research", "policy", "review", "execution"]
    : ["intake", "research", "policy", "execution"];
}

export type OfficeState = {
  workflowId: WorkflowId;
  exception: boolean;
  step: number;
  elapsed: number;
  playing: boolean;
  complete: boolean;
};
export const initialOfficeState: OfficeState = {
  workflowId: "claims", exception: false, step: 0, elapsed: 0, playing: true, complete: false,
};
export type OfficeAction =
  | { type: "workflow"; id: WorkflowId; autoPlay: boolean }
  | { type: "exception"; enabled: boolean; autoPlay: boolean }
  | { type: "replay"; autoPlay: boolean }
  | { type: "pause" | "play" | "next" }
  | { type: "tick"; ms: number };

export function officeReducer(state: OfficeState, action: OfficeAction): OfficeState {
  const steps = workflowSteps(workflowFor(state.workflowId), state.exception);
  const advance = (): OfficeState => {
    if (state.step === steps.length - 1 || (state.exception && steps[state.step] === "review")) {
      return { ...state, elapsed: 0, complete: true };
    }
    return { ...state, step: state.step + 1, elapsed: 0 };
  };
  switch (action.type) {
    case "workflow":
      return { ...initialOfficeState, workflowId: action.id, exception: state.exception, playing: action.autoPlay };
    case "exception":
      return { ...initialOfficeState, workflowId: state.workflowId, exception: action.enabled, playing: action.autoPlay };
    case "replay":
      return { ...initialOfficeState, workflowId: state.workflowId, exception: state.exception, playing: action.autoPlay };
    case "pause": return { ...state, playing: false };
    case "play": return { ...state, playing: true };
    case "next": return state.complete ? state : { ...advance(), playing: false };
    case "tick":
      if (!state.playing) return state;
      if (state.complete) return state.elapsed + action.ms >= HOLD_MS
        ? { ...state, step: 0, elapsed: 0, complete: false }
        : { ...state, elapsed: state.elapsed + action.ms };
      return state.elapsed + action.ms >= STEP_MS ? advance() : { ...state, elapsed: state.elapsed + action.ms };
  }
}
