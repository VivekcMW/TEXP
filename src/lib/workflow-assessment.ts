export type AssessmentAnswer = "clear" | "needs-work" | "unsure";
export type AssessmentKey = "process" | "access" | "review";
export type AssessmentAnswers = Record<AssessmentKey, AssessmentAnswer | "">;

export const assessmentQuestions: {
  key: AssessmentKey;
  question: string;
  options: { value: AssessmentAnswer; label: string }[];
  guidance: Record<AssessmentAnswer, string>;
}[] = [
  {
    key: "process", question: "How well defined is the process?",
    options: [
      { value: "clear", label: "Repeatable, with known exceptions" },
      { value: "needs-work", label: "Varies or is not documented" },
      { value: "unsure", label: "Not sure yet" },
    ],
    guidance: {
      clear: "Document representative cases and exceptions, then agree what a useful pilot should test.",
      "needs-work": "Map the current workflow with its owner before deciding whether AI is appropriate.",
      unsure: "Ask the process owner to describe the routine work, exceptions and decision points.",
    },
  },
  {
    key: "access", question: "Can the required information be accessed appropriately?",
    options: [
      { value: "clear", label: "Sources and access owners are known" },
      { value: "needs-work", label: "Data or access gaps remain" },
      { value: "unsure", label: "Not sure yet" },
    ],
    guidance: {
      clear: "Confirm permissions, data quality and source maintenance with the relevant owners.",
      "needs-work": "Resolve source, permission and integration dependencies before committing to delivery.",
      unsure: "Identify the systems involved and who can approve access and data handling.",
    },
  },
  {
    key: "review", question: "Who approves exceptions and important actions?",
    options: [
      { value: "clear", label: "Reviewers and boundaries are identified" },
      { value: "needs-work", label: "Approval ownership needs work" },
      { value: "unsure", label: "Not sure yet" },
    ],
    guidance: {
      clear: "Agree escalation rules, evidence requirements and acceptance criteria with those reviewers.",
      "needs-work": "Assign decision owners and define which actions must wait for human approval.",
      unsure: "Discuss risk and accountability with the process owner and appropriate reviewers.",
    },
  },
];

export function assessWorkflow(answers: AssessmentAnswers) {
  if (assessmentQuestions.some(({ key }) => !answers[key])) {
    throw new Error("Answer each workflow question before viewing the assessment.");
  }
  const values = Object.values(answers);
  const title = values.includes("needs-work")
    ? "Prepare the foundations first."
    : values.includes("unsure")
      ? "Start by clarifying the unknowns."
      : "Explore a carefully scoped pilot.";
  return {
    title,
    guidance: assessmentQuestions.map(({ key, question, guidance }) => {
      const answer = answers[key];
      if (!answer) throw new Error(`Missing assessment answer: ${key}`);
      return { question, text: guidance[answer] };
    }),
  };
}
