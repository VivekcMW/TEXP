import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
export function BeforeAfterDiagram({
  before = ["Read the email thread", "Find the record in the system", "Check the policy document", "Draft and send a reply"],
  after = ["Agent reads, retrieves and drafts with citations", "Person reviews exceptions and signs off"],
  beforeLabel = "Before: hours per case",
  afterLabel = "After: minutes per case",
}: { before?: string[]; after?: string[]; beforeLabel?: string; afterLabel?: string }) {
  return (
    <Diagram title="Before and after automation" description={`Two columns. Before: ${before.join(", ")}. After: ${after.join(", ")}.`} caption="The same job before and after an agent takes the repetitive steps." viewBox="0 0 860 260">
      <Reveal>
        <text x={20} y={24} fontWeight={500} fill="var(--color-muted)">{beforeLabel}</text>
        {before.map((b, i) => (
          <g key={b}>
            <Box x={20} y={40 + i * 52} w={360} h={40} label={b} />
            {i < before.length - 1 && <Arrow x1={200} y1={80 + i * 52} x2={200} y2={92 + i * 52} />}
          </g>
        ))}
      </Reveal>
      <Reveal delay={0.3}>
        <text x={480} y={24} fontWeight={500} fill="var(--color-accent)">{afterLabel}</text>
        {after.map((a, i) => (
          <g key={a}>
            <Box x={480} y={40 + i * 72} w={360} h={56} label={a} accent={i === 0} />
            {i < after.length - 1 && <Arrow x1={660} y1={96 + i * 72} x2={660} y2={112 + i * 72} />}
          </g>
        ))}
      </Reveal>
    </Diagram>
  );
}
