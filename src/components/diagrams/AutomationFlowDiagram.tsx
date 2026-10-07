import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
export function AutomationFlowDiagram() {
  return (
    <Diagram title="Automated workflow with a decision gate" description="A trigger starts the flow, three steps run in sequence: read the input, pull records from systems, draft a decision. A decision gate then routes confident cases to auto-complete and uncertain or high-value cases to a person." caption="Trigger, steps, decision gate, two outcomes. Uncertain or high-value cases always reach a person." viewBox="0 0 860 220">
      <Reveal><Box x={10} y={60} w={100} label="Trigger" sub="email, API, cron" /><Arrow x1={110} y1={84} x2={140} y2={84} /></Reveal>
      <Reveal delay={0.1}><Box x={140} y={60} label="Read input" sub="parse, extract" /><Arrow x1={260} y1={84} x2={290} y2={84} /></Reveal>
      <Reveal delay={0.2}><Box x={290} y={60} label="Pull records" sub="ERP, TMS, CRM" /><Arrow x1={410} y1={84} x2={440} y2={84} /></Reveal>
      <Reveal delay={0.3}><Box x={440} y={60} label="Draft decision" sub="with evidence" /><Arrow x1={560} y1={84} x2={590} y2={84} /></Reveal>
      <Reveal delay={0.4}>
        <g transform="translate(630 84)"><rect x={-34} y={-34} width={68} height={68} rx={8} transform="rotate(45)" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth={1.5} /><text textAnchor="middle" y={4} fontSize="10" fill="currentColor" fontWeight={500}>confident?</text></g>
        <Arrow x1={664} y1={60} x2={720} y2={30} /><Arrow x1={664} y1={108} x2={720} y2={150} />
      </Reveal>
      <Reveal delay={0.5}><Box x={720} y={8} w={130} label="Auto-complete" sub="logged, reversible" accent /><Box x={720} y={130} w={130} label="Hand to person" sub="with the draft" /></Reveal>
    </Diagram>
  );
}
