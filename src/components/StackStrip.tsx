import { SectionHeading } from "./SectionHeading";

const principles = [
  { title: "Connect approved sources", body: "Identify the records and systems a workflow needs. Confirm access and integration options before choosing the architecture." },
  { title: "Define permitted actions", body: "Separate reading information from changing it. Agree permissions, exceptions and recovery options for each integration." },
  { title: "Keep review visible", body: "Decide which work can be prepared, who approves important actions and what evidence reviewers need." },
];

export function StackStrip() {
  return <section className="bg-tint" aria-label="Systems and controls">
    <div className="container-x section-space">
      <SectionHeading eyebrow="Built around your team" title="Your systems. Clear boundaries.">The starting point is your process, not a particular model or a promise to automate everything.</SectionHeading>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {principles.map((item) => <div key={item.title} className="border-t border-line pt-6">
          <h3 className="font-display text-xl">{item.title}</h3>
          <p className="mt-3 text-sm text-muted">{item.body}</p>
        </div>)}
      </div>
    </div>
  </section>;
}
