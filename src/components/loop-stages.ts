export const stages = [
  { id: "plan", name: "Plan", what: "Reads the task and the policy that governs it, breaks the work into steps and decides which tools each step needs.", evidence: "The plan is written to the log before anything runs, so you can see what the agent intended." },
  { id: "act", name: "Act", what: "Calls your systems through explicit, permissioned tools: read a document, look up a record, draft an output. Nothing happens outside a tool.", evidence: "Every call, its inputs and its result are recorded with a timestamp." },
  { id: "observe", name: "Observe", what: "Checks what came back against the plan. Missing data, a contradiction or a low-confidence answer triggers a retry or an escalation.", evidence: "A confidence score and the reasons behind it are attached to each step." },
  { id: "verify", name: "Verify", what: "A person approves anything above the risk threshold you set. The threshold moves only when the measured error rate earns it.", evidence: "Approvals, edits and rejections are kept and feed the next evaluation." },
] as const;
