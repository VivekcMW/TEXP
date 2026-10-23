import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
export function EngagementModelDiagram() {
  const steps = [
    { label: "Discovery", sub: "Agree scope and requirements" },
    { label: "Pilot", sub: "Evaluate against your process" },
    { label: "Scale", sub: "Expand after review" },
  ];
  return (
    <Diagram title="Engagement model" description="Discovery, pilot and scale, with a review before proceeding to the next stage." caption="Scope, pricing and delivery schedules are agreed around your requirements." viewBox="0 0 860 120">
      {steps.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.12}>
          <Box x={20 + i * 290} y={30} w={240} h={56} label={s.label} sub={s.sub} accent={i === 1} />
          {i < 2 && <Arrow x1={260 + i * 290} y1={58} x2={308 + i * 290} y2={58} />}
        </Reveal>
      ))}
    </Diagram>
  );
}
