import { Diagram } from "./Diagram";
import { Reveal } from "./Reveal";
const layers = [
  { name: "Applications", sub: "help desk, ERP, Slack, portals" },
  { name: "Orchestration & agents", sub: "workflows, tools, checkpoints, audit log" },
  { name: "Models", sub: "gateway, routing, cost controls" },
  { name: "Data", sub: "retrieval layer, permissions, classification" },
];
export function EnterpriseStackDiagram() {
  return (
    <Diagram title="Enterprise AI foundation" description="Four horizontal layers stacked top to bottom: applications, orchestration and agents, models, data. A governance and security bracket spans all four on the right." caption="A shared foundation every team ships on, with governance spanning every layer." viewBox="0 0 860 300">
      {layers.map((l, i) => (
        <Reveal key={l.name} delay={i * 0.1}>
          <rect x={20} y={20 + i * 64} width={700} height={52} rx={10} fill="var(--color-surface)" stroke={i === 1 ? "var(--color-accent)" : "var(--color-line)"} strokeWidth={i === 1 ? 1.5 : 1} />
          <text x={40} y={42 + i * 64} fontWeight={500} fill="currentColor">{l.name}</text>
          <text x={40} y={60 + i * 64} fontSize="10" fill="var(--color-muted)">{l.sub}</text>
          {i < layers.length - 1 && <line x1={370} y1={72 + i * 64} x2={370} y2={84 + i * 64} stroke="var(--color-diagram)" strokeDasharray="3 3" />}
        </Reveal>
      ))}
      <Reveal delay={0.45}>
        <path d="M 740 20 h 18 v 236 h -18" fill="none" stroke="var(--color-diagram)" strokeWidth={1.5} />
        <text x={800} y={130} transform="rotate(90 800 130)" textAnchor="middle" fontWeight={500} fill="currentColor">Governance & security</text>
        <text x={818} y={130} transform="rotate(90 818 130)" textAnchor="middle" fontSize="10" fill="var(--color-muted)">identity, logging, data classes, model approval</text>
      </Reveal>
    </Diagram>
  );
}
